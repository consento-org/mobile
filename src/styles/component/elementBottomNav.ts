// This file has been generated with expo-export, a Sketch plugin.
import { Component, Link, Polygon } from '../Component'
import { elementBottomNavRelationsResting } from './elementBottomNavRelationsResting'
import { elementBottomNavConsentosResting } from './elementBottomNavConsentosResting'
import { elementBottomNavVaultResting } from './elementBottomNavVaultResting'
import { Color } from '../Color'

export class elementBottomNavClass extends Component {
  relations = new Link(elementBottomNavRelationsResting, { x: 206, y: 0, w: 78, h: 56 })
  consento = new Link(elementBottomNavConsentosResting, { x: 108, y: 0, w: 78, h: 56 })
  vault = new Link(elementBottomNavVaultResting, { x: 10, y: 1, w: 78, h: 56 })
  borderTop = new Polygon({ x: 0, y: 0, w: 294, h: 1 }, null, 0, { 
    fill: Color.darkGrey,
    thickness: 1,
    lineEnd: 'Butt'
  }, [])
  constructor () {
    super('elementBottomNav', 294, 60, Color.grey)
  }
}

export const elementBottomNav = new elementBottomNavClass()
