// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import * as ExpoFont from 'expo-font'

export enum Font {
  RobotoMedium = 'Roboto-Medium',
  RobotoRegular = 'Roboto-Regular',
  RobotoBold = 'Roboto-Bold',
  Helvetica = 'Helvetica'
}

export async function loadFonts (): Promise<void> {
  await ExpoFont.loadAsync({
    [Font.RobotoMedium]: require('../../assets/fonts/Roboto-Medium.ttf'),
    [Font.RobotoRegular]: require('../../assets/fonts/Roboto-Regular.ttf'),
    [Font.RobotoBold]: require('../../assets/fonts/Roboto-Bold.ttf'),
    [Font.Helvetica]: require('../../assets/fonts/Helvetica.ttf')
  })
}
