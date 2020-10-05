import React, { useContext, useState } from 'react'
import { Text, Alert, GestureResponderEvent, StyleSheet } from 'react-native'
import { observer } from 'mobx-react'
import { EmptyView } from './EmptyView'
import { VaultContext } from '../../model/VaultContext'
import { BottomButtonView } from './BottomButtonView'
import { RelationListEntry, IRelationListEntryProps, LIST_ENTRY_HEIGHT } from './RelationListEntry'
import { Relation } from '../../model/Relation'
import { ConsentoContext } from '../../model/Consento'
import { Lockee } from '../../model/User'
import { IRelationEntry } from '../../model/Consento.types'
import { navigate } from '../../util/navigate'
import { ScreenshotContext, useScreenshotEnabled } from '../../util/screenshots'
import { elementLocksNoLockee } from '../../styles/design/layer/elementLocksNoLockee'
import { elementLocksEmpty } from '../../styles/design/layer/elementLocksEmpty'
import { elementRelationSelectListAdd } from '../../styles/design/layer/elementRelationSelectListAdd'
import { elementRelationSelectListDisplay } from '../../styles/design/layer/elementRelationSelectListDisplay'
import { MobxList } from './MobxList'
import { compareNames } from '../../util/compareNames'
import { find } from '../../util/find'

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

const SelectedLockeeList = observer(({ onAdd }: { onAdd?: (event: GestureResponderEvent) => void }): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const { vault } = useContext(VaultContext)
  assertExists(vault, 'not in vault context')
  const lockees = user.getLockees(vault)
  if (useScreenshotEnabled()) {
    const screenshots = useContext(ScreenshotContext)
    const isEmpty = (lockees?.size ?? 0) > 0
    const hasOneConfirmed = find(lockees ?? [], (lockee): lockee is Lockee => lockee.vaultLockee.isConfirmed) !== undefined
    isEmpty
      ? hasOneConfirmed
        ? screenshots.vaultLocksConfirmed.takeSync(500)
        : screenshots.vaultLocksPending.takeSync(500)
      : screenshots.vaultLocksNoLock.takeSync(500)
  }
  return <EmptyView empty={elementLocksEmpty} onAdd={onAdd}>{
    lockees !== undefined && lockees.size > 0
      ? <BottomButtonView src={elementRelationSelectListDisplay} onPress={onAdd}>
        {
          ({ style }) =>
            <MobxList
              data={lockees}
              style={style}
              itemStyle={styles.item}
              sort={compareNames}
              renderItem={renderAddedLockee} />
        }
      </BottomButtonView>
      : undefined
  }</EmptyView>
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
  const screenshots = useContext(ScreenshotContext)
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
          sort={compareNames}
          renderItem={relation => <SelectEntry key={relation.$modelId} entry={relation} onSelect={handleEntrySelect} />}
        />
    }
  </BottomButtonView>
}

function assertExists <T> (input: T | null | undefined, error?: string): asserts input is T {
  if (input === null || input === undefined) {
    throw new Error(`Assertion error: ${error ?? '<x> is null | undefined'}`)
  }
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

export const Locks = observer((): JSX.Element => {
  const consento = useContext(ConsentoContext)
  assertExists(consento, 'not in user context')
  const { user } = consento
  const screenshots = useContext(ScreenshotContext)
  const handleAdd = (): void => navigate('newRelation')
  return <EmptyView empty={elementLocksNoLockee} onAdd={handleAdd} isEmpty={user.relations.size === 0} onEmpty={screenshots.vaultLocksNoRelation.handle(500)}>
    <LockeeList />
  </EmptyView>
})
