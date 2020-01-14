import React, { useState, createRef } from 'react'
import { TextInput, View, ViewStyle } from 'react-native'
import { elementTopNavEmpty } from '../../styles/component/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/component/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/component/elementTopNavEdit'
import { withNavigation, TNavigation } from '../navigation'
import { exists } from '../../util/exists'
import { useSafeArea } from 'react-native-safe-area-context'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  backgroundColor: elementTopNavEmpty.backgroundColor,
  borderBottomColor: elementTopNavEmpty.borderTop.border.fill.color,
  borderBottomWidth: elementTopNavEmpty.borderTop.border.thickness
})

export type THandler = () => any

export interface ITopNavigationProps {
  title: string
  back?: string | THandler
  navigation: TNavigation
  onEdit?: (text: string) => any
  onDelete?: () => any
}

export const TopNavigation = withNavigation((props: ITopNavigationProps) => {
  const [editing, setEditing] = useState(false)
  const textEdit = createRef<TextInput>()
  const inset = useSafeArea()
  return <View style={{ ...topNav, height: elementTopNavEmpty.height + inset.top }}>
    <View style={{ position: 'relative', top: inset.top }}>
      {exists(props.back)
        ? <elementTopNavItem.back.Render onPress={() => {
          if (typeof props.back === 'string') {
            props.navigation.navigate(props.back)
          } else {
            props.back()
          }
        }} />
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
            onEdit={props.onEdit}
            targetRef={textEdit}
            onLayout={() => { if (exists(textEdit.current)) textEdit.current.focus() }}
            onBlur={() => setEditing(false)} />
        </View>
        : exists(props.onEdit)
          ? <elementTopNavItem.title.Render horz='stretch' value={props.title} onPress={() => { setEditing(true) }} />
          : <elementTopNavEmpty.title.Render horz='stretch' value={props.title} />}
      {(exists(props.onEdit) && !editing) ? <elementTopNavItem.edit.Render horz='end' onPress={() => setEditing(true)} /> : null}
      {exists(props.onDelete) ? <elementTopNavItem.delete.Render horz='end' onPress={props.onDelete} /> : null}
    </View>
  </View>
})
