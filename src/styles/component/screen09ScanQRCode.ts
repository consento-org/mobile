// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, ImagePlacement, Text, Link } from '../Component'
import { Color } from '../Color'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'
import { buttonContainerLight } from './buttonContainerLight'

/* eslint-disable lines-between-class-members */
export class Screen09ScanQRCodeClass extends Component {
  background = new Polygon({ x: 0, y: 0, w: 375, h: 426 }, Color.black, null, [])
  shadow = new Polygon({ x: 0, y: 0, w: 44, h: 47 }, '#00000066', null, [])
  bottomRight: ImagePlacement
  bottomLeft: ImagePlacement
  topRight: ImagePlacement
  topLeft: ImagePlacement
  close: ImagePlacement
  code = new Polygon({ x: 27, y: 452, w: 322, h: 322 }, Color.white, {
    fill: Color.activeGrey,
    thickness: 10,
    lineEnd: 'Butt'
  }, [])
  message: Text
  logo: ImagePlacement
  permission: Text
  retry = new Link(buttonContainerLight, { x: 139.5, y: 269, w: 96, h: 36 }, {
    label: 'retry'
  })
  constructor () {
    super('screen09ScanQRCode', 375, 812, Color.white)
    this.bottomRight = new ImagePlacement(Asset.illustrationBottomRight, { x: 297.65, y: 346.65, w: 68, h: 68 }, this)
    this.bottomLeft = new ImagePlacement(Asset.illustrationBottomLeft, { x: 10, y: 346.65, w: 68, h: 68 }, this)
    this.topRight = new ImagePlacement(Asset.illustrationTopRight, { x: 297.65, y: 57.99, w: 68, h: 68 }, this)
    this.topLeft = new ImagePlacement(Asset.illustrationTopLeft, { x: 10, y: 58.99, w: 68, h: 68 }, this)
    this.close = new ImagePlacement(Asset.iconCloseFilled, { x: 176, y: 15.99, w: 24, h: 24 }, this)
    this.message = new Text('show this code to your contact', {
      ... TextStyles.H6BlackHighEmphasisCenter,
      fontSize: 13
    }, { x: 6, y: 781, w: 364, h: 15 }, this)
    this.logo = new ImagePlacement(Asset.iconLogo, { x: 162.26, y: 588, w: 50.46, h: 50 }, this)
    this.permission = new Text('No permission to\nuse the camera.', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { x: 0, y: 203, w: 375, h: 42 }, this)
  }
}

export const screen09ScanQRCode = new Screen09ScanQRCodeClass()
