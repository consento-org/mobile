// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { Placement } from './Placement'
import { IPlacement, FillData, IShadow, BorderStyle, IBorder, TBorderData, IPolygon, IPolygonSvgStroke, BorderPropsBase, BorderPropsLeft, BorderPropsRight, BorderPropsHorizontal, BorderPropsTop, BorderPropsBottom, BorderPropsVertical, BorderPropsAll, ViewBorders } from './types'
import { Fill } from './Fill'
import { Shadow } from './Shadow'
import { ViewStyle, StyleSheet } from 'react-native'

function dashPatternToBorderStyle (dashPattern?: number[]): BorderStyle {
  if (dashPattern?.length === 1) {
    return 'dotted'
  }
  if (dashPattern?.length === 2) {
    return 'dashed'
  }
  return 'solid'
}

export function borderDefaults (border: TBorderData | null): IBorder {
  return {
    fill: new Fill(border?.fill ?? null),
    thickness: border?.thickness ?? 0,
    endArrowhead: border?.endArrowhead ?? 'None',
    startArrowhead: border?.startArrowhead ?? 'None',
    strokeLinecap: border?.strokeLinecap ?? 'square',
    strokeLinejoin: border?.strokeLinejoin ?? 'miter',
    dashPattern: border?.dashPattern ?? [],
    radius: border?.radius ?? 0
  }
}

function createBorderViewStyle (borderColor: string | undefined, border: IBorder, borders: number): ViewStyle {
  const borderStyle = dashPatternToBorderStyle(border.dashPattern)
  const result: ViewStyle = {
    borderRadius: border.radius,
    borderStyle
  }
  if (borders === ViewBorders.all) {
    result.borderColor = borderColor
    result.borderWidth = border.thickness
    return result
  }
  if ((borders & ViewBorders.top) === ViewBorders.top) {
    result.borderTopColor = borderColor
    result.borderTopWidth = border.thickness
  }
  if ((borders & ViewBorders.left) === ViewBorders.left) {
    result.borderLeftColor = borderColor
    result.borderLeftWidth = border.thickness
  }
  if ((borders & ViewBorders.right) === ViewBorders.right) {
    result.borderRightColor = borderColor
    result.borderRightWidth = border.thickness
  }
  if ((borders & ViewBorders.bottom) === ViewBorders.bottom) {
    result.borderBottomColor = borderColor
    result.borderBottomWidth = border.thickness
  }
  return result
}

export class Polygon implements IPolygon {
  name: string
  place: Placement
  fill: Fill
  shadows: Shadow[]
  private _svg?: IPolygonSvgStroke | null
  private readonly _styles: { [key: number]: ViewStyle }
  private readonly _border: IBorder

  constructor (name: string, place: IPlacement, fill: FillData | null, border: TBorderData | null, shadows: IShadow[]) {
    this.name = name
    this._border = borderDefaults(border)
    this.place = new Placement(place)
    this.fill = new Fill(fill)
    this.shadows = shadows.map(data => new Shadow(data))
    this._styles = {}
  }

  get svg (): IPolygonSvgStroke | null {
    if (this._svg === undefined) {
      if (this._border.fill.color === undefined) {
        this._svg = null
      } else {
        this._svg = {
          stroke: this._border.fill.color,
          strokeDasharray: this._border?.dashPattern.length > 0 ? this._border.dashPattern.join(' ') : undefined,
          strokeLinecap: this._border.strokeLinecap,
          strokeLinejoin: this._border.strokeLinejoin,
          strokeWidth: this._border.thickness
        }
      }
    }
    return this._svg
  }

  /**
   * Produces a partial react-native view style for a combinatory set of borders.
   *
   * @param borders Binary flag lookup: for example use: ViewBorders.top & ViewBorders.left for borders on top left.
   */
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
  borderStyle (borders: ViewBorders = ViewBorders.all): ViewStyle {
    borders = borders & ViewBorders.all
    let style = this._styles[borders]
    if (style === undefined) {
      style = StyleSheet.create({
        viewStyle: createBorderViewStyle(this.svg?.stroke, this._border, borders)
      }).viewStyle
      this._styles[borders] = style
    }
    return style
  }
}
