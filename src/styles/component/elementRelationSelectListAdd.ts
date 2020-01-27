// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Link, Text } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementRelationSelectListSelected } from './elementRelationSelectListSelected'
import { elementRelationSelectListUnselected } from './elementRelationSelectListUnselected'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationSelectListAddClass extends Component {
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'save'
  })
  selected = new Link(elementRelationSelectListSelected, { x: 0, y: 445, w: 375, h: 100 }, {})
  unselected = new Link(elementRelationSelectListUnselected, { x: 0, y: 345, w: 375, h: 100 }, {})
  description: Text
  constructor () {
    super('elementRelationSelectListAdd', 375.0000000000001, 970, Color.lightGrey)
    this.description = new Text('Dummy text to explain that the ‘lockee’ do not see the content of th encrypted vault.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52.5, y: 180, w: 270, h: 84 }, this)
  }
}

export const elementRelationSelectListAdd = new ElementRelationSelectListAddClass()
