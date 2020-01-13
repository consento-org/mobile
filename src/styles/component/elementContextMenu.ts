// This file has been generated with expo-export, a Sketch plugin.
import { Component, Polygon, Link } from '../Component'
import { Color } from '../Color'
import { elementContextMenuEntry } from './elementContextMenuEntry'
import { elementContextMenuEntryRed } from './elementContextMenuEntryRed'
import { elementContextMenuDivider } from './elementContextMenuDivider'

/* eslint-disable lines-between-class-members */
export class ElementContextMenuClass extends Component {
  darkening: Polygon
  bg: Polygon
  copy = new Link(elementContextMenuEntry, { x: 0, y: 9, w: 190, h: 44 }, {
    label: 'Copy content'
  })
  rename = new Link(elementContextMenuEntry, { x: 0, y: 53, w: 190, h: 44 }, {
    label: 'Rename'
  })
  share = new Link(elementContextMenuEntry, { x: 0, y: 97, w: 190, h: 44 }, {
    label: 'Share'
  })
  delete = new Link(elementContextMenuEntryRed, { x: 0, y: 151, w: 190, h: 44 }, {
    label: 'Delete'
  })
  divider = new Link(elementContextMenuDivider, { x: 0, y: 141, w: 190, h: 10 }, {})
  constructor () {
    super('elementContextMenu', 190, 200, '#00000066')
    this.darkening = new Polygon({ x: 0, y: 0, w: 190, h: 200 }, '#00000066', null, [], this)
    this.bg = new Polygon({ x: 0, y: 0, w: 190, h: 200 }, Color.white, { radius: 4 }, [], this)
  }
}

export const elementContextMenu = new ElementContextMenuClass()
