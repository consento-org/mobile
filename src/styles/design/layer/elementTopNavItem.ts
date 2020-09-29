// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementTopNavItem = {
  name: 'elementTopNavItem',
  place: forSize(360, 60),
  backgroundColor: Color.grey,
  layers: {
    borderTop: new Polygon('borderTop', { y: 59.5, w: 360, h: 1, b: -0.5 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    title: new TextBox('title', 'Vault Name', TextStyles.H5RobotoRegular24BlackCenter, { x: 52, y: 17, w: 259, h: 31, r: 49, b: 12 }),
    edit: new ImagePlacement('edit', ImageAsset.iconEditGrey, { x: 276, y: 18, w: 24, h: 24, r: 60, b: 18 }),
    delete: new ImagePlacement('delete', ImageAsset.iconDeleteGrey, { x: 304, y: 6, w: 48, h: 48, r: 8, b: 6 }),
    back: new ImagePlacement('back', ImageAsset.iconBackGrey, { w: 60, h: 60, r: 300 })
  }
}
