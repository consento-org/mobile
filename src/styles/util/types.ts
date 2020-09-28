// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { ImageSourcePropType, TextStyle, ViewStyle } from 'react-native'
import { Placement } from './Placement'

export interface IPlacement {
  w: number
  h: number
  x?: number
  y?: number
  r?: number
  b?: number
}

export function isSketchError (err: any): err is ISketchError {
  if (err === null || typeof err !== 'object') {
    return false
  }
  return typeof err.error === 'string'
}

export interface ISketchError {
  error: string
}

export interface IBaseLayer {
  name: string
  place: Placement
}

export interface ILayer <TLayers extends Object = {}> extends IBaseLayer {
  backgroundColor?: string | undefined
  layers: TLayers
}

export interface IImageAsset extends IBaseLayer {
  source: () => ImageSourcePropType
}

export interface IShadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
}

export type ArrowHead = 'None' | 'OpenArrow' | 'FilledArrow' | 'Line' | 'OpenCircle' | 'FilledCircle' | 'OpenSquare' | 'FilledSquare'
export type Linecap = 'butt' | 'square' | 'round'
export type Linejoin = 'miter' | 'bevel' | 'round'
export type BorderStyle = 'dotted' | 'dashed' | 'solid'
export type GradientType = 'linear' | 'radial' | 'angular'
export type RenderGravity = 'start' | 'end' | 'center' | 'stretch' | 'none'

export interface IStop {
  color: string
  position: number
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

export interface TBorderData {
  fill?: FillData | null
  thickness?: number
  endArrowhead?: ArrowHead
  startArrowhead?: ArrowHead
  strokeLinecap?: Linecap
  strokeLinejoin?: Linejoin
  dashPattern?: number[]
  radius?: number
}

export interface IBorder {
  fill: IFill
  endArrowhead: ArrowHead
  startArrowhead: ArrowHead
  strokeLinecap: Linecap
  strokeLinejoin: Linejoin
  dashPattern: number[]
  thickness: number
  radius: number
}

export type FillData = string | IGradient | ISketchError | null

export interface IFill {
  data: FillData
  color: string | undefined
}

export enum ViewBorders {
  /* eslint-disable no-multi-spaces */
  none        = 0b0000,
  left        = 0b0001,
  right       = 0b0010,
  horizontal  = 0b0011,
  top         = 0b0100,
  topLeft     = 0b0101,
  topRight    = 0b0110,
  skipBottom  = 0b0111,
  bottom      = 0b1000,
  bottomLeft  = 0b1001,
  bottomRight = 0b1010,
  skipTop     = 0b1011,
  vertical    = 0b1100,
  skipRight   = 0b1101,
  skipLeft    = 0b1110,
  all         = 0b1111
}

export type BorderPropsBase = 'borderRadius' | 'borderColor'
export type BorderPropsAll = BorderPropsBase | 'borderWidth' | 'borderStyle'
export type BorderPropsLeft = BorderPropsBase | 'borderLeftColor' | 'borderLeftWidth'
export type BorderPropsRight = BorderPropsBase | 'borderRightColor' | 'borderRightWidth'
export type BorderPropsHorizontal = BorderPropsRight | BorderPropsLeft
export type BorderPropsTop = BorderPropsBase | 'borderTopColor' | 'borderTopWidth'
export type BorderPropsBottom = BorderPropsBase | 'borderBottomColor' | 'borderBottomWidth'
export type BorderPropsVertical = BorderPropsTop | BorderPropsBottom

export interface IPolygonSvgStroke {
  stroke: string
  strokeWidth: number
  strokeDasharray: string | undefined
  strokeLinecap: Linecap
  strokeLinejoin: Linejoin
}

export interface IPolygon extends IBaseLayer {
  /* eslint-disable @typescript-eslint/method-signature-style */
  fill: IFill
  shadows: IShadow[]
  svg: IPolygonSvgStroke | null
  borderStyle (viewBorders: ViewBorders.none): Pick<ViewStyle, BorderPropsBase>
  borderStyle (viewBorders: ViewBorders.left): Pick<ViewStyle, BorderPropsLeft>
  borderStyle (viewBorders: ViewBorders.right): Pick<ViewStyle, BorderPropsRight>
  borderStyle (viewBorders: ViewBorders.horizontal): Pick<ViewStyle, BorderPropsHorizontal>
  borderStyle (viewBorders: ViewBorders.top): Pick<ViewStyle, BorderPropsTop>
  borderStyle (viewBorders: ViewBorders.topLeft): Pick<ViewStyle, BorderPropsTop | BorderPropsLeft>
  borderStyle (viewBorders: ViewBorders.topRight): Pick<ViewStyle, BorderPropsTop | BorderPropsRight>
  borderStyle (viewBorders: ViewBorders.skipBottom): Pick<ViewStyle, BorderPropsTop | BorderPropsHorizontal>
  borderStyle (viewBorders: ViewBorders.bottom): Pick<ViewStyle, BorderPropsBottom>
  borderStyle (viewBorders: ViewBorders.bottomLeft): Pick<ViewStyle, BorderPropsBottom | BorderPropsLeft>
  borderStyle (viewBorders: ViewBorders.bottomRight): Pick<ViewStyle, BorderPropsBottom | BorderPropsRight>
  borderStyle (viewBorders: ViewBorders.skipTop): Pick<ViewStyle, BorderPropsBottom | BorderPropsHorizontal>
  borderStyle (viewBorders: ViewBorders.vertical): Pick<ViewStyle, BorderPropsVertical>
  borderStyle (viewBorders: ViewBorders.skipRight): Pick<ViewStyle, BorderPropsVertical | BorderPropsLeft>
  borderStyle (viewBorders: ViewBorders.skipLeft): Pick<ViewStyle, BorderPropsVertical | BorderPropsLeft>
  borderStyle (viewBorders?: ViewBorders.all): Pick<ViewStyle, BorderPropsAll>
}

export interface ITextBox extends IBaseLayer {
  text: string
  style: TextStyle
}

export type ISlices = [
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType
]

export interface ISlice9 extends IBaseLayer {
  slice: Placement
  slices: () => ISlices
}

export interface IImagePlacement extends IImageAsset {
  image: IImageAsset
}

export interface ISlice9Placement extends ISlice9 {
  slice9: ISlice9
}

export type SketchType = ILayer | IPolygon | ITextBox | ISlice9 | IImageAsset | IImagePlacement | ISlice9Placement

export function isTextBox (input: SketchType): input is ITextBox {
  return 'text' in input
}

export function isPolygon (input: SketchType): input is IPolygon {
  return 'fill' in input
}

export function isSlice9 (input: SketchType): input is ISlice9 {
  return 'slices' in input
}

export function isImageAsset (input: SketchType): input is IImageAsset {
  return 'name' in input && 'source' in input
}

export function isImagePlacement (input: SketchType): input is IImagePlacement {
  return 'image' in input
}

export function isSlice9Placement (input: SketchType): input is ISlice9Placement {
  return 'slice9' in input
}

export function isLayer (input: SketchType): input is ILayer {
  if (isSlice9(input)) return false
  if (isImageAsset(input)) return false
  return 'name' in input
}

export interface ISketchElementProps <TSource extends SketchType> {
  src: TSource
}
