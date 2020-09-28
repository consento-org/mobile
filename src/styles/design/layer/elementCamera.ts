// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { LayerPlacement } from '../../util/LayerPlacement'
import { buttonContainerLight } from './buttonContainerLight'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementCamera = {
  name: 'elementCamera',
  place: forSize(375, 675),
  backgroundColor: Color.black,
  layers: {
    image: new Polygon('image', { w: 375, h: 675 }, {
      gradient: {
        type: 'radial',
        stops: [
          { color: '#c4a9a9ff', position: 0 },
          { color: '#8e7c7cff', position: 1 }
        ],
        from: { x: 0.41375000000000084, y: 0.3437343749999999 },
        to: { x: 0.41375000000000084, y: 1.343734375 }
      }
    }, null, []),
    bg: new Polygon('bg', { y: 579, w: 375, h: 96 }, '#26262680', null, []),
    minusBg: new Polygon('minusBg', { y: 579, w: 63, h: 96, r: 312 }, '#26262680', null, []),
    plusBg: new Polygon('plusBg', { x: 63, y: 579, w: 63, h: 96, r: 248.99 }, '#26262680', null, []),
    flipBg: new Polygon('flipBg', { x: 248.99, y: 579, w: 126, h: 96 }, '#26262680', null, []),
    permission: new TextBox('permission', 'No permission to\nuse the camera.', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { y: 203, w: 375, h: 42, b: 430 }),
    retry: new LayerPlacement('retry', buttonContainerLight, buttonContainerLight.layers, { x: 139.49, y: 269, w: 96, h: 36, r: 139.5, b: 370 }, ({ label }) => ({
      label: new TextBox('label', 'retry', label.style, label.place)
    })),
    flip: new ImagePlacement('flip', ImageAsset.iconCameraFlip, { x: 284.49, y: 596.25, w: 55, h: 56, r: 35.5, b: 22.75 }),
    shutter: new ImagePlacement('shutter', ImageAsset.iconCameraShutterNormal, { x: 154.5, y: 591, w: 66, h: 66, r: 154.5, b: 18 }),
    shutterActive: new ImagePlacement('shutterActive', ImageAsset.iconCameraShutterActive, { x: 154.5, y: 591, w: 66, h: 66, r: 154.5, b: 18 }),
    minus: new ImagePlacement('minus', ImageAsset.iconCameraZoomMinus, { x: 21.5, y: 614.25, w: 20, h: 20, r: 333.5, b: 40.75 }),
    plus: new ImagePlacement('plus', ImageAsset.iconCameraZoomPlus, { x: 84.5, y: 614.25, w: 20, h: 20, r: 270.49, b: 40.75 }),
    flash: new ImagePlacement('flash', ImageAsset.iconCameraFlashAuto, { x: 158.5, w: 62, h: 36, r: 154.5, b: 639 }),
    encryptingBg: new Polygon('encryptingBg', { w: 375, h: 675 }, '#000000b3', {
      fill: '#979797ff',
      thickness: 1,
      strokeLinecap: 'butt'
    }, []),
    encryptingText: new TextBox('encryptingText', 'Encrypting…', TextStyles.BUTTONRobotoSmallCapRegular18WhiteCenter, { y: 310.5, w: 375, h: 42, b: 322.5 }),
    close: new ImagePlacement('close', ImageAsset.iconCrossWhite, { x: 5, y: 5, w: 24, h: 24, r: 346, b: 646 }),
    closeSize: new Polygon('closeSize', { w: 80, h: 63.5, r: 295, b: 611.5 }, '#da552f1c', null, [])
  }
}
