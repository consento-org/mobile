#!/usr/bin/env node
const { createServer } = require('http')
const { createWriteStream, stat, unlinkSync } = require('fs')
const { readdir, unlink } = require('fs').promises
const { Transform } = require('stream')
const { spawn } = require('child_process')
const jsonBody = require('body/json')
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

function getFileInfo (header) {
  const headerStr = header.toString()
  const filename = /filename="([^"]+)"/ig.exec(headerStr)
  const contentType = /Content-Type: ([^ \n\r]+)/ig.exec(headerStr)
  const contentLength = /Content-Length: (\d+)/ig.exec(headerStr)
  return {
    filename: filename && filename[1],
    contentType: contentType && contentType[1],
    contentLength: contentLength ? parseInt(contentLength[1], 10) : -1
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
            const localPath = `${__dirname}/recorded/${fileInfo.filename}`
            if (fileInfo.contentLength === -1) {
              next(Object.assign(new Error('Content-Length required'), { httpStatus: 411 }))
              return
            }
            let verify = (error) => {
              verify = () => {}
              if (error) {
                next(error)
                return
              }
              stat(localPath, (error, stat) => {
                if (error) {
                  next(error)
                  return
                }
                if (stat.size !== fileInfo.contentLength) {
                  unlinkSync(localPath)
                  next(Object.assign(new Error(`Didnt receive whole file ${fileInfo.filename},  ${stat.size} !== ${fileInfo.contentLength}. You need to try again.`), { httpStatus: 417 }))
                  return
                }
                next()
              })
            }
            stream.pipe(createWriteStream(localPath))
              .on('error', verify)
              .on('close', verify)
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

async function processDevice (req) {
  const body = await new Promise((resolve, reject) => jsonBody(req, (error, result) => error
    ? reject(Object.assign(new Error('Cant parse JSON body'), { httpStatus: 400 }))
    : resolve(result)
  ))
  const { installationId, screenshots } = body
  if (installationId === null || installationId === undefined) {
    throw Object.assign(new Error('Missing installationId json property'), { httpStatus: 400 })
  }
  if (!Array.isArray(screenshots)) {
    throw Object.assign(new Error('Screenshots property is not Array'), { httpStatus: 400 })
  }
  let index = devices.indexOf(installationId)
  if (index === -1) {
    index = devices.length
    devices.push(installationId)
    if (index === 0) {
      if (process.argv.includes('--clear')) {
        console.log(`Clearing: ${screenshots.join(', ')}`)
        for (const screenshot of screenshots) {
          if (typeof screenshot !== 'string') {
            throw new Error(`Unexpected screenshot: ${screenshot}`)
          }
          try {
            await unlink(`${__dirname}/recorded/${screenshot}.png`)
          } catch (err) {
            if (err.code !== 'ENOENT') {
              console.log(`Cant delete ${screenshot}.png`)
              console.error(err)
            }
          }
        }
      }
      console.log(`Main Device decided, Installation ID: ${installationId}`)
    }
  }
  return `device-${index}`
}

async function processList () {
  const list = (await readdir(`${__dirname}/recorded`))
    .filter(name => /\.png/.test(name)) // Only .pngs
    .map(name => name.substr(0, name.length - 4)) // Without endings

  return JSON.stringify(list, null, 2)
}

async function processRequest (req) {
  if (req.url === '/post') {
    return processScreenshot(req)
  }
  if (req.url === '/device') {
    return processDevice(req)
  }
  if (req.url === '/list') {
    return processList()
  }
  throw Object.assign(new Error('not-found'), { httpStatus: 404 })
}

const server = createServer((req, res) => {
  processRequest(req)
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
  try {
    const cmd = ['npx', 'expo', 'start']
    console.log(`${cmd.join(' ')}`)
    const child = spawn(cmd[0], cmd.slice(1), {
      cwd: `${__dirname}/..`,
      env: {
        ...process.env,
        SCREENSHOT_SERVER_URL: serverUrl
      }
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
