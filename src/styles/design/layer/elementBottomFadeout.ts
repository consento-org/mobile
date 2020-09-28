// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'

export const elementBottomFadeout = {
  name: 'elementBottomFadeout',
  place: forSize(375, 100),
  layers: {
    shape: new Polygon('shape', { w: 375, h: 100 }, {
      gradient: {
        type: 'linear',
        stops: [
          { color: Color.lightGrey, position: 0 },
          { color: '#fcfcfc00', position: 1 }
        ],
        from: { x: 0.5877866921943831, y: 0.27485747772562735 },
        to: { x: 0.5877866921943831, y: 0 }
      }
    }, null, [])
  }
}
