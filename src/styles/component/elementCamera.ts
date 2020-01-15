// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Polygon, GradientType, Text, Link, ImagePlacement } from '../Component'
import { TextStyles } from '../TextStyles'
import { buttonContainerLight } from './buttonContainerLight'
import { Asset } from '../../Asset'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementCameraClass extends Component {
  image: Polygon
  bg: Polygon
  minusBg: Polygon
  plusBg: Polygon
  flipBg: Polygon
  permission: Text
  retry = new Link(buttonContainerLight, { x: 139.49, y: 269, w: 96, h: 36 }, {
    label: 'retry'
  })
  flip: ImagePlacement
  shutter: ImagePlacement
  shutterActive: ImagePlacement
  minus: ImagePlacement
  plus: ImagePlacement
  flash: ImagePlacement
  encryptingBg: Polygon
  encryptingText: Text
  constructor () {
    super('elementCamera', 375.0000000000001, 675, Color.black)
    this.image = new Polygon({ x: 0, y: 0, w: 375, h: 675 }, {
      gradient: {
        type: GradientType.radial,
        stops: [{
          color: '#c4a9a9ff',
          position: 0
        }, {
          color: '#8e7c7cff',
          position: 1
        }],
        from: {
          x: 0.41375000000000084,
          y: 0.3437343749999999
        },
        to: {
          x: 0.41375000000000084,
          y: 1.343734375
        }
      }
    }, null, [], this)
    this.bg = new Polygon({ x: 0, y: 579, w: 375, h: 96 }, '#26262680', null, [], this)
    this.minusBg = new Polygon({ x: 0, y: 579, w: 63, h: 96 }, '#26262680', null, [], this)
    this.plusBg = new Polygon({ x: 63, y: 579, w: 63, h: 96 }, '#26262680', null, [], this)
    this.flipBg = new Polygon({ x: 248.99, y: 579, w: 126, h: 96 }, '#26262680', null, [], this)
    this.permission = new Text('No permission to\nuse the camera.', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 0, y: 203, w: 375, h: 42 }, this)
    this.flip = new ImagePlacement(Asset.iconCameraFlip, { x: 284.49, y: 596.25, w: 55, h: 56 }, this)
    this.shutter = new ImagePlacement(Asset.iconCameraShutterNormal, { x: 154.5, y: 591, w: 66, h: 66 }, this)
    this.shutterActive = new ImagePlacement(Asset.iconCameraShutterActive, { x: 154.5, y: 591, w: 66, h: 66 }, this)
    this.minus = new ImagePlacement(Asset.iconCameraZoomMinus, { x: 21.5, y: 614.25, w: 20, h: 20 }, this)
    this.plus = new ImagePlacement(Asset.iconCameraZoomPlus, { x: 84.5, y: 614.25, w: 20, h: 20 }, this)
    this.flash = new ImagePlacement(Asset.iconCameraFlashAuto, { x: 158.5, y: 0, w: 62, h: 36 }, this)
    this.encryptingBg = new Polygon({ x: 0, y: 0, w: 375, h: 675 }, '#000000b3', {
      fill: '#979797ff',
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
    this.encryptingText = new Text('Encrypting…', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 0, y: 310.5, w: 375, h: 42 }, this)
  }
}

export const elementCamera = new ElementCameraClass()
