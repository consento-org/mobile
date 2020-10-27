import { observer } from 'mobx-react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ConsentoUnlockVault } from '../../model/Consentos'
import { elementConsentosAccessIdle } from '../../styles/design/layer/elementConsentosAccessIdle'
import { screen02Consentos } from '../../styles/design/layer/screen02Consentos'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { useHumanSince } from '../../util/useHumanSince'
import { Avatar } from './Avatar'
import { ConsentoState } from './ConsentoState'

const { requestBase, state } = elementConsentosAccessIdle.layers
const { lastAccess, relationName, relationID, actionRequested, avatar, vaultIcon, vaultName } = requestBase.layers

const cardMargin = screen02Consentos.layers.b.place.spaceY(screen02Consentos.layers.a.place)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: requestBase.place.width,
    height: requestBase.place.height,
    backgroundColor: requestBase.layers.background.fill.color,
    margin: cardMargin,
    ...requestBase.layers.background.borderStyle()
  },
  lastAccess: {
    position: 'absolute',
    left: lastAccess.place.left,
    top: lastAccess.place.top
  },
  relationName: {
    position: 'absolute',
    left: relationName.place.left,
    top: relationName.place.top
  },
  relationID: {
    position: 'absolute',
    left: relationID.place.left,
    top: relationID.place.top
  },
  actionRequested: {
    position: 'absolute',
    left: actionRequested.place.left,
    top: actionRequested.place.top
  },
  vaultIcon: {
    position: 'absolute',
    left: vaultIcon.place.left,
    top: vaultIcon.place.top
  },
  vaultName: {
    position: 'absolute',
    left: vaultName.place.left,
    top: vaultName.place.top
  },
  avatar: {
    position: 'absolute',
    left: avatar.place.left,
    top: avatar.place.top
  },
  state: {
    position: 'absolute',
    left: state.place.left,
    top: state.place.top
  }
})

export const ConsentoUnlockVaultView = observer(({ consento }: { consento: ConsentoUnlockVault }) => {
  return <View style={styles.container}>
    <SketchElement src={lastAccess} style={styles.lastAccess} value={useHumanSince(consento.time)} />
    <SketchElement src={relationName} style={styles.relationName} value={consento.relationName !== '' ? consento.relationName ?? undefined : undefined} />
    <SketchElement src={relationID} style={styles.relationID} value={consento.relationHumanId} />
    <SketchElement src={actionRequested} style={styles.actionRequested} />
    <View style={styles.avatar}><Avatar size={avatar.place.width} avatarId={consento.relationAvatarId} /></View>
    <SketchElement src={vaultIcon} style={styles.vaultIcon} />
    <SketchElement src={vaultName} style={styles.vaultName} value={consento.vaultName} />
    <ConsentoState state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleDelete} style={styles.state} expiration={consento.expiration} />
  </View>
})
