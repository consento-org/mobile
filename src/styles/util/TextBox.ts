// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { TextStyle, StyleSheet } from 'react-native'
import { Placement } from './Placement'
import { IPlacement } from './types'

export class TextBox {
  name: string
  text: string
  style: TextStyle
  place: Placement

  constructor (name: string, text: string, style: TextStyle, place: IPlacement) {
    this.name = name
    this.text = text
    this.style = StyleSheet.create({ input: style }).input
    this.place = new Placement(place)
  }
}
