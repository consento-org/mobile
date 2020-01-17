import React, { useContext } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/ConsentoContext'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'
import { BottomButtonView } from './components/BottomButtonView'
import { RelationContext } from '../model/RelationContext'
import { InputField } from './components/InputField'
import { useForm } from '../util/useForm'
import { Relation as RelationModel } from '../model/Relation'

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

export const Relation = observer(withNavigation(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { relation } = useContext(RelationContext)
  const { user } = useContext(ConsentoContext)
  const { leave, save, useField } = useForm(
    navigation,
    (fields: { [key: string]: any }): void => {
      relation.setName(fields.name)
    }
  )
  const name = useField('name', relation.name)
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
        defaultValue={relation.defaultName}
        onEdit={name.handleValue}
      />
    </BottomButtonView>
  </View>
}))
