// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const screen09ScanQRCode = {
  name: 'screen09ScanQRCode',
  place: forSize(375, 812),
  backgroundColor: Color.white,
  layers: {
    background: new Polygon('background', { w: 375, h: 426, b: 386 }, Color.black, null, []),
    shadow: new Polygon('shadow', { w: 44, h: 47, r: 330.99, b: 765 }, '#00000066', null, []),
    bottomRight: new ImagePlacement('bottomRight', ImageAsset.illustrationBottomRight, { x: 297.65, y: 346.65, w: 68, h: 68, r: 9.34, b: 397.34 }),
    bottomLeft: new ImagePlacement('bottomLeft', ImageAsset.illustrationBottomLeft, { x: 10, y: 346.65, w: 68, h: 68, r: 296.99, b: 397.34 }),
    topRight: new ImagePlacement('topRight', ImageAsset.illustrationTopRight, { x: 297.65, y: 57.99, w: 68, h: 68, r: 9.34, b: 686 }),
    topLeft: new ImagePlacement('topLeft', ImageAsset.illustrationTopLeft, { x: 10, y: 58.99, w: 68, h: 68, r: 296.99, b: 685 }),
    close: new ImagePlacement('close', ImageAsset.iconCloseFilled, { x: 176, y: 15.99, w: 24, h: 24, r: 175, b: 772 }),
    code: new Polygon('code', { x: 27, y: 452, w: 322, h: 322, r: 26, b: 38 }, Color.white, {
      fill: Color.activeGrey,
      thickness: 10,
      strokeLinecap: 'butt'
    }, []),
    message: new TextBox('message', 'show this code to your contact', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      fontSize: 13,
      lineHeight: 15
    }, { x: 6, y: 781, w: 364, h: 15, r: 5, b: 16 }),
    logo: new ImagePlacement('logo', ImageAsset.iconLogo, { x: 164, y: 589, w: 48, h: 48, r: 163, b: 175 }),
    outgoingBadge: new Polygon('outgoingBadge', { x: 91.5, y: 589, w: 192, h: 54, r: 91.5, b: 169 }, '#95d6ffff', { radius: 10 }, []),
    incomingBadge: new Polygon('incomingBadge', { x: 92, y: 213, w: 192, h: 54, r: 91, b: 545 }, '#95d6ffff', { radius: 10 }, []),
    incomingConnecting: new TextBox('incomingConnecting', 'Connecting…', {
      color: '#546e7aff',
      fontSize: 14.14,
      lineHeight: 16,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
    }, { x: 92, y: 227, w: 192, h: 26, r: 91, b: 559 }),
    outgoingConnecting: new TextBox('outgoingConnecting', 'Confirming…', {
      color: '#546e7aff',
      fontSize: 14.14,
      lineHeight: 16,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
    }, { x: 92, y: 227, w: 192, h: 26, r: 91, b: 559 }),
    outgoingConfirming: new TextBox('outgoingConfirming', 'Confirming…', {
      color: '#546e7aff',
      fontSize: 14.14,
      lineHeight: 16,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
    }, { x: 92, y: 603, w: 192, h: 26, r: 91, b: 183 }),
    incomingLoading: new TextBox('incomingLoading', 'Loading…', {
      color: '#546e7aff',
      fontSize: 14.14,
      lineHeight: 16,
      textAlign: 'center',
      textTransform: 'none',
      textAlignVertical: 'center'
    }, { x: 92, y: 603, w: 192, h: 26, r: 91, b: 183 })
  }
}
