import React, { useContext } from 'react'
import { View } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { observer } from 'mobx-react'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'
import { BottomButtonView } from './components/BottomButtonView'
import { RelationContext } from '../model/RelationContext'
import { InputField } from './components/InputField'
import { useForm } from '../util/useForm'
import { ConsentoContext } from '../model/Consento'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { exists } from '../util/exists'
import { Avatar, randomAvatarId } from './components/Avatar'
import { ScreenshotContext } from '../util/screenshots'
import { deleteWarning } from './components/deleteWarning'

const avatar = elementRelationName.elementAvatarGenerate.component

export const Relation = withNavigation(observer(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { relation } = useContext(RelationContext)
  const screenshots = useContext(ScreenshotContext)
  const { user } = useContext(ConsentoContext)
  const { leave, save, useStringField, isDirty } = useForm(
    navigation,
    fields => {
      relation.setName(fields.name ?? '')
      relation.setAvatarId(fields.avatarId)
    }
  )
  const name = useStringField('name', relation.name)
  const avatarId = useStringField('avatarId', relation.avatarId)
  if (!isDirty) {
    if (relation.name !== '' && relation.avatarId !== null) {
      screenshots.relationFull.takeSync(500)
    }
    if (relation.name === '' && relation.avatarId === null) {
      screenshots.relationEmpty.takeSync(500)
    }
  }
  return <View style={{ flex: 1 }}>
    <TopNavigation
      title={relation.displayName}
      back={() => leave(() => navigation.navigate('relations'))}
      onDelete={() => deleteWarning({
        onPress (): void {
          user.relations.delete(relation)
          navigation.navigate('relations')
        },
        itemName: 'Relation'
      })}
    />
    <BottomButtonView prototype={elementRelationName} onPress={save}>
      <InputField
        proto={elementRelationName.relationName}
        value={name.value}
        autoFocus
        defaultValue={relation.humanId}
        onEdit={name.handleValue}
      />
      <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <View style={{
          position: 'absolute',
          top: elementRelationName.elementAvatarGenerate.place.top,
          width: avatar.width,
          height: avatar.height
        }}>
          {
            exists(avatarId.value)
              ? <Avatar avatarId={avatarId.value} place={avatar.avatar.place} />
              : <avatar.placeholder.Render />
          }
          <avatar.label.Render />
          <TouchableOpacity style={{ width: '100%', height: '100%', top: 0, left: 0 }} onPress={() => avatarId.setValue(randomAvatarId())} />
          {
            exists(avatarId.value)
              ? <View style={{ position: 'absolute', ...avatar.crossToucharea.place.style() }}>
                <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => avatarId.setValue(null)}>
                  {
                    avatar.crossIcon.img({
                      marginTop: avatar.crossIcon.place.left - avatar.crossToucharea.place.left,
                      marginBottom: avatar.crossIcon.place.top - avatar.crossToucharea.place.top
                    })
                  }
                </TouchableOpacity>
              </View>
              : null
          }
        </View>
      </View>
    </BottomButtonView>
  </View>
}))
