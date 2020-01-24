// This file has been generated with expo-export@3.6.1, a Sketch plugin.
import { Component, Text, Polygon } from '../Component'
import { TextStyles } from '../TextStyles'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementVaultsLoadingClass extends Component {
  loadingData: Text
  placeholder: Polygon
  constructor () {
    super('elementVaultsLoading', 375.0000000000001, 970, Color.lightGrey)
    this.loadingData = new Text('Loading data …', {
      ...TextStyles.H2PalanquinDarkMedium36BlackCenter,
      textAlignVertical: 'top'
    }, { x: 65, y: 408, w: 246, h: 36 }, this)
    this.placeholder = new Polygon({ x: 89, y: 187, w: 190, h: 190 }, '#d8d8d8ff', {
      fill: '#979797ff',
      thickness: 1,
      lineEnd: 'Butt'
    }, [], this)
  }
}

export const elementVaultsLoading = new ElementVaultsLoadingClass()
