// This file has been generated with expo-export, a Sketch plugin.
import React from 'react'
import { ImageAsset, Slice9 } from '../Asset'
import { Image, ImageStyle, TextStyle, TextInput, Text as NativeText, View, ViewStyle, FlexStyle, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export type TRenderGravity = 'start' | 'end' | 'center' | 'stretch'
export interface IRenderOptions {
  vert?: TRenderGravity
  horz?: TRenderGravity
  onPress?: () => any
  onLayout?: () => any
}

function applyRenderOptions<T extends FlexStyle> ({ horz, vert }: IRenderOptions = {}, place: Placement, style?: T): T {
  if (style === null || style === undefined) {
    style = {} as any
  }
  style.width = horz === 'stretch' ? '100%' : place.width
  style.height = vert === 'stretch' ? '100%' : place.height
  return style
}

function exists <T> (value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

function useDefault <T> (value: T | null | undefined, defaultValue: T): T {
  if (exists(value)) {
    return value
  }
  return defaultValue
}

// Todo: LRU?
const renderCache: { [key: string]: ViewStyle } = {}

export interface IBaseProps<T extends React.Component, TStyle extends FlexStyle> {
  targetRef?: React.RefObject<T>
  vert?: TRenderGravity
  horz?: TRenderGravity
  style?: TStyle
  onPress?: () => any
  onLayout?: () => any
}

interface ITextBaseProps extends IBaseProps<NativeText | TextInput, TextStyle> {
  value?: string
  onEdit?: (text: string) => any
  onBlur?: () => any
}

export interface ITextProps extends ITextBaseProps {
  value: string
  prototype: Text
}

export interface IPolygonProps extends IBaseProps<View, ViewStyle> {
  prototype: Polygon
}

export interface IImageProps extends IBaseProps<Image, ImageStyle> {
  prototype: ImagePlacement
}

export interface ISlice9Props extends IBaseProps<View, ViewStyle> {
  prototype: Slice9Placement
}

export interface IRenderProps<T extends React.Component, TStyle extends FlexStyle> extends IBaseProps<T, TStyle> {
  place: Placement
  item: (opts: {
    ref?: React.RefObject<T>
    style?: TStyle
  }) => JSX.Element
}

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
    this.Render = this.Render.bind(this)
    this.Text = this.Text.bind(this)
    this.Image = this.Image.bind(this)
    this.Slice9 = this.Slice9.bind(this)
  }

  Text (props: ITextProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const renderProps = {
      ...props,
      place: props.prototype.place,
      item: ({ ref, style }) => props.prototype.render({
        value: props.value,
        style: applyRenderOptions(props, props.prototype.place, style),
        onEdit: props.onEdit,
        ref,
        onBlur: props.onBlur
      })
    } as IRenderProps<NativeText, TextStyle>
    return this.Render(renderProps)
  }

  Polygon (props: IPolygonProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const renderProps = {
      ...props,
      place: props.prototype.place,
      item: ({ ref, style }) => props.prototype.RenderRect({
        style: applyRenderOptions(props, props.prototype.place, style),
        ref
      })
    } as IRenderProps<NativeText, TextStyle>
    return this.Render(renderProps)
  }

  Image (props: IImageProps): JSX.Element {
    const { prototype } = props
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const renderProps = {
      ...props,
      place: prototype.place,
      item: ({ ref, style }) => prototype.img(applyRenderOptions(props, prototype.place, style), ref)
    } as IRenderProps<Image, ImageStyle>
    return this.Render(renderProps)
  }

  Slice9 (props: ISlice9Props): JSX.Element {
    const { prototype } = props
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const renderProps = {
      ...props,
      place: prototype.place,
      item: ({ ref, style }) => prototype.render(applyRenderOptions(props, prototype.place, style), ref)
    } as IRenderProps<View, ViewStyle>
    return this.Render(renderProps)
  }

  Render <T extends React.Component, S extends FlexStyle> (props: IRenderProps<T, S>): JSX.Element {
    return this._renderItem(props.item({
      ref: props.targetRef,
      style: props.style
    }), props.place, {
      horz: props.horz,
      vert: props.vert,
      onPress: props.onPress,
      onLayout: props.onLayout
    })
  }

  renderText ({ text, opts, value, style, onEdit, ref, onLayout, onBlur }: { text: Text, opts?: IRenderOptions, value?: string, style?: TextStyle, onEdit?: (text: string) => any, ref?: React.RefObject<TextInput>, onLayout?: () => any, onBlur?: () => any }): JSX.Element {
    style = applyRenderOptions(opts, text.place, style)
    return this._renderItem(text.render({ value, style, onEdit, ref, onLayout, onBlur }), text.place, opts)
  }

  renderPolygon (polygon: Polygon, opts?: IRenderOptions, style?: ViewStyle): JSX.Element {
    style = applyRenderOptions(opts, polygon.place, style)
    return this._renderItem(polygon.RenderRect({ style }), polygon.place, opts)
  }

  renderImage (asset: ImagePlacement, opts?: IRenderOptions, style?: ImageStyle, ref?: React.RefObject<Image>, onLayout?: () => any): JSX.Element {
    style = applyRenderOptions(opts, asset.place, style)
    if (opts.horz === 'stretch' || opts.vert === 'stretch') {
      style.resizeMode = 'stretch'
    }
    return this._renderItem(asset.img(style, ref, onLayout), asset.place, opts)
  }

  renderSlice9 (asset: Slice9Placement, opts?: IRenderOptions, style?: ViewStyle): JSX.Element {
    style = applyRenderOptions(opts, asset.place, style)
    return this._renderItem(asset.render(style), asset.place, opts)
  }

  _renderItem (item: React.ReactNode, place: Placement, { horz, vert, onPress, onLayout }: IRenderOptions = {}): JSX.Element {
    const horzKey = `horz:${useDefault(horz, 'start')}:${useDefault(vert, 'start')}:${this.width}:${this.height}:${place.top}:${place.left}:${place.right}:${place.bottom}`
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
    const vertKey = `vert:${useDefault(vert, 'start')}:${useDefault(horz, 'start')}`
    let vertStyle = renderCache[vertKey]
    if (vertStyle === undefined) {
      vertStyle = {
        display: 'flex',
        width: horz === 'stretch' ? '100%' : 'auto',
        flexDirection: 'column',
        height: '100%',
        justifyContent: vert === 'end' ? 'flex-end' : vert === 'center' ? 'center' : 'flex-start'
      }
      renderCache[vertKey] = vertStyle
    }
    if (onPress !== null && onPress !== undefined) {
      item = <TouchableOpacity onLayout={onLayout} onPress={onPress}>{item}</TouchableOpacity>
    }
    return <View onLayout={onLayout} style={horzStyle}><View style={vertStyle}>{item}</View></View>
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
  centerX: number
  centerY: number

  constructor ({ x, y, w, h }: IFrameData) {
    this.x = x
    this.left = x
    this.y = y
    this.top = y
    this.width = w
    this.right = this.x + w
    this.height = h
    this.bottom = y + h
    this.centerX = x + w / 2
    this.centerY = y + h / 2
  }

  dynWidthStyle (): { left: number, top: number, right: number } {
    return {
      left: this.left,
      top: this.top,
      right: this.right
    }
  }

  size<T extends IStylePlace> (style?: T): T {
    if (style === undefined || style === null) {
      style = {} as any
    }
    style.width = this.width
    style.height = this.height
    return style
  }

  style<T extends IStylePlace> (style?: T): T {
    style = this.size(style)
    style.top = this.top
    style.left = this.left
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

  Render (props: IBaseProps<Image, ImageStyle>): JSX.Element {
    return this.parent.Image({
      ...props,
      prototype: this
    })
  }

  img (style?: ImageStyle, ref?: React.RefObject<Image>, onLayout?: () => any): JSX.Element {
    return this.asset().img(style, ref, onLayout)
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

  render (style?: ViewStyle, ref?: React.RefObject<View>, onLayout?: () => any): JSX.Element {
    return this.asset().render(style, ref, onLayout)
  }
}

export class Link <T, Texts> {
  place: Placement
  component: T
  text: Texts

  constructor (component: T, frame: IFrameData, text: Texts) {
    this.component = component
    this.place = new Placement(frame)
    this.text = text
  }
}

export type TFillData = string | IGradient | IError
export interface IStop {
  color: string
  position: number
}

export enum GradientType {
  linear = 'linear',
  radial = 'radial',
  angular = 'angular'
}

export interface IGradient {
  gradient: {
    type: GradientType
    stops: IStop[]
    from: {
      x: number
      y: number
    }
    to: {
      x: number
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
  fill?: TFillData
  thickness?: number
  endArrowhead?: TArrowHead
  startArrowhead?: TArrowHead
  lineEnd?: TLineEnd
  lineJoin?: TLineJoin
  dashPattern?: number[]
  radius?: number
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
    this.r = exists(parts) ? parseInt(parts[1], 16) : 255
    this.g = exists(parts) ? parseInt(parts[2], 16) : 255
    this.b = exists(parts) ? parseInt(parts[3], 16) : 255
    this.a = exists(parts) && exists(parts[4]) ? parseInt(parts[4], 16) : 255
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

export enum TBorderStyle {
  dotted = 'dotted',
  dashed = 'dashed',
  solid = 'solid'
}

function dashPatternToBorderStyle (dashPattern: number[]): TBorderStyle {
  if (dashPattern.length === 1) {
    return TBorderStyle.dotted
  }
  if (dashPattern.length === 2) {
    return TBorderStyle.dashed
  }
  return TBorderStyle.solid
}

export class Border {
  endArrowhead: TArrowHead
  startArrowhead: TArrowHead
  lineEnd: TLineEnd
  lineJoin: TLineJoin
  dashPattern: number[]
  fill: Fill
  thickness: number
  radius: number
  borderStyle: TBorderStyle

  constructor (options: TBorderData | null) {
    this.fill = new Fill(options === null || options.fill === undefined ? null : options.fill)
    this.thickness = options === null || options.thickness === undefined ? 0 : options.thickness
    this.endArrowhead = options === null || options.endArrowhead === undefined ? 'None' : options.endArrowhead
    this.startArrowhead = options === null || options.startArrowhead === undefined ? 'None' : options.startArrowhead
    this.lineEnd = options === null || options.lineEnd === undefined ? 'Projecting' : options.lineEnd
    this.lineJoin = options === null || options.lineJoin === undefined ? 'Miter' : options.lineJoin
    this.dashPattern = options === null || options.dashPattern === undefined ? [] : options.dashPattern
    this.borderStyle = dashPatternToBorderStyle(this.dashPattern)
    this.radius = options === null || options.radius === undefined ? 0 : options.radius
  }

  style (): ViewStyle {
    return {
      borderRadius: this.radius,
      borderColor: this.fill.color,
      borderWidth: this.thickness,
      borderStyle: this.borderStyle
    }
  }
}

export interface TShadowData {
  x: number
  y: number
  blur: number
  spread: number
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
  parent: Component

  constructor (frame: IFrameData, fill: TFillData | null, border: TBorderData | null, shadows: TShadowData[], parent: Component) {
    this.place = new Placement(frame)
    this.fill = new Fill(fill)
    this.border = new Border(border)
    this.borderRadius = this.border.radius
    this.shadows = shadows.map(data => new Shadow(data))
    this.parent = parent
    this.Render = this.Render.bind(this)
    this.RenderRect = this.RenderRect.bind(this)
  }

  Render (props: IBaseProps<Image, ImageStyle>): JSX.Element {
    return this.parent.Polygon({
      ...props,
      prototype: this
    })
  }

  RenderRect ({ style, ref, onLayout }: { style?: ViewStyle, ref?: React.RefObject<any>, onLayout?: () => any } = {}): JSX.Element {
    const data = this.fill.data
    if (data === null) {
      return <View style={{
        ...style,
        ...this.borderStyle()
      }} />
    }
    if (typeof data === 'string') {
      return <View style={{
        ...style,
        ...this.borderStyle(),
        backgroundColor: data
      }} />
    }
    if (isError(data)) {
      throw new Error(data.error)
    }
    return <LinearGradient
      colors={data.gradient.stops.map(stop => stop.color)}
      locations={data.gradient.stops.map(stop => stop.position)}
      start={[data.gradient.from.x, data.gradient.from.y]}
      end={[data.gradient.to.x, data.gradient.to.y]}
      ref={ref}
      onLayout={onLayout}
      style={{
        ...this.borderStyle(),
        ...style
      }}
    />
  }

  borderStyle (): ViewStyle {
    return this.border.style()
  }
}

export interface ITextRenderOptions {
  value?: string
  style?: TextStyle
  ref?: React.RefObject<NativeText | TextInput>
  onLayout?: () => any
  onBlur?: () => any
  onEdit?: (text: string) => any
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
    this.styleAbsolute = {
      ...style,
      ...this.place.style(),
      position: 'absolute'
    }
    this.Render = this.Render.bind(this)
  }

  Render (props: ITextBaseProps): JSX.Element {
    return this.parent.Text({
      ...props,
      value: props.value === undefined ? this.text : props.value,
      prototype: this
    })
  }

  render ({ value, style, onEdit, ref, onLayout, onBlur }: ITextRenderOptions): JSX.Element {
    if (value !== undefined) {
      value = String(value)
    } else {
      value = this.text
    }
    const originalValue = value
    if (onEdit !== undefined) {
      return <TextInput
        onChangeText={text => { value = text }} onSubmitEditing={() => originalValue !== value ? onEdit(value) : null} onLayout={onLayout} onBlur={onBlur} ref={ref as React.RefObject<TextInput>} style={{
          ...this.style,
          ...style
        }}>{value}</TextInput>
    }
    return <NativeText
      onLayout={onLayout} ref={ref} style={{
        ...this.style,
        ...style
      }}>{value}</NativeText>
  }

  renderAbsolute (opts: ITextRenderOptions): JSX.Element {
    if (opts.style === undefined || opts.style === null) {
      opts.style = this.styleAbsolute
    } else {
      opts.style = {
        ...opts.style,
        ...this.styleAbsolute
      }
    }
    return this.render(opts)
  }
}
