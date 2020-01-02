import React, { useContext } from 'react'
import { View, Alert } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { Relation as RelationModel } from '../model/Relation'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/ConsentoContext'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'

function confirmAlert (title: string, message: string, onOk: () => void): void {
  Alert.alert(
    title,
    message,
    [
      { text: 'Delete', onPress: onOk },
      { text: 'Abort' }
    ]
  )
}

function confirmDelete (user: User, relation: RelationModel, navigation: TNavigation): void {
  confirmAlert('Please Confirm', 'Are you sure you want to delete the Relation?', () => {
    user.relations.delete(relation)
    navigation.navigate('relations')
  })
}

export const Relation = observer(withNavigation(({ relation, navigation }: { relation: RelationModel, navigation: TNavigation }): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  return <View style={styles.screen}>
    <TopNavigation title={relation.displayName} back='relations' onDelete={() => confirmDelete(user, relation, navigation)} />
  </View>
}))
