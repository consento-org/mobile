// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Link } from '../Component'
import { elementBottomButton } from './elementBottomButton'
import { elementFormInputField } from './elementFormInputField'
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
  constructor () {
    super('elementRelationName', 375, 970, Color.white)
  }
}

export const elementRelationName = new ElementRelationNameClass()
