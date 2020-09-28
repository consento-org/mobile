import React from 'react'
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { ConsentoButton, IButtonProto } from './ConsentoButton'
import { ILayer } from '../../styles/util/types'
import { SketchPolygon } from '../../styles/util/react/SketchPolygon'
import { exists } from '../../styles/util/lang'
import { Polygon } from '../../styles/util/Polygon'

export type IBottomButtonProto = ILayer<{
  bottomArea: ILayer<{
    shape: Polygon
  }>
  button: IButtonProto
}>

export type IBottomButtonSrc = ILayer<{
  bottomButton?: IBottomButtonProto
}>

export interface IBottomButtonProps {
  src: IBottomButtonSrc
  children?: React.ReactChild | React.ReactChild[]
  containerStyle?: ViewStyle
  onPress?: () => any
}

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, display: 'flex', position: 'relative', alignSelf: 'stretch', height: 0 },
  bottomArea: { position: 'absolute', bottom: 0, width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center' },
  bottomRect: { width: '100%', height: '100%', position: 'absolute' },
  scrollContainer: { display: 'flex', flexGrow: 1 }
})

const stylesBySrc = new WeakMap<IBottomButtonSrc, { bottomArea: ViewStyle, scrollContainer: ViewStyle }>()

function hasBottomButton (bottomButton?: IBottomButtonProto, onPress?: () => any): bottomButton is IBottomButtonProto {
  return exists(bottomButton) && exists(onPress)
}

export function BottomButtonView ({ src, children, onPress, containerStyle }: IBottomButtonProps): JSX.Element {
  const { layers: { bottomButton }, backgroundColor } = src
  const paddingBottom = hasBottomButton(bottomButton, onPress) ? bottomButton.place.height : 0
  let srcStyles = stylesBySrc.get(src)
  if (srcStyles === undefined) {
    srcStyles = StyleSheet.create({
      bottomArea: { height: paddingBottom },
      scrollContainer: { paddingBottom }
    })
    stylesBySrc.set(src, srcStyles)
  }
  return <View style={styles.scrollView}>
    <ScrollView
      centerContent
      style={{ backgroundColor }}
      contentContainerStyle={StyleSheet.compose(StyleSheet.compose(srcStyles.scrollContainer, styles.scrollContainer), containerStyle)}>{children}
    </ScrollView>
    {hasBottomButton(bottomButton, onPress)
      ? <View style={StyleSheet.compose(srcStyles.bottomArea, styles.bottomArea)}>
        <SketchPolygon src={bottomButton.layers.bottomArea.layers.shape} style={styles.bottomRect} />
        <ConsentoButton src={bottomButton.layers.button} light onPress={onPress} />
      </View>
      : null}
  </View>
}
