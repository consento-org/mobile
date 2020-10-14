import React, { useEffect } from 'react'
import { StyleSheet, GestureResponderEvent } from 'react-native'
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
  onAdd?: (event: GestureResponderEvent) => any
  onEmpty?: (() => void) | (() => () => {})
  children?: React.ReactChild | React.ReactChild[]
  isEmpty?: boolean
}

export function createEmptyView (empty: IEmptyViewProto): (props: IEmptyViewProps) => JSX.Element {
  const { illustration, description, title } = empty.layers
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    illustration: {
      marginTop: 60,
      marginBottom: title.place.spaceY(illustration.place),
      width: illustration.place.width,
      height: illustration.place.height
    },
    title: {
      marginHorizontal: description.place.x,
      marginBottom: description.place.spaceY(title.place)
    },
    description: {
      marginHorizontal: description.place.x,
      marginBottom: 60
    }
  })
  return ({ onAdd, children, isEmpty, onEmpty }: IEmptyViewProps): JSX.Element => {
    isEmpty = isEmpty ?? !exists(children)
    useEffect(() => {
      let cleanup: undefined | (() => any)
      if (typeof onEmpty === 'function') {
        cleanup = onEmpty() as any
      }
      return cleanup ?? (() => {})
    }, [isEmpty])
    if (isEmpty) {
      return <BottomButtonView src={empty} onPress={onAdd} containerStyle={styles.container}>
        <SketchElement src={illustration} style={styles.illustration} />
        <SketchElement src={title} style={styles.title} />
        <SketchElement src={description} style={styles.description} />
      </BottomButtonView>
    }
    return <>{children}</>
  }
}
