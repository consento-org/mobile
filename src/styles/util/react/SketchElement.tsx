// This file has been generated with expo-export@5.0.0, a Sketch plugin.
import { isImageAsset, ISketchElementProps, isImagePlacement, isTextBox, isSlice9Placement, isSlice9 } from '../types'
import { ISketchImageProps, SketchImage } from './SketchImage'
import { ISketchTextBoxProps, SketchTextBox } from './SketchTextBox'
import { ISketchSlice9Props, SketchSlice9 } from './SketchSlice9'
import { SketchPolygon } from './SketchPolygon'

function isImageProps (props: ISketchElementProps<any>): props is ISketchImageProps {
  return isImageAsset(props.src) || isImagePlacement(props.src)
}

function isTextBoxProps (props: ISketchElementProps<any>): props is ISketchTextBoxProps {
  return isTextBox(props.src)
}

function isSlice9Props (props: ISketchElementProps<any>): props is ISketchSlice9Props {
  return isSlice9(props.src) || isSlice9Placement(props.src)
}

export function SketchElement (props: ISketchImageProps): JSX.Element
export function SketchElement (props: ISketchTextBoxProps): JSX.Element
export function SketchElement (props: ISketchSlice9Props): JSX.Element
export function SketchElement (props: ISketchImageProps | ISketchTextBoxProps | ISketchSlice9Props): JSX.Element {
  if (isImageProps(props)) {
    return SketchImage(props)
  }
  if (isTextBoxProps(props)) {
    return SketchTextBox(props)
  }
  if (isSlice9Props(props)) {
    return SketchSlice9(props)
  }
  return SketchPolygon(props)
}
