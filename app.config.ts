declare const process: {
  env: any
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./app.config.json')

export default {
  ...config,
  expo: {
    ...config.expo,
    extra: {
      ...config.extra,
      SCREENSHOT_SERVER_URL: process.env.SCREENSHOT_SERVER_URL
    }
  }
}
