import React, { useRef, useState } from 'react'
import { StyleSheet, View, VirtualizedList } from 'react-native'
import { screenshots, isScreenshotEnabled } from '../util/screenshots'
import { useUser } from '../model/Consento'
import { ImageAsset } from '../styles/design/ImageAsset'
import { SketchImage } from '../styles/util/react/SketchImage'
import { TopNavigation } from './components/TopNavigation'
import { createEmptyView } from './components/EmptyView'
import { VaultCard, VAULT_STYLE } from './components/VaultCard'
import { Vault } from '../model/Vault'
import { MobxGrid } from './components/MobxGrid'
import { useAutorun } from '../util/useAutorun'
import { comparer } from 'mobx'
import { elementVaultsEmpty } from '../styles/design/layer/elementVaultsEmpty'
import { observer } from 'mobx-react'
import { Color } from '../styles/design/Color'

const AddButton = ImageAsset.buttonAddHexagonal
const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  vaultGrid: { backgroundColor: Color.lightGrey },
  add: { position: 'absolute', right: 10, bottom: 10, zIndex: 1 }
})

function renderVault (vault: Vault): JSX.Element {
  return <VaultCard key={`vault-card-${vault.$modelId}`} vault={vault} />
}

const EmptyView = createEmptyView(elementVaultsEmpty)

export const VaultsScreen = observer((): JSX.Element => {
  const { vaults } = useUser()
  if (isScreenshotEnabled) {
    const { hasPending, hasLocked, isEmpty } = useAutorun(() => ({
      isEmpty: vaults.size === 0,
      hasLocked: vaults.items.filter((vault: Vault) => !vault.isOpen && !vault.isPending).length > 0,
      hasPending: vaults.items.filter((vault: Vault) => vault.isPending).length > 0
    }), comparer.shallow)
    if (isEmpty) {
      screenshots.vaultsEmpty.takeSync(500)
    } else {
      screenshots.vaultsFull.takeSync(500)
    }
    if (hasPending) {
      screenshots.vaultsVaultOnePending.takeSync(500)
    }
    if (hasLocked) {
      screenshots.vaultsVaultOneLocked.takeSync(500)
    }
  }
  const ref = useRef<VirtualizedList<any>>(null)
  const [handlePress] = useState(() => () => {
    const vault = new Vault({})
    vaults.add(vault)
    setTimeout(() => ref.current?.scrollToEnd(), 50 /* Quick delay to wait until the vault is added */)
    // navigate('vault', { vault: vault.$modelId })
  })
  return <View style={styles.container}>
    <TopNavigation title='Vaults' />
    <SketchImage src={AddButton} style={styles.add} onPress={handlePress} />
    <EmptyView isEmpty={useAutorun(() => vaults.size === 0)}>
      <MobxGrid ref={ref} data={vaults} itemStyle={VAULT_STYLE} renderItem={renderVault} style={styles.vaultGrid} />
    </EmptyView>
  </View>
})
