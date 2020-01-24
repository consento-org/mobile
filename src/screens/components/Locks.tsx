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
import { RelationListEntry, IRelationListEntryProps } from './RelationListEntry'
import { Relation } from '../../model/Relation'
import { ConsentoContext } from '../../model/Consento'
import { Lockee } from '../../model/User'
import { IRelationEntry } from '../../model/Consento.types'
import { elementRelationSelectListCancel } from '../../styles/component/elementRelationSelectListCancel'

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

const SelectedLockees = observer(({ onAdd: handleAdd }: { onAdd: () => void }): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const handleRelationPress = (lockee: Lockee): void => {
    vault.revokeLockee(lockee.vaultLockee, lockee.relation)
      .catch(error => {
        console.log({ error })
      })
  }
  return <EmptyView prototype={elementLocksEmpty} onAdd={handleAdd}>
    {
      user.getLockeesSorted(vault)?.map(
        lockee => <RelationListEntry
          key={lockee.vaultLockee.$modelId}
          entry={lockee}
          prototype={lockee.vaultLockee.isConfirmed ? elementRelationSelectListDisplay.revoke.component : elementRelationSelectListCancel}
          onPress={handleRelationPress}
        />
      )
    }
  </EmptyView>
})

const SelectLockees = ({ onSelect: handleSelectConfirmation }: { onSelect: (relations: Relation[]) => any }): JSX.Element => {
  const selection: { [modelId: string]: IRelationEntry } = {}
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const availableRelations = user.availableRelations(vault)
  const handleEntrySelect = (relation: Relation, selected: boolean): void => {
    if (selected) {
      selection[relation.$modelId] = relation
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete selection[relation.$modelId]
    }
  }
  const handleConfirm = (): void => handleSelectConfirmation(Object.values(selection) as Relation[])

  return <BottomButtonView prototype={elementRelationSelectListAdd} onPress={handleConfirm}>
    {
      availableRelations.map(
        relation => <SelectEntry key={relation.$modelId} entry={relation} onSelect={handleEntrySelect} />
      )
    }
  </BottomButtonView>
}

const LockeeList = observer((): JSX.Element => {
  const [isSelectionActive, setSelectionActive] = useState<boolean>(false)
  const [isAddingLockees, setAddingLockees] = useState<boolean>(false)
  const { user } = useContext(ConsentoContext)
  const { vault } = useContext(VaultContext)
  const availableRelations = user.availableRelations(vault)

  if (isAddingLockees) {
    return <Text>Adding new entries...</Text>
  }

  if (!isSelectionActive) {
    const handleAdd = availableRelations.length > 0 ? () => setSelectionActive(true) : undefined
    return <SelectedLockees onAdd={handleAdd} />
  }
  const handleSelectConfirmation = (relations: Relation[]): void => {
    setAddingLockees(true)
    ;(async () => {
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
  return <SelectLockees onSelect={handleSelectConfirmation} />
})

export const Locks = withNavigation(observer(({ navigation }: ILocksProps): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  if (user.relations.size === 0) {
    return <EmptyView prototype={user.relations.size === 0 ? elementLocksNoLockee : elementLocksEmpty} onAdd={() => navigation.navigate('newRelation')} />
  }
  return <LockeeList />
}))
