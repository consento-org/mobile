// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Link, Text } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementFormInputField } from './elementFormInputField'
import { elementAvatarGenerate } from './elementAvatarGenerate'
import { elementVaultSelectListItem } from './elementVaultSelectListItem'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementRelationNameClass extends Component {
  bottomButton = new Link(elementBottomButton, { x: 0, y: 870, w: 375, h: 100 }, {
    buttonLabel: 'Save Changes'
  })
  relationName = new Link(elementFormInputField, { x: 0, y: 15, w: 375, h: 85 }, {
    active: 'Name',
    label: 'name',
    caption: 'only you will see this name.'
  })
  elementAvatarGenerate = new Link(elementAvatarGenerate, { x: 57, y: 136, w: 239, h: 210 }, {})
  elementVaultSelectListItem = new Link(elementVaultSelectListItem, { x: 0, y: 430, w: 375, h: 100 }, {})
  elementVaultSelectListItemCopy = new Link(elementVaultSelectListItem, { x: 0, y: 530, w: 375, h: 100 }, {})
  description: Text
  title: Text
  constructor () {
    super('elementRelationName', 375, 970, Color.white)
    this.description = new Text('<Unnamed> does not have yet either received or accepted any request from you to lock one of your vault.\n\nIn the vault of your choice, add a lockee and select <Unnamed>.', TextStyles.BodyRobotoRegular18BlueCenter, { x: 52, y: 430, w: 270, h: 245 }, this)
    this.title = new Text('is locking:', TextStyles.H2PalanquinDarkMedium36BlackCenter, { x: 106.5, y: 358, w: 162, h: 36 }, this)
  }
}

export const elementRelationName = new ElementRelationNameClass()
