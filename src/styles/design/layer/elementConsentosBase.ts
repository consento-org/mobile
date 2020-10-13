// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { Polygon } from '../../util/Polygon'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementAvatarPlaceholder } from './elementAvatarPlaceholder'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'

export const elementConsentosBase = {
  name: 'elementConsentosBase',
  place: forSize(340, 280),
  backgroundColor: Color.black,
  layers: {
    background: new Polygon('background', { w: 340, h: 280 }, Color.white, {
      fill: Color.mediumGrey,
      thickness: 3,
      strokeLinecap: 'butt',
      radius: 16
    }, []),
    avatar: new LayerPlacement('avatar', elementAvatarPlaceholder, elementAvatarPlaceholder.layers, { x: 11, y: 30, w: 60, h: 60, r: 269, b: 190 }),
    vaultIcon: new ImagePlacement('vaultIcon', ImageAsset.iconVaultGrey, { x: 29, y: 128, w: 24, h: 24, r: 287, b: 128 }),
    vaultName: new TextBox('vaultName', 'Vault  Name', TextStyles.H5RobotoRegular24BlackLeft, { x: 80, y: 120, w: 260, h: 36, b: 124 }),
    relationName: new TextBox('relationName', '<Unnamed>', TextStyles.H5RobotoRegular24BlackLeft, { x: 80, y: 30, w: 223, h: 36, r: 37, b: 214 }),
    actionRequested: new TextBox('actionRequested', 'requests access to:', TextStyles.BodyRobotoRegular18BlackLeft, { x: 80, y: 90, w: 223, h: 24, r: 37, b: 166 }),
    relationID: new TextBox('relationID', 'A67F-BB3C-1A89-23C4', {
      ...TextStyles.BodyRobotoRegular18BlackLeft,
      color: Color.darkGrey,
      fontSize: 16
    }, { x: 80, y: 61, w: 245, h: 24, r: 15, b: 195 }),
    lastAccess: new TextBox('lastAccess', '23 Sec. ago', {
      ...TextStyles.TimestampRobotoSmallCapRegular10BlackLeft,
      textAlign: 'right'
    }, { x: 86, y: 10, w: 232, h: 33, r: 22, b: 237 })
  }
}
