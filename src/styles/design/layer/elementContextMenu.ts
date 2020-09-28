// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Polygon } from '../../util/Polygon'
import { Color } from '../Color'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementContextMenuEntry } from './elementContextMenuEntry'
import { TextBox } from '../../util/TextBox'
import { elementContextMenuEntryRed } from './elementContextMenuEntryRed'
import { elementContextMenuDivider } from './elementContextMenuDivider'

export const elementContextMenu = {
  name: 'elementContextMenu',
  place: forSize(190, 200),
  backgroundColor: '#00000066',
  layers: {
    darkening: new Polygon('darkening', { w: 190, h: 200 }, '#00000066', null, []),
    bg: new Polygon('bg', { w: 190, h: 200 }, Color.white, { radius: 4 }, []),
    copy: new LayerPlacement('copy', elementContextMenuEntry, elementContextMenuEntry.layers, { y: 9, w: 190, h: 44, b: 147 }, ({ label }) => ({
      label: new TextBox('label', 'Copy content', label.style, label.place)
    })),
    rename: new LayerPlacement('rename', elementContextMenuEntry, elementContextMenuEntry.layers, { y: 53, w: 190, h: 44, b: 103 }, ({ label }) => ({
      label: new TextBox('label', 'Rename', label.style, label.place)
    })),
    share: new LayerPlacement('share', elementContextMenuEntry, elementContextMenuEntry.layers, { y: 97, w: 190, h: 44, b: 59 }, ({ label }) => ({
      label: new TextBox('label', 'Share', label.style, label.place)
    })),
    delete: new LayerPlacement('delete', elementContextMenuEntryRed, elementContextMenuEntryRed.layers, { y: 151, w: 190, h: 44, b: 5 }, ({ label }) => ({
      label: new TextBox('label', 'Delete', label.style, label.place)
    })),
    divider: new LayerPlacement('divider', elementContextMenuDivider, elementContextMenuDivider.layers, { y: 141, w: 190, h: 10, b: 49 })
  }
}
