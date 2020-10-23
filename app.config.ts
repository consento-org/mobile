declare const process: {
  env: any
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./app.config.json')

export default {
  ...config,
  expo: {
    ...config.expo,
    ios: {
      ...config.expo.ios,
      buildNumber: process.env.EXPO_BUILDNUMBER ?? config.expo.ios.buildNumber
    },
    android: {
      ...config.expo.android,
      versionCode: parseInt(process.env.EXPO_VERSIONCODE ?? config.expo.android.versionCode, 10)
    },
    extra: {
      ...config.extra,
      SCREENSHOT_SERVER_URL: process.env.SCREENSHOT_SERVER_URL
    }
  }
}
