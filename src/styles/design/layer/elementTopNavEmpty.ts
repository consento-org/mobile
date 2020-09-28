// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { Polygon } from '../../util/Polygon'

export const elementTopNavEmpty = {
  name: 'elementTopNavEmpty',
  place: forSize(360, 60),
  backgroundColor: Color.grey,
  layers: {
    title: new TextBox('title', 'Vaults', TextStyles.H5RobotoRegular24BlackCenter, { x: 55, y: 19, w: 250, h: 36, r: 55, b: 5 }),
    logo: new ImagePlacement('logo', ImageAsset.iconLogo, { x: 9, y: 10, w: 40, h: 40, r: 311, b: 10 }),
    borderTop: new Polygon('borderTop', { y: 58.25, w: 360, h: 2, b: -0.25 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
