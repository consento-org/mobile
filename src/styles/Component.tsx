// This file has been generated with expo-export, a Sketch plugin.
import React from 'react'
import { ImageAsset, Slice9 } from '../Asset'
import { ImageStyle, TextStyle, Text as NativeText, View, ViewStyle, FlexStyle, TouchableOpacity } from 'react-native'

export type TRenderGravity = 'start' | 'end' | 'center' | 'stretch'
export interface IRenderOptions {
  vert?: TRenderGravity,
  horz?: TRenderGravity,
  onPress?: () => any
}

function applyRenderOptions<T extends FlexStyle> ({ horz, vert }: IRenderOptions = {}, place: Placement, style?: T): T {
  if (style === null || style === undefined) {
    style = {} as T
  }
  style.width = horz === 'stretch' ? '100%' : place.width
  style.height = vert === 'stretch' ? '100%' : place.height
  return style
}

// Todo: LRU?
const renderCache: { [key: string]: ViewStyle } = {}

export class Component {
  name: string
  backgroundColor: string | undefined
  width: number
  height: number

  constructor (name: string, width: number, height: number, backgroundColor?: string) {
    this.name = name
    this.backgroundColor = backgroundColor
    this.width = width
    this.height = height
  }

  renderText (text: Text, opts?: IRenderOptions, value?: string, style?: TextStyle) {
    style = applyRenderOptions(opts, text.place, style)
    return this._renderItem(text.render(value, style), text.place, opts)
  }

  renderImage (asset: ImagePlacement, opts?: IRenderOptions, style?: ImageStyle) {
    style = applyRenderOptions(opts, asset.place, style)
    if (opts.horz === 'stretch' || opts.vert === 'stretch') {
      style.resizeMode = 'stretch'
    }
    return this._renderItem(asset.img(style), asset.place, opts)
  }

  renderSlice9 (asset: Slice9Placement, opts?: IRenderOptions, style?: ViewStyle) {
    style = applyRenderOptions(opts, asset.place, style)
    return this._renderItem(asset.render(style), asset.place, opts)
  }

  _renderItem (item: React.ReactNode, place: Placement, { horz, vert, onPress }: IRenderOptions = {}) {
    const horzKey = `horz:${horz || 'start'}:${vert || 'start'}:${this.width}:${this.height}:${place.top}:${place.left}:${place.right}:${place.bottom}`
    let horzStyle = renderCache[horzKey]
    if (horzStyle === undefined) {
      horzStyle = {
        display: 'flex',
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: horz === 'end' ? 'flex-end' : horz === 'center' ? 'center' : 'flex-start'
      }
      if (horz !== 'start') {
        horzStyle.paddingRight = this.width - place.right
      }
      if (horz !== 'end') {
        horzStyle.paddingLeft = place.left
      }
      if (vert !== 'start') {
        horzStyle.paddingBottom = this.height - place.bottom
      }
      if (vert !== 'end') {
        horzStyle.paddingTop = place.top
      }
      renderCache[horzKey] = horzStyle
    }
    const vertKey = `vert:${vert || 'start'}:${horz || 'start'}`
    let vertStyle = renderCache[vertKey]
    if (vertStyle === undefined) {
      vertStyle = {
        display: 'flex',
        width: horz === 'stretch' ? '100%' : 'auto',
        flexDirection: 'column',
        height: '100%',
        justifyContent: vert === 'end' ? 'flex-end' : vert === 'center' ? 'center': 'flex-start'
      }
      renderCache[vertKey] = vertStyle
    }
    if (onPress !== null && onPress !== undefined) {
      item = <TouchableOpacity onPress={ onPress }>{ item }</TouchableOpacity>
    }
    return <View style={ horzStyle }><View style={ vertStyle }>{ item }</View></View>
  }
}

export interface IFrameData {
  x: number
  y: number
  w: number
  h: number
}

export interface IStylePlace {
  left?: number | string
  top?: number | string
  width?: number | string
  height?: number | string
}

export class Placement {
  x: number
  left: number
  y: number
  top: number
  right: number
  bottom: number
  width: number
  height: number

  constructor({ x, y, w, h }: IFrameData) {
    this.x = x
    this.left = x
    this.y = y
    this.top = y
    this.width = w
    this.right = this.x + w
    this.height = h
    this.bottom = y + h
  }

  dynWidthStyle (): { left: number, top: number, right: number } {
    return {
      left: this.left,
      top: this.top,
      right: this.right
    }
  }

  style<T extends IStylePlace> (style?: T): T {
    if (style === undefined || style === null) {
      style = {} as T
    }
    style.top = this.top
    style.left = this.left
    style.width = this.width
    style.height = this.height
    return style
  }

  ySpace (other: Placement): number {
    if (this.y > other.y) {
      return other.ySpace(this)
    }
    return other.top - this.bottom
  }

  xSpace (other: Placement): number {
    if (this.x > other.x) {
      return other.xSpace(this)
    }
    return other.x - this.right
  }
}

export class ImagePlacement {
  place: Placement
  asset: () => ImageAsset
  parent: Component

  constructor (asset: () => ImageAsset, frame: IFrameData, parent: Component) {
    this.asset = asset
    this.place = new Placement(frame)
    this.parent = parent
    this.Render = this.Render.bind(this)
  }
  }

  img (style?: ImageStyle) {
    return this.asset().img(style)
  }
}

export class Slice9Placement {
  place: Placement
  asset: () => Slice9
  parent: Component

  constructor (asset: () => Slice9, frame: IFrameData, parent: Component) {
    this.asset = asset
    this.place = new Placement(frame)
    this.parent = parent
  }

