// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementFormInputField = {
  name: 'elementFormInputField',
  place: forSize(375, 85),
  layers: {
    invalid: new Polygon('invalid', { x: 20, y: 10, w: 327.99, h: 56, r: 27, b: 19 }, null, {
      fill: Color.red,
      thickness: 2,
      strokeLinecap: 'butt',
      radius: 4
    }, []),
    rectangle: new Polygon('rectangle', { x: 20, y: 10, w: 327.99, h: 56, r: 27, b: 19 }, null, {
      fill: '#cfd8dcff',
      thickness: 2,
      strokeLinecap: 'butt',
      radius: 4
    }, []),
    caption: new TextBox('caption', 'description', TextStyles.CaptionPrimaryOnSurfaceLeft, { x: 35.99, y: 69, w: 312, h: 16, r: 27 }),
    cutout: new Polygon('cutout', { x: 30.99, w: 44, h: 17, r: 300, b: 68 }, Color.white, null, []),
    label: new TextBox('label', 'label', {
      ...TextStyles.CaptionPrimaryOnSurfaceLeft,
      textAlign: 'center'
    }, { x: 38.99, y: 1, w: 28, h: 16, r: 308, b: 68 }),
    inactive: new TextBox('inactive', 'Inactive', {
      ...TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft,
      color: Color.darkGrey
    }, { x: 35.49, y: 26, w: 297, h: 24, r: 42.5, b: 35 }),
    active: new TextBox('active', 'Active', {
      ...TextStyles.Subtitle1SelectedOnSurfaceHighEmphasisLeft,
      color: Color.darkGrey,
      textAlignVertical: 'center'
    }, { x: 35.49, y: 26, w: 267.5, h: 24, r: 72, b: 35 }),
    reset: new ImagePlacement('reset', ImageAsset.iconCrossGrey, { x: 308.49, y: 26, w: 24, h: 24, r: 42.5, b: 35 })
  }
}
