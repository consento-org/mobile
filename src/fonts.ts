import * as Font from 'expo-font'

export enum Fonts {
  RobotoBold = 'Roboto-Bold',
  RobotoRegular = 'Roboto-Regular',
  RobotoMedium = 'Roboto-Medium',
  PalanquinDarkBold = 'PalanquinDark-Bold',
  PalanquinDarkMedium = 'PalanquinDark-Medium',
  PalanquinDarkRegular = 'PalanquinDark-Regular',
  PalanquinDarkSemiBold = 'PalanquinDark-SemiBold'
}

export async function loadFonts (): Promise<void> {
  await Font.loadAsync({
    [Fonts.RobotoBold]: require('../assets/fonts/Roboto-Bold.ttf'),
    [Fonts.RobotoRegular]: require('../assets/fonts/Roboto-Regular.ttf'),
    [Fonts.RobotoMedium]: require('../assets/fonts/Roboto-Medium.ttf'),
    [Fonts.PalanquinDarkBold]: require('../assets/fonts/PalanquinDark-Bold.ttf'),
    [Fonts.PalanquinDarkMedium]: require('../assets/fonts/PalanquinDark-Medium.ttf'),
    [Fonts.PalanquinDarkRegular]: require('../assets/fonts/PalanquinDark-Regular.ttf'),
    [Fonts.PalanquinDarkSemiBold]: require('../assets/fonts/PalanquinDark-SemiBold.ttf')
  })
}
