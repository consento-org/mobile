import React, { useContext, useState } from 'react'
import { Text } from 'react-native'
import { observer } from 'mobx-react'
import { EmptyView } from './EmptyView'
import { elementLocksEmpty } from '../../styles/component/elementLocksEmpty'
import { elementLocksNoLockee } from '../../styles/component/elementLocksNoLockee'
import { elementRelationSelectListAdd } from '../../styles/component/elementRelationSelectListAdd'
import { elementRelationSelectListDisplay } from '../../styles/component/elementRelationSelectListDisplay'
import { VaultContext } from '../../model/VaultContext'
import { ConsentoContext } from '../../model/ConsentoContext'
import { withNavigation, TNavigation } from '../navigation'
import { BottomButtonView } from './BottomButtonView'
import { RelationListEntry, IRelationListEntryProps, IRelationEntry } from './RelationListEntry'
import { Relation } from '../../model/Relation'
import { createLockee } from '../../model/User'

export interface ILocksProps {
  navigation: TNavigation
}

interface ISelectEntryProps extends Omit<Omit<IRelationListEntryProps, 'prototype'>, 'onPress'> {
  onSelect: (entry: IRelationEntry, selected: boolean) => any
}

const SelectEntry = ({ entry, onSelect }: ISelectEntryProps): JSX.Element => {
  const [isSelected, setSelected] = useState<boolean>(false)

  return <RelationListEntry
    entry={entry}
    prototype={isSelected ? elementRelationSelectListAdd.selected.component : elementRelationSelectListAdd.unselected.component}
    onPress={() => {
      setSelected(!isSelected)
      onSelect(entry, !isSelected)
    }}
  />
}

const LockeeList = (): JSX.Element => {
  const [isSelectionActive, setSelectionActive] = useState<boolean>(false)
  const [isAddingLockees, setAddingLockees] = useState<boolean>(false)
  const { user, api } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const selection: { [modelId: string]: IRelationEntry } = {}

  if (isAddingLockees) {
    return <Text>Adding new entries...</Text>
  }

  if (!isSelectionActive) {
    const revoke = (entry: IRelationEntry): void => {
      console.log('REVOKE ' + entry.$modelId)
    }
    return <EmptyView prototype={elementLocksEmpty} onAdd={() => setSelectionActive(true)}>
      {
        user.getLockeesSorted(vault)?.map(
          lockee => <RelationListEntry key={lockee.$modelId} entry={lockee} prototype={elementRelationSelectListDisplay.revoke.component} onPress={revoke} />
        )
      }
    </EmptyView>
  }

  const handleSelect = (entry: IRelationEntry, selected: boolean): void => {
    if (selected) {
      selection[entry.$modelId] = entry
    } else {
      delete selection[entry.$modelId]
    }
  }
  const handleSelectConfirmation = (): void => {
    setAddingLockees(true)
    ;(async () => {
      const relations = Object.values(selection) as Relation[]
      const lockees = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/require-await
        relations.map(async relation => createLockee(api.crypto, relation))
      )
      vault.data.addLockees(lockees)
      setSelectionActive(false)
      setAddingLockees(false)
    })().catch(error => {
      console.log(error)
      setSelectionActive(false)
      setAddingLockees(false)
    })
  }

  return <BottomButtonView prototype={elementRelationSelectListAdd} onPress={handleSelectConfirmation}>
    {
      user.availableRelations(vault).map(
        relation => <SelectEntry key={relation.$modelId} entry={relation} onSelect={handleSelect} />
      )
    }
  </BottomButtonView>
}

export const Locks = withNavigation(observer(({ navigation }: ILocksProps): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  if (user.relations.size === 0) {
    return <EmptyView prototype={user.relations.size === 0 ? elementLocksNoLockee : elementLocksEmpty} onAdd={() => navigation.navigate('newRelation')} />
  }
  return <LockeeList />
}))
