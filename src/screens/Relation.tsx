import React, { useContext } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { observer } from 'mobx-react'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'
import { BottomButtonView } from './components/BottomButtonView'
import { RelationContext } from '../model/RelationContext'
import { InputField } from './components/InputField'
import { useForm } from '../util/useForm'
import { Relation as RelationModel } from '../model/Relation'
import { ConsentoContext } from '../model/Consento'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { exists } from '../util/exists'
import { Avatar, randomAvatarId } from './components/Avatar'

function confirmDelete (user: User, relation: RelationModel, navigation: TNavigation): void {
  Alert.alert(
    'Delete',
    'Are you sure you want to delete this Relation?',
    [
      {
        text: 'Delete',
        onPress: () => {
          user.relations.delete(relation)
          navigation.navigate('relations')
        }
      },
      { text: 'Cancel' }
    ]
  )
}

const avatar = elementRelationName.elementAvatarGenerate.component

export const Relation = withNavigation(observer(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { relation } = useContext(RelationContext)
  const { user } = useContext(ConsentoContext)
  const { leave, save, useField } = useForm(
    navigation,
    fields => {
      relation.setName(fields.name ?? '')
      relation.setAvatarId(fields.avatarId)
    }
  )
  const name = useField('name', relation.name)
  const avatarId = useField('avatarId', relation.avatarId)
  return <View style={{ flex: 1 }}>
    <TopNavigation
      title={relation.displayName}
      back={() => leave(() => navigation.navigate('relations'))}
      onDelete={() => confirmDelete(user, relation, navigation)}
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
          position: 'relative',
          marginTop: elementRelationName.elementAvatarGenerate.place.top - elementRelationName.relationName.place.bottom,
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
