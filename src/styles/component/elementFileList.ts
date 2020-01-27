// This file has been generated with expo-export@3.6.2, a Sketch plugin.
import { Component, Text, Link } from '../Component'
import { TextStyles } from '../TextStyles'
import { elementLineSection } from './elementLineSection'
import { elementLineData } from './elementLineData'
import { Color } from '../Color'

/* eslint-disable lines-between-class-members */
export class ElementFileListClass extends Component {
  size: Text
  sectionText = new Link(elementLineSection, { x: 0, y: 0, w: 375, h: 56 }, {
    label: 'Text files'
  })
  sectionImage = new Link(elementLineSection, { x: 0, y: 236, w: 375, h: 56 }, {
    label: 'Image files'
  })
  entry = new Link(elementLineData, { x: 0, y: 56, w: 375, h: 60 }, {
    label: 'Bank accounts details'
  })
  constructor () {
    super('elementFileList', 375, 778, Color.white)
    this.size = new Text('Total size: 28.7 Mo', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      color: '#7c8792ff',
      fontSize: 13,
      textAlign: 'left',
      textAlignVertical: 'center'
    }, { x: 15, y: 612, w: 160, h: 24 }, this)
  }
}

export const elementFileList = new ElementFileListClass()
