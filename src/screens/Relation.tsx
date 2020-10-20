import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { observer } from 'mobx-react'
import { useUser } from '../model/Consento'
import { Relation as RelationModel } from '../model/Relation'
import { TopNavigation } from './components/TopNavigation'
import { BottomButtonView } from './components/BottomButtonView'
import { InputField } from './components/InputField'
import { Avatar, randomAvatarId } from './components/Avatar'
import { deleteWarning } from './components/deleteWarning'
import { isScreenshotEnabled, screenshots } from '../util/screenshots'
import { useForm } from '../util/useForm'
import { navigate } from '../util/navigate'
import { SketchElement } from '../styles/util/react/SketchElement'
import { exists } from '../styles/util/lang'
import { elementRelationName } from '../styles/design/layer/elementRelationName'
import { User } from '../model/User'
import { ErrorScreen, ErrorCode } from './ErrorScreen'

const { avatar, relationName } = elementRelationName.layers

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    display: 'flex'
  },
  relationName: {
    width: '100%'
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    width: avatar.place.width,
    height: avatar.place.height,
    marginTop: avatar.place.spaceY(relationName.place)
  },
  avatarPlace: {
    position: 'absolute',
    left: avatar.layers.avatar.place.left,
    top: avatar.layers.avatar.place.top
  },
  avatarTouch: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  avatarResetTouch: {
    position: 'absolute',
    top: avatar.layers.crossToucharea.place.top,
    left: avatar.layers.crossToucharea.place.left,
    width: avatar.layers.crossToucharea.place.width,
    height: avatar.layers.crossToucharea.place.height
  },
  avatarReset: {
    marginLeft: avatar.layers.crossIcon.place.left - avatar.layers.crossToucharea.place.left,
    marginTop: avatar.layers.crossIcon.place.top - avatar.layers.crossToucharea.place.top
  },
  label: {
    position: 'absolute',
    top: avatar.layers.label.place.top,
    left: avatar.layers.label.place.left,
    width: avatar.layers.label.place.width
  }
})

export const Relation = observer(({ relationId }: { relationId: string }): JSX.Element => {
  const user = useUser()
  const relation = user.findRelation(relationId)
  if (!exists(relation)) {
    return <ErrorScreen code={ErrorCode.noRelation} />
  }
  return <RelationAvailable relation={relation} user={user} />
})

const RelationAvailable = observer(({ user, relation }: { user: User, relation: RelationModel }) => {
  const { leave, save, useStringField, isDirty } = useForm(
    fields => {
      relation.setName(fields.name)
      relation.setAvatarId(fields.avatarId)
    }
  )
  const name = useStringField('name', relation.name)
  const avatarId = useStringField('avatarId', relation.avatarId)
  if (isScreenshotEnabled) {
    if (!isDirty) {
      if (relation.name !== null && relation.avatarId !== null) {
        screenshots.relationFull.takeSync(500)
      }
      if (relation.name === null && relation.avatarId === null) {
        screenshots.relationEmpty.takeSync(500)
      }
    }
  }
  const back = ['main', 'relations']
  const hasAvatar = exists(avatarId.value)
  const handleAvatarPress = (): void => avatarId.setValue(randomAvatarId())
  const handleClearAvatar = (): void => avatarId.setValue(null)
  const handleDelete = (): void => deleteWarning({
    onPress (): void {
      user.relations.delete(relation)
      navigate(back)
    },
    itemName: 'Relation'
  })
  const handleBack = (): void => { leave(() => navigate(['main', 'relations'])) }
  return <View style={styles.container}>
    <TopNavigation
      title={relation.displayName}
      back={handleBack}
      onDelete={handleDelete}
    />
    <BottomButtonView src={elementRelationName} onPress={save}>
      <View style={styles.container}>
        <InputField
          src={relationName}
          value={name.value ?? null}
          autoFocus
          defaultValue={relation.humanId}
          onEdit={name.handleValue}
          style={styles.relationName}
        />
        <View style={styles.avatarContainer}>
          {
            hasAvatar
              ? <View style={styles.avatarPlace}>
                <Avatar avatarId={avatarId.value} size={avatar.layers.avatar.place.width} />
              </View>
              : <SketchElement src={avatar.layers.placeholder} style={styles.avatarPlace} />
          }
          <SketchElement src={avatar.layers.label} style={styles.label} />
          <TouchableOpacity style={styles.avatarTouch} onPress={handleAvatarPress} />
          {
            hasAvatar
              ? <TouchableOpacity style={styles.avatarResetTouch} onPress={handleClearAvatar}>
                <SketchElement src={avatar.layers.crossIcon} style={styles.avatarReset} />
              </TouchableOpacity>
              : null
          }
        </View>
      </View>
    </BottomButtonView>
  </View>
})
