// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementTopNavEdit = {
  name: 'elementTopNavEdit',
  place: forSize(360, 60),
  backgroundColor: Color.grey,
  layers: {
    borderTop: new Polygon('borderTop', { y: 58.25, w: 360, h: 2, b: -0.25 }, null, {
      fill: '#d9d9d9ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    background: new Polygon('background', { x: 52, y: 12, w: 259, h: 36, r: 49, b: 12 }, Color.white, null, []),
    underline: new Polygon('underline', { x: 52, y: 47.25, w: 259, h: 2, r: 49, b: 10.75 }, null, {
      fill: Color.coral,
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    title: new TextBox('title', 'Vault Name', TextStyles.H5RobotoRegular24BlackCenter, { x: 52, y: 17, w: 259, h: 31, r: 49, b: 12 }),
    backCopy: new ImagePlacement('backCopy', ImageAsset.iconBackGrey, { y: -0.5, w: 60, h: 60, r: 300, b: 0.5 }),
    delete: new ImagePlacement('delete', ImageAsset.iconDeleteGrey, { x: 304, y: 6, w: 48, h: 48, r: 8, b: 6 })
  }
}
