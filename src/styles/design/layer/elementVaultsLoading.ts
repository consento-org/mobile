// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'

export const elementVaultsLoading = {
  name: 'elementVaultsLoading',
  place: forSize(375, 970),
  backgroundColor: Color.white,
  layers: {
    loadingData: new TextBox('loadingData', 'Loading data …', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 66.5, y: 408, w: 243, h: 66, r: 65.5, b: 496 }),
    placeholder: new Polygon('placeholder', { x: 89, y: 187, w: 190, h: 190, r: 96, b: 593 }, '#d8d8d8ff', {
      fill: '#979797ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
