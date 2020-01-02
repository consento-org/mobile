import React, { useState, createRef } from 'react'
import { TextInput, View, ViewStyle } from 'react-native'
import { elementTopNavEmpty } from '../../styles/component/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/component/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/component/elementTopNavEdit'
import { withNavigation, TNavigation } from '../navigation'
import { exists, anyExists } from '../../util/exists'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  backgroundColor: elementTopNavEmpty.backgroundColor,
  borderBottomColor: elementTopNavEmpty.borderTop.border.fill.color,
  borderBottomWidth: elementTopNavEmpty.borderTop.border.thickness,
  height: elementTopNavEmpty.height
})

export interface ITopNavigationProps {
  title: string
  back?: string
  navigation: TNavigation
  onEdit?: (text: string) => any
  onDelete?: () => any
}

export const TopNavigation = withNavigation((props: ITopNavigationProps) => {
  const [editing, setEditing] = useState(false)
  const textEdit = createRef<TextInput>()
  return <View style={topNav}>
    {exists(props.back)
      ? <elementTopNavItem.back.Render onPress={() => props.navigation.navigate(props.back)} />
      : <elementTopNavEmpty.logo.Render />}
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
      : anyExists(props.onEdit, props.onDelete)
        ? <elementTopNavItem.title.Render horz='stretch' value={props.title} onPress={() => { if (exists(props.onEdit)) setEditing(true) }} />
        : <elementTopNavEmpty.title.Render horz='stretch' value={props.title} />}
    {(exists(props.onEdit) && !editing) ? <elementTopNavItem.edit.Render horz='end' onPress={() => setEditing(true)} /> : null}
    {exists(props.onDelete) ? <elementTopNavItem.delete.Render horz='end' onPress={props.onDelete} /> : null}
  </View>
})
