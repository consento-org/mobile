import React, { useState, useEffect } from 'react'
import { View, ViewStyle, BackHandler } from 'react-native'
import { elementTopNavEmpty } from '../../styles/design/layer/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/design/layer/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/design/layer/elementTopNavEdit'
import { exists } from '@consento/api/util'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DarkBar } from './DarkBar'
import { ViewBorders } from '../../styles/util/types'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { SketchTextBoxInput, SketchTextBoxView } from '../../styles/util/react/SketchTextBox'
import { SketchImage } from '../../styles/util/react/SketchImage'
import { SketchPolygon } from '../../styles/util/react/SketchPolygon'
import { navigate } from '../../util/navigate'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  ...elementTopNavEmpty.layers.borderTop.borderStyle(ViewBorders.bottom)
})

export type THandler = () => any

export interface ITopNavigationProps {
  title: string
  titlePlaceholder?: string
  back?: string | THandler
  onEdit?: (text: string) => any
  onDelete?: () => any
}

function isEmpty (value: string): boolean {
  return value === null || value === undefined || /^\s*$/.test(value)
}

export const TopNavigation = (props: ITopNavigationProps): JSX.Element => {
  const [editing, setEditing] = useState(false)
  const inset = useSafeAreaInsets()
  const handleBack = (): boolean => {
    if (!exists(props.back)) {
      return
    }
    if (typeof props.back === 'string') {
      navigate(props.back)
    } else {
      props.back()
    }
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack)
    }
  }, [])

  return <View style={{ ...topNav, height: elementTopNavEmpty.place.height + inset.top, alignSelf: 'stretch' }}>
    <DarkBar />
    <View style={{ position: 'relative' }}>
      {exists(props.back)
        ? <SketchElement src={elementTopNavItem.layers.back} style={{ paddingLeft: elementTopNavItem.layers.back.place.left, paddingTop: elementTopNavItem.layers.back.place.top }} onPress={handleBack} />
        : <SketchElement src={elementTopNavEmpty.layers.logo} onPress={() => navigate('config')} style={{ marginLeft: elementTopNavEmpty.layers.logo.place.left, marginTop: elementTopNavEmpty.layers.logo.place.top }} />}
      {editing
        ? <View>
          <SketchPolygon src={elementTopNavEdit.layers.background} />
          <SketchTextBoxInput
            src={elementTopNavEdit.layers.title}
            value={props.title}
            placeholder={props.titlePlaceholder}
            onChangeText={props.onEdit}
            ref={textEdit => textEdit?.focus()}
            onBlur={() => {
              setEditing(false)
            }} />
        </View>
        : exists(props.onEdit)
          ? <SketchTextBoxView src={elementTopNavItem.layers.title} value={isEmpty(props.title) ? props.titlePlaceholder : props.title} onPress={() => { setEditing(true) }} />
          : <SketchTextBoxView src={elementTopNavEmpty.layers.title} value={isEmpty(props.title) ? props.titlePlaceholder : props.title} />}
      {(exists(props.onEdit) && !editing) ? <SketchImage src={elementTopNavItem.layers.edit} onPress={() => setEditing(true)} /> : null}
      {exists(props.onDelete) ? <SketchImage src={elementTopNavItem.layers.delete} onPress={props.onDelete} /> : null}
    </View>
  </View>
}
