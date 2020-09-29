import React, { useEffect } from 'react'
import { StyleSheet, ViewStyle, ImageStyle, TextStyle, GestureResponderEvent } from 'react-native'
import { BottomButtonView } from './BottomButtonView'
import { exists } from '@consento/api/util'
import { TextBox } from '../../styles/util/TextBox'
import { ImagePlacement } from '../../styles/util/ImagePlacement'
import { ILayer } from '../../styles/util/types'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { elementBottomButton } from '../../styles/design/layer/elementBottomButton'

export type IEmptyViewProto = ILayer<{
  description: TextBox
  illustration: ImagePlacement
  title: TextBox
  bottomButton?: typeof elementBottomButton
}>

export interface IEmptyViewProps {
  empty: IEmptyViewProto
  onAdd?: (event: GestureResponderEvent) => any
  onEmpty?: () => undefined | (() => {})
  children?: React.ReactChild | React.ReactChild[]
  isEmpty?: boolean
}

const stylesByProto = new WeakMap<IEmptyViewProto, { container: ViewStyle, illustration: ImageStyle, description: TextStyle, title: TextStyle }>()

export function EmptyView ({ empty, onAdd, children, isEmpty, onEmpty }: IEmptyViewProps): JSX.Element {
  isEmpty = isEmpty ?? !exists(children)
  useEffect(() => {
    let cleanup: undefined | (() => any)
    if (typeof onEmpty === 'function') {
      cleanup = onEmpty()
    }
    return cleanup ?? (() => {})
  }, [isEmpty])
  if (isEmpty) {
    let styles = stylesByProto.get(empty)
    if (styles === undefined) {
      styles = StyleSheet.create({
        container: { marginHorizontal: empty.layers.description.place.x, display: 'flex', alignItems: 'center' },
        illustration: { marginTop: 60, marginBottom: empty.layers.title.place.spaceY(empty.layers.illustration.place) },
        description: { marginBottom: 60 },
        title: { marginBottom: empty.layers.description.place.spaceY(empty.layers.title.place) }
      })
      stylesByProto.set(empty, styles)
    }
    return <BottomButtonView src={empty} onPress={onAdd} containerStyle={styles.container}>
      <SketchElement src={empty.layers.illustration} style={styles.illustration} />
      <SketchElement src={empty.layers.title} style={styles.title} />
      <SketchElement src={empty.layers.description} style={styles.description} />
    </BottomButtonView>
  }
  return <>{children}</>
}
