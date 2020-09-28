// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementConsentosBaseIdle } from './elementConsentosBaseIdle'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementConsentosLockeeIdle = {
  name: 'elementConsentosLockeeIdle',
  place: forSize(340, 398),
  backgroundColor: Color.black,
  layers: {
    card: new Polygon('card', { y: 68, w: 340, h: 330 }, Color.white, {
      fill: Color.mediumGrey,
      thickness: 3,
      strokeLinecap: 'butt',
      radius: 16
    }, []),
    state: new LayerPlacement('state', elementConsentosBaseIdle, elementConsentosBaseIdle.layers, { y: 269, w: 340, h: 114, b: 15 }, ({ deleteButton, allowButton }) => ({
      deleteButton: new LayerPlacement('deleteButton', deleteButton.layer, deleteButton.layer.layers, deleteButton.place, ({ label }) => ({
        label: new TextBox('label', 'deny', label.style, label.place)
      })),
      allowButton: new LayerPlacement('allowButton', allowButton.layer, allowButton.layer.layers, allowButton.place, ({ label }) => ({
        label: new TextBox('label', 'allow', label.style, label.place)
      }))
    })),
    lastAccess: new TextBox('lastAccess', '23 Sec. ago', {
      ...TextStyles.TimestampRobotoSmallCapRegular10BlackLeft,
      textAlign: 'right'
    }, { x: 176, y: 78, w: 135, h: 33, r: 29, b: 287 }),
    outline: new Polygon('outline', { x: 120, y: 6, w: 100, h: 100, r: 120, b: 292 }, Color.lightGrey, null, []),
    avatar: new Polygon('avatar', { x: 126, y: 12, w: 88, h: 88, r: 126, b: 298 }, '#d8d8d8ff', null, []),
    question: new TextBox('question', 'asks you to become a\nlockee for the vault:', TextStyles.BodyRobotoRegular18BlackCenter, { y: 178, w: 340, h: 42, b: 178 }),
    relationName: new TextBox('relationName', '<Unnamed>', TextStyles.H5RobotoRegular24BlackCenter, { y: 112, w: 340, h: 36, b: 250 }),
    relationID: new TextBox('relationID', 'A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 16,
      textAlign: 'center'
    }, { y: 146, w: 340, h: 24, b: 228 }),
    vaultName: new TextBox('vaultName', 'Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 122, y: 230, w: 218, h: 36, b: 132 }),
    vaultIcon: new ImagePlacement('vaultIcon', ImageAsset.iconVaultGrey, { x: 83, y: 236, w: 24, h: 24, r: 233, b: 138 })
  }
}
