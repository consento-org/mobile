import React, { useContext, useState } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { Relation as RelationModel } from '../model/Relation'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/ConsentoContext'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'
import { BottomButtonView } from './components/BottomButtonView'
import { RelationContext } from '../model/RelationContext'
import { InputField } from './components/InputField'
import { useForm } from '../util/useForm'

function confirmAlert (title: string, message: string, onOk: () => void): void {
  Alert.alert(
    title,
    message,
    [
      { text: 'Delete', onPress: onOk },
      { text: 'Cancel' }
    ]
  )
}

function confirmDelete (user: User, relation: RelationModel, navigation: TNavigation): void {
  confirmAlert('Delete', 'Are you sure you want to delete this Relation?', () => {
    user.relations.delete(relation)
    navigation.navigate('relations')
  })
}

export const Relation = observer(withNavigation(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { relation } = useContext(RelationContext)
  const { user } = useContext(ConsentoContext)
  const [name, setName] = useState<string>(relation.name)
  const { leave, setDirty, save } = useForm(navigation, (): void => {
    relation.setName(name)
  })
  return <View style={styles.screen}>
    <TopNavigation
      title={relation.displayName}
      back={() => leave(() => navigation.navigate('relations'))}
      onDelete={() => confirmDelete(user, relation, navigation)}
    />
    <BottomButtonView prototype={elementRelationName} onPress={save}>
      <InputField
        proto={elementRelationName.relationName}
        value={name}
        defaultValue={relation.defaultName}
        onEdit={value => {
          setName(value)
          setDirty(value !== relation.name)
        }}
      />
    </BottomButtonView>
  </View>
}))
