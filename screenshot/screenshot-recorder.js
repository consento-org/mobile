#!/usr/bin/env node
const { createServer } = require('http')
const { createWriteStream } = require('fs')
const { Transform } = require('stream')
const { spawn } = require('child_process')
const { networkInterfaces } = require('os')
const Nicer = require('Nicer')

function getBoundary (req) {
  const contentType = req.headers['content-type']
  if (!contentType) {
    throw new Error('content-type not found')
  }
  let boundary = /; boundary=(.+)/.exec(contentType)
  if (!boundary) {
    throw new Error('boundary not found')
  }

  ([, boundary] = boundary)
  return boundary
}

function setupApp (serverUrl) {
  const { writeFileSync, readFileSync } = require('fs')
  const app = require('../app.json')

  app.name = 'consento-screenshot'
  app.expo.entryPoint = './screenshot/index.js'

  const newJSON = JSON.stringify(app, null, 2)
  const appPath = `${__dirname}/app.json`

  const currentJSON = readFileSync(appPath)

  if (currentJSON !== newJSON) {
    writeFileSync(appPath, newJSON)
    console.log('Updated ./screenshot/app.json')
  }

  const indexPath = `${__dirname}/index.js`
  const templatePath = `${__dirname}/index.template.js`
  const template = readFileSync(templatePath, 'utf8')
  const currentIndex = readFileSync(indexPath, 'utf8')

  const newIndex = template.replace('$$serverUrl', serverUrl)

  if (newIndex !== currentIndex) {
    writeFileSync(indexPath, newIndex)
    console.log('Updated ./screenshot/index.js')
  }
}

function getFileInfo (header) {
  const headerStr = header.toString()
  const filename = /filename="([^"]+)"/ig.exec(headerStr)
  const contentType = /Content-Type: ([^ \n\r]+)/ig.exec(headerStr)
  return {
    filename: filename && filename[1],
    contentType: contentType && contentType[1]
  }
}

const fileReg = /^[a-z0-9_-]+(\.[a-z0-9]+)?$/i

async function processScreenshot (req) {
  const boundary = getBoundary(req)
  await new Promise((resolve, reject) => {
    req
      .pipe(new Nicer({ boundary }))
      .pipe(new Transform({
        objectMode: true,
        transform ({ header, stream }, _, next) {
          const fileInfo = getFileInfo(header)
          if (fileReg.test(fileInfo.filename)) {
            stream.pipe(createWriteStream(`${__dirname}/recorded/${fileInfo.filename}`))
              .on('error', next)
              .on('close', next)
            return
          }
          next()
        },
        final: () => { resolve() }
      }))
      .on('error', reject)
      .on('close', resolve)
  })
  return 'ok'
}

const devices = []

async function processDevice (req, res) {
  const deviceId = req.headers['installation-id']
  if (deviceId === null || deviceId === undefined) {
    throw Object.assign(new Error('Missing installation-id header'), { httpStatus: 400 })
  }
  let index = devices.indexOf(deviceId)
  if (index === -1) {
    index = devices.length
    devices.push(deviceId)
  }
  return `device-${index}`
}

async function processRequest (req, res) {
  if (req.url === '/post') {
    return processScreenshot(req, res)
  }
  if (req.url === '/device') {
    return processDevice(req, res)
  }
  throw Object.assign(new Error('not-found'), { httpStatus: 404 })
}

const server = createServer((req, res) => {
  processRequest(req, res)
    .then(
      data => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(data)
      },
      err => {
        console.error(err)
        res.writeHead(err.httpStatus || 500, { 'Content-Type': 'text/plain' })
        res.end(err.message)
      }
    )
})
const conn = server.listen(5432, () => {
  const serverUrl = `http://${networkInterfaces().en0.find(network => network.family === 'IPv4').address}:${conn.address().port}`
  console.log(`Listening to ${serverUrl}`)
  setupApp(serverUrl)
  try {
    const child = spawn('npx', ['expo', 'start', '--config', 'screenshot/app.json'], {
      cwd: `${__dirname}/..`
    })
    child.stdout.pipe(process.stdout, { end: false })
    child.stderr.pipe(process.stderr, { end: false })
    child.on('close', () => {
      console.log('Closing screenshot receiver')
      conn.close()
      process.exit()
    })
    process.on('SIGINT', (signal) => {
      child.kill(signal)
    })
  } catch (err) {
    console.error(err)
    conn.close()
  }
})
conn.on('close', () => {
  console.log('Stopped listening.')
})
