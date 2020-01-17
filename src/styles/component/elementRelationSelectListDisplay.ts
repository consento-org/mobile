// This file has been generated with expo-export@3.6.0, a Sketch plugin.
import { Component, Link, Text } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementRelationSelectListRevoke } from './elementRelationSelectListRevoke'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListDisplayClass extends Component {
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'add'
  })
  revoke = new Link(elementRelationSelectListRevoke, { x: 0, y: 335, w: 375, h: 100 }, {})
  description: Text
  constructor () {
    super('elementRelationSelectListDisplay', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain that the ‘lockee’ do not see the content of th encrypted vault.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52.5, y: 180, w: 270, h: 84 }, this)
  }
}

export const elementRelationSelectListDisplay = new ElementRelationSelectListDisplayClass()
