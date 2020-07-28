import React, { useState, useEffect } from 'react'
import { View, ViewStyle, BackHandler } from 'react-native'
import { elementTopNavEmpty } from '../../styles/component/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/component/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/component/elementTopNavEdit'
import { withNavigation, TNavigation } from '../navigation'
import { exists } from '@consento/api/util'
import { useSafeArea } from 'react-native-safe-area-context'
import { DarkBar } from './DarkBar'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  backgroundColor: elementTopNavEmpty.backgroundColor,
  borderBottomColor: elementTopNavEmpty.borderTop.border.fill.color,
  borderBottomWidth: elementTopNavEmpty.borderTop.border.thickness
})

export type THandler = () => any

export interface ITopNavigationProps {
  title: string
  titlePlaceholder?: string
  back?: string | THandler
  navigation: TNavigation
  onEdit?: (text: string) => any
  onDelete?: () => any
}

function isEmpty (value: string): boolean {
  return value === null || value === undefined || /^\s*$/.test(value)
}

export const TopNavigation = withNavigation((props: ITopNavigationProps) => {
  const [editing, setEditing] = useState(false)
  const inset = useSafeArea()
  const handleBack = (): boolean => {
    if (!exists(props.back)) {
      return
    }
    if (typeof props.back === 'string') {
      props.navigation.navigate(props.back)
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

  return <View style={{ ...topNav, height: elementTopNavEmpty.height + inset.top }}>
    <DarkBar />
    <View style={{ position: 'relative' }}>
      {exists(props.back)
        ? <elementTopNavItem.back.Render
          onPress={handleBack}
        />
        : <elementTopNavEmpty.logo.Render onPress={() => props.navigation.navigate('config')} style={{ zIndex: 1 }} />}
      {editing
        ? <View>
          <elementTopNavEdit.Render
            place={elementTopNavEdit.background.place}
            horz='stretch'
            item={() =>
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              <View style={{
                position: 'absolute',
                width: '100%',
                height: elementTopNavEdit.background.place.height,
                backgroundColor: elementTopNavEdit.background.fill.color,
                borderColor: elementTopNavEdit.underline.border.fill.color,
                borderBottomWidth: elementTopNavEdit.underline.border.thickness
              } as ViewStyle} />}
          />
          <elementTopNavEdit.title.Render
            horz='stretch'
            value={props.title}
            placeholder={props.titlePlaceholder}
            onEdit={props.onEdit}
            targetRef={textEdit => textEdit?.focus()}
            onBlur={() => {
              setEditing(false)
            }} />
        </View>
        : exists(props.onEdit)
          ? <elementTopNavItem.title.Render horz='stretch' value={isEmpty(props.title) ? props.titlePlaceholder : props.title} onPress={() => { setEditing(true) }} />
          : <elementTopNavEmpty.title.Render horz='stretch' value={isEmpty(props.title) ? props.titlePlaceholder : props.title} />}
      {(exists(props.onEdit) && !editing) ? <elementTopNavItem.edit.Render horz='end' onPress={() => setEditing(true)} /> : null}
      {exists(props.onDelete) ? <elementTopNavItem.delete.Render horz='end' onPress={props.onDelete} /> : null}
    </View>
  </View>
})
