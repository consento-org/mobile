// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, ImagePlacement, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'
import { Asset } from '../../Asset'
import { elementBottomButton } from './elementBottomButton'

/* eslint-disable lines-between-class-members */
export class ElementLocksEmptyClass extends Component {
  description: Text
  title: Text
  illustration: ImagePlacement
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'ADD'
  })
  constructor () {
    super('elementLocksEmpty', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('This vault is not locked yet. \n\nTo lock it out, you need at least one connection\nand add it as a ‘lockee’ here. \n\nAny connection of your choice can be a lockee. Just choose someone who will respond quickly when you need it.\n\nThat person will not be able to access your data. ', {
      ...TextStyles.BodyRobotoRegular18BlueCenter,
      color: Color.black
    }, { x: 52, y: 410, w: 270, h: 380 }, this)
    this.title = new Text('No lock yet…', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 84.5, y: 358, w: 206, h: 36 }, this)
    this.illustration = new ImagePlacement(Asset.illustrationLock, { x: 145.5, y: 271, w: 80, h: 80 }, this)
  }
}

export const elementLocksEmpty = new ElementLocksEmptyClass()
