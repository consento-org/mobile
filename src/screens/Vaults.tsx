import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, View, VirtualizedList } from 'react-native'
import { ConsentoContext } from '../model/Consento'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { ImageAsset } from '../styles/design/ImageAsset'
import { SketchImage } from '../styles/util/react/SketchImage'
import { TopNavigation } from './components/TopNavigation'
import { EmptyView } from './components/EmptyView'
import { elementLocksEmpty } from '../styles/design/layer/elementLocksEmpty'
import { VaultCard, VAULT_STYLE } from './components/VaultCard'
import { Vault } from '../model/Vault'
import { MobxGrid } from './components/MobxGrid'
import { useAutorun } from '../util/useAutorun'
import { comparer } from 'mobx'

const AddButton = ImageAsset.buttonAddHexagonal
const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  add: { position: 'absolute', right: 10, bottom: 10, zIndex: 1 }
})

function renderVault (vault: Vault): JSX.Element {
  return <VaultCard key={`vault-card-${vault.$modelId}`} vault={vault} />
}

export const VaultsScreen = (): JSX.Element => {
  const { user: { vaults } } = useContext(ConsentoContext)
  if (useScreenshotEnabled()) {
    const screenshots = useContext(ScreenshotContext)
    const { hasPending, hasLocked, isEmpty } = useAutorun(() => ({
      isEmpty: vaults.size === 0,
      hasLocked: vaults.items.includes((vault: Vault) => !vault.isOpen),
      hasPending: vaults.items.includes((vault: Vault) => vault.isPending)
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
    <EmptyView empty={elementLocksEmpty}>
      <MobxGrid ref={ref} data={vaults} itemStyle={VAULT_STYLE} renderItem={renderVault} />
    </EmptyView>
  </View>
}
