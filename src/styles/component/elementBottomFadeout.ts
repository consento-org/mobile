// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, GradientType } from '../Component'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementBottomFadeoutClass extends Component {
  shape = new Polygon({ x: 0, y: 0, w: 375, h: 100 }, { gradient: {
    type: GradientType.linear,
    stops: [{
      color: Color.lightGrey,
      position: 0
    },{
      color: '#fcfcfc00',
      position: 1
    }],
    from: {
      x: 0.5877866921943831,
      y: 0.27485747772562735
    },
    to: {
      x: 0.5877866921943831,
      y: 0
    }
  } }, null, [])
  constructor () {
    super('elementBottomFadeout', 375, 100)
  }
}

export const elementBottomFadeout = new ElementBottomFadeoutClass()
