// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementBottomNavRelationsResting } from './elementBottomNavRelationsResting'
import { elementBottomNavConsentosResting } from './elementBottomNavConsentosResting'
import { elementBottomNavVaultResting } from './elementBottomNavVaultResting'
import { Polygon } from '../../util/Polygon'

export const elementBottomNav = {
  name: 'elementBottomNav',
  place: forSize(294, 60),
  backgroundColor: Color.grey,
  layers: {
    relations: new LayerPlacement('relations', elementBottomNavRelationsResting, elementBottomNavRelationsResting.layers, { x: 206, w: 78, h: 56, r: 10, b: 4 }),
    consento: new LayerPlacement('consento', elementBottomNavConsentosResting, elementBottomNavConsentosResting.layers, { x: 108, w: 78, h: 56, r: 108, b: 4 }),
    vault: new LayerPlacement('vault', elementBottomNavVaultResting, elementBottomNavVaultResting.layers, { x: 10, y: 1, w: 78, h: 56, r: 206, b: 3 }),
    borderTop: new Polygon('borderTop', { w: 294, h: 1, b: 59 }, null, {
      fill: Color.mediumGrey,
      thickness: 1,
      strokeLinecap: 'butt'
    }, [])
  }
}
