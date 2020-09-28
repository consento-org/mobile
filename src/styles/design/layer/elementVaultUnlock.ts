// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { Polygon } from '../../util/Polygon'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementVaultUnlock = {
  name: 'elementVaultUnlock',
  place: forSize(375, 970),
  backgroundColor: Color.darkGrey,
  layers: {
    waiting: new TextBox('waiting', 'waiting for consent', TextStyles.waiting, { x: 52.5, y: 552, w: 270, h: 60, r: 52.5, b: 358 }),
    inactive: new Polygon('inactive', { x: 52.5, y: 552, w: 270, h: 60, r: 52.5, b: 358 }, null, {
      fill: '#ffffff5e',
      thickness: 4,
      strokeLinecap: 'round',
      radius: 14
    }, []),
    active: new Polygon('active', { x: 52.5, y: 552, w: 270, h: 60, r: 52.5, b: 358 }, null, {
      fill: Color.white,
      thickness: 4,
      strokeLinecap: 'round'
    }, []),
    illustrationWaiting: new ImagePlacement('illustrationWaiting', ImageAsset.illustrationWaiting, { x: 73.5, y: 252, w: 228, h: 213, r: 73.5, b: 505 })
  }
}
