import React, { useContext, useState } from 'react'
import { Text, Alert, GestureResponderEvent, StyleSheet } from 'react-native'
import { observer } from 'mobx-react'
import { createEmptyView } from './EmptyView'
import { VaultContext } from '../../model/VaultContext'
import { BottomButtonView } from './BottomButtonView'
import { RelationListEntry, IRelationListEntryProps, LIST_ENTRY_HEIGHT } from './RelationListEntry'
import { Relation } from '../../model/Relation'
import { ConsentoContext } from '../../model/Consento'
import { Lockee } from '../../model/User'
import { IRelationEntry } from '../../model/Consento.types'
import { navigate } from '../../util/navigate'
import { isScreenshotEnabled, screenshots } from '../../util/screenshots'
import { elementLocksNoLockee } from '../../styles/design/layer/elementLocksNoLockee'
import { elementLocksEmpty } from '../../styles/design/layer/elementLocksEmpty'
import { elementRelationSelectListAdd } from '../../styles/design/layer/elementRelationSelectListAdd'
import { elementRelationSelectListDisplay } from '../../styles/design/layer/elementRelationSelectListDisplay'
import { MobxList } from './MobxList'
import { compareNames } from '../../util/compareNames'
import { find } from '../../util/find'
import { assertExists } from '../../util/assertExists'

interface ISelectEntryProps extends Omit<IRelationListEntryProps<Relation>, 'type' | 'onPress'> {
  onSelect: (entry: Relation, selected: boolean) => any
}

const renderAddedLockee = (lockee: Lockee): JSX.Element => {
  const { vault } = useContext(VaultContext)
  assertExists(vault, 'not in vault context')
  const handleRelationPress = (entry: IRelationEntry): void => {
    const lockee = entry as Lockee
    vault.revokeLockee(lockee.vaultLockee, lockee.relation)
      .catch(error => console.log({ error }))
  }
  return <RelationListEntry
    key={lockee.vaultLockee.$modelId}
    entry={lockee}
    type={lockee.vaultLockee.isConfirmed ? 'revoke' : 'cancel'}
    onPress={handleRelationPress}
  />
}

const styles = StyleSheet.create({
  item: { height: LIST_ENTRY_HEIGHT }
})

const LocksEmptyView = createEmptyView(elementLocksEmpty)

const SelectedLockeeList = observer(({ onAdd }: { onAdd?: (event: GestureResponderEvent) => void }): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const { vault } = useContext(VaultContext)
  assertExists(vault, 'not in vault context')
  const lockees = user.getLockees(vault)
  if (isScreenshotEnabled) {
    const isEmpty = (lockees?.size ?? 0) > 0
    const hasOneConfirmed = find(lockees ?? [], (lockee): lockee is Lockee => lockee.vaultLockee.isConfirmed) !== undefined
    isEmpty
      ? hasOneConfirmed
        ? screenshots.vaultLocksConfirmed.takeSync(500)
        : screenshots.vaultLocksPending.takeSync(500)
      : screenshots.vaultLocksNoLock.takeSync(500)
  }
  return <LocksEmptyView onAdd={onAdd}>{
    lockees !== undefined && lockees.size > 0
      ? <BottomButtonView src={elementRelationSelectListDisplay} onPress={onAdd}>
        {
          /* eslint-disable react/jsx-indent-props */
          ({ style }) =>
            <MobxList
              data={lockees}
              style={style}
              itemStyle={styles.item}
              sort={{ run: compareNames, key: 'compareNames' }}
              renderItem={renderAddedLockee}
            />
        }
      </BottomButtonView>
      : undefined
  }</LocksEmptyView>
})

const SelectEntry = ({ entry, onSelect }: ISelectEntryProps): JSX.Element => {
  const [selected, setSelected] = useState<'selected' | 'unselected'>('unselected')
  const handlePress = (): void => {
    const isSelected = selected === 'selected'
    setSelected(isSelected ? 'unselected' : 'selected')
    onSelect(entry, !isSelected)
  }
  return <RelationListEntry entry={entry} type={selected} onPress={handlePress} />
}

const SelectLockees = ({ onSelect: handleSelectConfirmation }: { onSelect: (relations: Relation[]) => any }): JSX.Element => {
  const selection: { [modelId: string]: IRelationEntry } = {}
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const { vault } = useContext(VaultContext)
  assertExists(vault, 'not in vault context')
  const availableRelations = user.availableRelations(vault)
  screenshots.vaultLocksNoSelection.takeSync(200)
  const handleEntrySelect = (relation: Relation, selected: boolean): void => {
    if (selected) {
      selection[relation.$modelId] = relation
      screenshots.vaultLocksSelection.takeSync(200)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete selection[relation.$modelId]
    }
  }
  const handleConfirm = (): void => handleSelectConfirmation(Object.values(selection) as Relation[])
  return <BottomButtonView src={elementRelationSelectListAdd} onPress={handleConfirm}>
    {
      ({ style }) =>
        <MobxList
          data={availableRelations}
          style={style}
          itemStyle={styles.item}
          sort={{ run: compareNames, key: 'compareNames' }}
          renderItem={relation => <SelectEntry key={relation.$modelId} entry={relation} onSelect={handleEntrySelect} />}
        />
    }
  </BottomButtonView>
}

const LockeeList = observer((): JSX.Element => {
  const [state, setState] = useState<'show' | 'select' | 'adding'>('show')
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const { vault } = useContext(VaultContext)
  assertExists(vault, 'not in vault context')
  const availableRelations = user.availableRelations(vault)

  if (state === 'adding') {
    // TODO: add to design!
    return <Text>Adding new entries...</Text>
  }

  if (state === 'show') {
    const handleAdd = availableRelations.size > 0 ? () => setState('select') : undefined
    return <SelectedLockeeList onAdd={handleAdd} />
  }
  const handleSelectConfirmation = (relations: Relation[]): void => {
    setState('adding')
    Promise.all(
      relations.map(async relation => await vault.addLockee(relation))
    ).then(
      () => { console.log('done') },
      error => {
        Alert.alert(
          'Failed',
          `Woops, for some reason the lockee could not be added.\n [${String(error.code)}]`
        )
        console.log(error)
      }
    ).finally(() => {
      console.log('finally')
      setState('show')
    })
  }
  return <SelectLockees onSelect={handleSelectConfirmation} />
})

const NoLocksEmptyView = createEmptyView(elementLocksNoLockee)

export const Locks = observer((): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const handleAdd = (): void => navigate('newRelation')
  return <NoLocksEmptyView onAdd={handleAdd} isEmpty={user.relations.size === 0} onEmpty={screenshots.vaultLocksNoRelation.handle(500)}>
    <LockeeList />
  </NoLocksEmptyView>
})
