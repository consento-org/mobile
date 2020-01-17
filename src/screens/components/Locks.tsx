import React, { useContext } from 'react'
import { View } from 'react-native'
import { EmptyView } from './EmptyView'
import { elementLocksEmpty } from '../../styles/component/elementLocksEmpty'
import { elementLocksNoLockee } from '../../styles/component/elementLocksNoLockee'
import { VaultContext } from '../../model/VaultContext'
import { ConsentoContext } from '../../model/ConsentoContext'
import { withNavigation, TNavigation } from '../navigation'
import { observer } from 'mobx-react'

export interface ILocksProps {
  navigation: TNavigation
}

export const Locks = withNavigation(observer(({ navigation }: ILocksProps): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const { data } = vault

  const handleAdd = (): void => {
    if (user.relations.size === 0) {
      navigation.navigate('newRelation')
    } else {
      console.log('add relation')
    }
  }

  return <EmptyView prototype={user.relations.size === 0 ? elementLocksNoLockee : elementLocksEmpty} onAdd={handleAdd}>
    {
      data.lockees.length > 0
        ? <View />
        : null
    }
  </EmptyView>
}))
