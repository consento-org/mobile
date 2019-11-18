import React, { useState, createRef } from 'react'
import { TextInput, View, ViewStyle } from 'react-native'
import { elementTopNavEmpty } from '../../styles/component/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/component/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/component/elementTopNavEdit'
import { withNavigation, TNavigation } from '../navigation'

const topNav = Object.freeze<ViewStyle>({
  backfaceVisibility: 'visible',
  backgroundColor: elementTopNavEmpty.backgroundColor,
  borderBottomColor: elementTopNavEmpty.borderTop.border.fill.color,
  borderBottomWidth: elementTopNavEmpty.borderTop.border.thickness,
  height: elementTopNavEmpty.height
})

export interface ITopNavigationProps {
  title: string
  back?: boolean
  navigation: TNavigation
  onEdit?: (text: string) => any
  onDelete?: () => any
}

export const TopNavigation = withNavigation((props: ITopNavigationProps) => {
  const [ editing, setEditing ] = useState(false)
  const textEdit = createRef<TextInput>()
  return <View style={ topNav }>
    { props.back
      ? <elementTopNavItem.back.Render onPress={ () => props.navigation.goBack() } />
      : <elementTopNavEmpty.logo.Render/>
    }
    { editing
      ? <View>
          <elementTopNavEdit.Render place={ elementTopNavEdit.background.place } horz={ 'stretch' } item={() =>
            <View style={{
              position: 'absolute',
              width: '100%',
              height: elementTopNavEdit.background.place.height,
              backgroundColor: elementTopNavEdit.background.fill.color,
              borderColor: elementTopNavEdit.underline.border.fill.color,
              borderBottomWidth: elementTopNavEdit.underline.border.thickness
            } as ViewStyle}></View>
          }/>
          <elementTopNavEdit.title.Render horz={ 'stretch' } value={ props.title } onEdit={ props.onEdit }
            targetRef={ textEdit } onLayout={ () => textEdit.current && textEdit.current.focus() } onBlur={ () => setEditing(false) }/>
        </View>
      : (props.onEdit || props.onDelete)
        ? <elementTopNavItem.title.Render horz={ 'stretch' } value={ props.title } onPress={ () => props.onEdit && setEditing(true) } />
        : <elementTopNavEmpty.title.Render horz={ 'stretch' } value={ props.title } />
    }
    { (props.onEdit !== undefined && !editing) ? <elementTopNavItem.edit.Render horz={ 'end' } onPress={ () => setEditing(true) }/> : null }
    { props.onDelete !== undefined ? <elementTopNavItem.delete.Render horz={ 'end' } onPress={ props.onDelete }/> : null }
  </View>
})