// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { Placement } from './Placement'
import { ILayer, IPlacement } from './types'

type FType<Input, Type> = (input: Input) => Type

function isFn <Input, Type> (input: Type | FType<Input, Type>): input is FType<Input, Type> {
  return typeof input === 'function'
}

export class LayerPlacement <TLayer extends ILayer<TLayers>, TLayers, TOverrides extends Object = {}> implements ILayer<Omit<TLayers, keyof TOverrides> & TOverrides> {
  name: string
  place: Placement
  layer: TLayer
  layers: Omit<TLayers, keyof TOverrides> & TOverrides

  constructor (name: string, layer: TLayer, layers: TLayers, frame: IPlacement, overrides?: TOverrides | FType<TLayers, TOverrides>) {
    this.name = name
    this.layer = layer
    this.place = new Placement(frame)
    this.layers = {
      ...layers,
      ...isFn(overrides) ? overrides(layers) : overrides
    } as any
  }

  get backgroundColor (): string | undefined {
    return this.layer.backgroundColor
  }
}
