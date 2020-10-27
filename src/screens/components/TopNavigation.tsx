import React, { useState } from 'react'
import { View, ViewStyle, StyleSheet, TextInputProps, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import { elementTopNavEmpty } from '../../styles/design/layer/elementTopNavEmpty'
import { elementTopNavItem } from '../../styles/design/layer/elementTopNavItem'
import { elementTopNavEdit } from '../../styles/design/layer/elementTopNavEdit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DarkBar } from './DarkBar'
import { ViewBorders } from '../../styles/util/types'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { SketchTextBoxInput, SketchTextBoxView } from '../../styles/util/react/SketchTextBox'
import { SketchImage } from '../../styles/util/react/SketchImage'
import { SketchPolygon } from '../../styles/util/react/SketchPolygon'
import { navigate, IBackHandler, useBackHandler } from '../../util/navigate'
import { exists } from '../../styles/util/lang'
import { PropType } from '../../util/PropType'

const { back, edit, delete: deleteButton, title: titleItem } = elementTopNavItem.layers
const { logo, borderTop, title: titleEmpty } = elementTopNavEmpty.layers
const { background: editBg, underline } = elementTopNavEdit.layers

const styles = StyleSheet.create({
  container: {
    backfaceVisibility: 'visible',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'stretch',
    ...borderTop.borderStyle(ViewBorders.bottom)
  },
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  back: {
    marginLeft: back.place.left,
    marginTop: back.place.top
  },
  logo: {
    marginLeft: logo.place.left,
    marginTop: logo.place.top
  },
  left: {
    width: titleEmpty.place.left
  },
  center: {
    flexGrow: 1
  },
  right: {
    width: titleEmpty.place.right,
    position: 'relative'
  },
  edit: {
    position: 'absolute',
    top: edit.place.top,
    left: titleEmpty.place.right - (edit.place.right + edit.place.width),
    borderWidth: 1,
    zIndex: 1
  },
  delete: {
    position: 'absolute',
    top: deleteButton.place.top,
    left: titleEmpty.place.right - (deleteButton.place.right + deleteButton.place.width),
    zIndex: 1
  },
  editBg: {
    position: 'absolute',
    top: editBg.place.top,
    width: '100%',
    ...underline.borderStyle(ViewBorders.bottom)
  },
  title: {
    marginTop: titleEmpty.place.top,
    width: '100%'
  }
})

export interface ITopNavigationProps <TBackArgs = any> {
  title: string
  titlePlaceholder?: PropType<TextInputProps, 'placeholder'>
  titleTextContentType?: PropType<TextInputProps, 'textContentType'>
  back?: IBackHandler<TBackArgs>
  onEdit?: (text: string) => any
  onDelete?: () => any
}

function isEmpty (value: string): boolean {
  return value === null || value === undefined || /^\s*$/.test(value)
}

export const TopNavigation = (props: ITopNavigationProps): JSX.Element => {
  const [editing, setEditing] = useState(false)
  const inset = useSafeAreaInsets()
  const canEdit = exists(props.onEdit)
  const canDelete = exists(props.onDelete)
  const handleBack = useBackHandler(props.back)
  const handleConfig = (): void => navigate('config')
  const handleEdit = canEdit ? (): void => setEditing(true) : undefined
  const handleBlur = (): void => setEditing(false)
  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>): void => {
    const edit = (props?.onEdit) as (text: string) => void
    edit(e.nativeEvent.text)
    setEditing(false)
  }
  return <View style={StyleSheet.compose<ViewStyle>(styles.container, { height: elementTopNavEmpty.place.height + inset.top })}>
    <DarkBar height={inset.top} />
    <View style={styles.header}>
      <View style={styles.left}>
        {exists(props.back)
          ? <SketchElement src={back} style={styles.back} onPress={handleBack} />
          : <SketchElement src={logo} style={styles.logo} onPress={handleConfig} />}
      </View>
      <View style={styles.center}>
        {editing
          ? <>
            <SketchPolygon src={editBg} style={styles.editBg} />
            <SketchTextBoxInput
              src={elementTopNavEdit.layers.title}
              style={styles.title}
              defaultValue={props.title}
              placeholder={props.titlePlaceholder}
              textContentType={props.titleTextContentType}
              onSubmitEditing={handleSubmit}
              autoFocus
              onBlur={handleBlur} />
          </>
          : <>
            <SketchTextBoxView
              style={styles.title}
              src={canEdit ? titleItem : titleEmpty}
              value={isEmpty(props.title) ? props.titlePlaceholder : props.title}
              onPress={handleEdit}
            />
          </>}
      </View>
      <View style={styles.right}>
        {canEdit && !editing ? <SketchImage style={styles.edit} src={edit} onPress={handleEdit} /> : null}
        {canDelete ? <SketchImage style={styles.delete} src={deleteButton} onPress={props.onDelete} /> : null}
      </View>
    </View>
  </View>
}
