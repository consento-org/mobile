// This file has been generated with expo-export@5.0.1, a Sketch plugin.
import { forSize } from '../../util/Placement'
import { TextBox } from '../../util/TextBox'
import { TextStyles } from '../TextStyles'
import { ImageAsset } from '../ImageAsset'
import { ImagePlacement } from '../../util/ImagePlacement'

export const elementCredits = {
  name: 'elementCredits',
  place: forSize(322, 168),
  layers: {
    funding: new TextBox('funding', 'This project has received funding from the European Union’s Horizon 2020 research and innovation programme within the framework of the LEDGER Project funded under grant agreement No825268.', TextStyles.SubtitleRobotoRegular13GreyCenter, { y: 66, w: 322, h: 66, b: 36 }),
    iconEu: new ImagePlacement('iconEu', ImageAsset.iconEu, { x: 256, y: 4, w: 66, h: 44, b: 120 }),
    iconNgiLedger: new ImagePlacement('iconNgiLedger', ImageAsset.iconNgiLedger, { w: 189, h: 53, r: 133, b: 115 })
  }
}