  render (style?: ViewStyle) {
    return this.asset().render(style)
  }
}

export class Link <T> {
  place: Placement
  component: T

  constructor (component: T, frame: IFrameData) {
    this.component = component
    this.place = new Placement(frame)
  }
}

export type TFillData = string | IGradient | IError
export interface IStop {
  color: string
  position: number
}

export interface IGradient {
  gradient: {
    type: 'linear',
    stops: IStop[],
    from: {
      x: number,
      y: number
    },
    to: {
      x: number,
      y: number
    }
  }
}
export function isError (err: any): err is IError {
  if (err === null || typeof err !== 'object') {
    return false
  }
  return err.error !== undefined
}

export interface IError {
  error: string
}

export type TArrowHead = 'None' | 'OpenArrow' | 'FilledArrow' | 'Line' | 'OpenCircle' | 'FilledCircle' | 'OpenSquare' | 'FilledSquare'
export type TLineEnd = 'Butt' | 'Round' | 'Projecting'
export type TLineJoin = 'Miter' | 'Round' | 'Bevel'

export interface TBorderData {
  fill: TFillData,
  thickness: number
  endArrowhead?: TArrowHead
  startArrowhead?: TArrowHead
  lineEnd?: TLineEnd
  lineJoin?: TLineJoin
  dashPattern?: number[]
}

const reg = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?/ig
const hex = (c: number): string => (c >= 0x10) ? c.toString(16) : `0${c.toString(16)}`

export class RGBA {
  r: number
  g: number
  b: number
  a: number
  constructor (string: string) {
    reg.lastIndex = 0
    const parts = reg.exec(string)
    this.r = parts ? parseInt(parts[1], 16) : 255
    this.g = parts ? parseInt(parts[2], 16) : 255
    this.b = parts ? parseInt(parts[3], 16) : 255
    this.a = parts && parts[4] ? parseInt(parts[4], 16) : 255
  }
  toString (): string {
    return `#${hex(this.r | 0)}${hex(this.g | 0)}${hex(this.b | 0)}${hex(this.a | 0)}`
  }
  avg (other: RGBA): this {
    this.r = (this.r + other.r) / 2
    this.g = (this.g + other.g) / 2
    this.b = (this.b + other.b) / 2
    this.a = (this.a + other.a) / 2
    return this
  }
}

function calcAvgColor (stops: IStop[]): string {
  let rgba: RGBA
  for (const stop of stops) {
    const col = new RGBA(stop.color)
    if (rgba === undefined) {
      rgba = col
    } else {
      rgba = rgba.avg(col)
    }
  }
  return rgba.toString()
}

export class Fill {
  data: TFillData
  color: string
  constructor (data: TFillData) {
    this.data = data
    if (this.data === null || isError(this.data)) {
      this.color = '#ffffffff'
    } else if (typeof this.data === 'string') {
      this.color = this.data
    } else {
      this.color = calcAvgColor(this.data.gradient.stops)
    }
  }
}

export class Border {
  endArrowhead: TArrowHead
  startArrowhead: TArrowHead
  lineEnd: TLineEnd
  lineJoin: TLineJoin
  dashPattern: number[]
  fill: Fill
  thickness: number
  constructor (options: TBorderData | null) {
    this.fill = new Fill(options === null ? null : options.fill)
    this.thickness = options === null ? 0 : options.thickness
    this.endArrowhead = options === null || options.endArrowhead === undefined ? 'None' : options.endArrowhead
    this.startArrowhead = options === null || options.startArrowhead === undefined ? 'None' : options.startArrowhead
    this.lineEnd = options === null || options.lineEnd === undefined ? 'Projecting' : options.lineEnd
    this.lineJoin = options === null || options.lineJoin === undefined ? 'Miter' : options.lineJoin
    this.dashPattern = options === null || options.dashPattern === undefined ? [] : options.dashPattern
  }
}

export type TShadowData = {
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: string
}

export class Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string

  constructor (data: TShadowData) {
    this.x = data.x
    this.y = data.y
    this.blur = data.blur
    this.spread = data.spread
    this.color = data.color
  }
}

export class Polygon {
  place: Placement
  fill: Fill
  borderRadius: number
  border: Border
  shadows: Shadow[]

  constructor (frame: IFrameData, fill: TFillData | null, borderRadius: number, border: TBorderData | null, shadows: TShadowData[]) {
    this.place = new Placement(frame)
    this.fill = new Fill(fill)
    this.borderRadius = borderRadius
    this.border = new Border(border)
    this.shadows = shadows.map(data => new Shadow(data))
  }

  borderStyle (): ViewStyle {
    return {
      borderRadius: this.borderRadius,
      borderColor: this.border.fill.color,
      borderWidth: this.border.thickness
    }
  }
}

export class Text {
  text: string
  style: TextStyle
  styleAbsolute: TextStyle
  place: Placement
  parent: Component

  constructor (text: string, style: TextStyle, frame: IFrameData, parent: Component) {
    this.text = text
    this.style = style
    this.parent = parent
    this.place = new Placement(frame)
    this.styleAbsolute = Object.freeze({
      ... style,
      ... this.place.style(),
      position: 'absolute'
    })
  }

  render (value?: string, style?: TextStyle) {
    return <NativeText style={{
      ...this.style,
      ...style
    }}>{ value === undefined ? this.text : String(value) }</NativeText>
  }

  renderAbsolute (value?: string, style?: TextStyle) {
    if (style === undefined || style === null) {
      style = this.styleAbsolute
    } else {
      style = {
        ...style,
        ...this.styleAbsolute
      }
    }
    return this.render(value, style)
  }
}
