import React, { useContext, useState } from 'react'
import { Text, Alert } from 'react-native'
import { observer } from 'mobx-react'
import { EmptyView } from './EmptyView'
import { elementLocksEmpty } from '../../styles/component/elementLocksEmpty'
import { elementLocksNoLockee } from '../../styles/component/elementLocksNoLockee'
import { elementRelationSelectListAdd } from '../../styles/component/elementRelationSelectListAdd'
import { elementRelationSelectListDisplay } from '../../styles/component/elementRelationSelectListDisplay'
import { VaultContext } from '../../model/VaultContext'
import { withNavigation, TNavigation } from '../navigation'
import { BottomButtonView } from './BottomButtonView'
import { RelationListEntry, IRelationListEntryProps, IRelationEntry } from './RelationListEntry'
import { Relation } from '../../model/Relation'
import { ConsentoContext } from '../../model/Consento'
import { Lockee } from '../../model/User'

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
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const selection: { [modelId: string]: IRelationEntry } = {}

  if (isAddingLockees) {
    return <Text>Adding new entries...</Text>
  }

  const availableRelations = user.availableRelations(vault)

  if (!isSelectionActive) {
    const revoke = (entry: Lockee): void => {
      console.log('REVOKE ' + entry.vaultLockee.$modelId)
    }
    const handleAdd = availableRelations.length > 0 ? () => setSelectionActive(true) : undefined
    return <EmptyView prototype={elementLocksEmpty} onAdd={handleAdd}>
      {
        user.getLockeesSorted(vault)?.map(
          lockee => <RelationListEntry key={lockee.vaultLockee.$modelId} entry={lockee} prototype={elementRelationSelectListDisplay.revoke.component} onPress={revoke} />
        )
      }
    </EmptyView>
  }

  const handleSelect = (relation: Relation, selected: boolean): void => {
    if (selected) {
      selection[relation.$modelId] = relation
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete selection[relation.$modelId]
    }
  }
  const handleSelectConfirmation = (): void => {
    setAddingLockees(true)
    ;(async () => {
      const relations = Object.values(selection) as Relation[]
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/require-await
        relations.map(async relation => vault.addLockee(relation))
      )
      setSelectionActive(false)
      setAddingLockees(false)
    })().catch(error => {
      Alert.alert(
        'Failed',
        `Woops, for some reason the lockee could not be added.\n [${String(error.code)}]`
      )
      console.log(error)
      setSelectionActive(false)
      setAddingLockees(false)
    })
  }

  return <BottomButtonView prototype={elementRelationSelectListAdd} onPress={handleSelectConfirmation}>
    {
      availableRelations.map(
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
