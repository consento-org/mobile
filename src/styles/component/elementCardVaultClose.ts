// This file has been generated with expo-export, a Sketch plugin.
import { Component, AssetPlacement, Text } from '../Component'
import { Asset } from '../../Asset'
import { TextStyles } from '../TextStyles'

export class elementCardVaultCloseClass extends Component {
  background = new AssetPlacement(Asset.elementCardVaultBackground, { x: 0, y: 31, w: 160, h: 130 })
  title = new Text('Name', TextStyles.H6RobotoMedium18BlackCenter, { x: 5, y: 86, w: 150, h: 56 })
  lastAccess = new Text('Last access: 02.10.2019', TextStyles.TimestampRobotoSmallCapRegular10BlackLeft, { x: 5, y: 141, w: 150, h: 16 })
  status = new Text('sealed', TextStyles.TITLERobotoSmallCapRegular12RedCenter, { x: 5, y: 61, w: 150, h: 26 })
  icon = new AssetPlacement(Asset.iconVaultBigClosed, { x: 52.5, y: 0, w: 55, h: 62 })
  constructor () {
    super('elementCardVaultClose', 160, 161)
  }
}

export const elementCardVaultClose = new elementCardVaultCloseClass()
