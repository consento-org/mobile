// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { Color } from '../Color'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { LayerPlacement } from '../../util/LayerPlacement'
import { elementLineSection } from './elementLineSection'
import { elementLineData } from './elementLineData'

export const elementFileList = {
  name: 'elementFileList',
  place: forSize(375, 778),
  backgroundColor: Color.white,
  layers: {
    size: new TextBox('size', 'Total size: 28.7 Mo', {
      ...TextStyles.H6BlackHighEmphasisCenter,
      color: '#7c8792ff',
      fontSize: 13,
      lineHeight: 15,
      textAlign: 'left'
    }, { x: 15, y: 612, w: 160, h: 24, r: 200, b: 142 }),
    sectionText: new LayerPlacement('sectionText', elementLineSection, elementLineSection.layers, { w: 375, h: 56, b: 722 }, ({ label }) => ({
      label: new TextBox('label', 'Text files', label.style, label.place)
    })),
    sectionImage: new LayerPlacement('sectionImage', elementLineSection, elementLineSection.layers, { y: 236, w: 375, h: 56, b: 486 }, ({ label }) => ({
      label: new TextBox('label', 'Image files', label.style, label.place)
    })),
    entry: new LayerPlacement('entry', elementLineData, elementLineData.layers, { y: 56, w: 375, h: 60, b: 662 }, ({ label }) => ({
      label: new TextBox('label', 'Bank accounts details', label.style, label.place)
    }))
  }
}
