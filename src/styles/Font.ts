// This file has been generated with expo-export, a Sketch plugin.
import * as ExpoFont from 'expo-font'

export enum Font {
  RobotoRegular = 'Roboto-Regular',
  RobotoMedium = 'Roboto-Medium',
  RobotoBold = 'Roboto-Bold',
  PalanquinDarkMedium = 'PalanquinDark-Medium'
}

export async function loadFonts (): Promise<void> {
  await ExpoFont.loadAsync({
    [Font.RobotoRegular]: require('../../assets/fonts/Roboto-Regular.ttf'),
    [Font.RobotoMedium]: require('../../assets/fonts/Roboto-Medium.ttf'),
    [Font.RobotoBold]: require('../../assets/fonts/Roboto-Bold.ttf'),
    [Font.PalanquinDarkMedium]: require('../../assets/fonts/PalanquinDark-Medium.ttf')
  })
}
