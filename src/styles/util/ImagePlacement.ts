// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { Placement } from './Placement'
import { IImageAsset, IPlacement } from './types'
import { ImageSourcePropType } from 'react-native'

export class ImagePlacement implements IImageAsset {
  name: string
  place: Placement
  image: IImageAsset

  constructor (name: string, asset: IImageAsset, frame: IPlacement) {
    this.name = name
    this.image = asset
    this.place = new Placement(frame)
  }

  source (): ImageSourcePropType {
    return this.image.source()
  }
}
