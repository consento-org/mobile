import React from 'react'
import { observer } from 'mobx-react'
import { ConsentoBecomeLockee } from '../../model/Consentos'
import { elementConsentosLockeeIdle } from '../../styles/design/layer/elementConsentosLockeeIdle'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle, G, Rect } from 'react-native-svg'
import { Color } from '../../styles/design/Color'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { Avatar } from './Avatar'
import { useHumanSince } from '../../util/useHumanSince'
import { ConsentoState } from './ConsentoState'
import { screen02Consentos } from '../../styles/design/layer/screen02Consentos'

const cardMargin = screen02Consentos.layers.b.place.spaceY(screen02Consentos.layers.a.place)

const viewBox = `0 0 ${elementConsentosLockeeIdle.place.width} ${elementConsentosLockeeIdle.place.height}`

const { vaultIcon, lastAccess, relationName, relationID, avatar, question, vaultName, card, outline, state } = elementConsentosLockeeIdle.layers

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: elementConsentosLockeeIdle.place.width,
    height: elementConsentosLockeeIdle.place.height,
    margin: cardMargin
  },
  avatar: {
    position: 'absolute',
    left: avatar.place.left,
    top: avatar.place.top
  },
  vaultIcon: {
    position: 'absolute',
    left: vaultIcon.place.left,
    top: vaultIcon.place.top
  },
  lastAccess: {
    position: 'absolute',
    left: lastAccess.place.left,
    top: lastAccess.place.top,
    width: lastAccess.place.width
  },
  relationName: {
    position: 'absolute',
    left: relationName.place.left,
    top: relationName.place.top,
    width: relationName.place.width
  },
  relationID: {
    position: 'absolute',
    left: relationID.place.left,
    top: relationID.place.top,
    width: relationID.place.width
  },
  question: {
    position: 'absolute',
    left: question.place.left,
    top: question.place.top,
    width: relationID.place.width
  },
  vaultName: {
    position: 'absolute',
    left: vaultName.place.left,
    top: vaultName.place.top,
    width: vaultName.place.width
  },
  state: {
    position: 'absolute',
    left: state.place.left,
    top: state.place.top,
    width: state.place.width,
    height: state.place.height
  }
})
const thickness = card.svg?.strokeWidth ?? 0
const borderRadius = card.borderStyle().borderRadius ?? 0

export const ConsentoBecomeLockeeView = observer(({ consento }: { consento: ConsentoBecomeLockee }) => {
  return <View style={styles.container}>
    <Svg width={elementConsentosLockeeIdle.place.width} height={elementConsentosLockeeIdle.place.height} viewBox={viewBox}>
      <G fill={card.svg?.stroke ?? Color.white}>
        <Rect
          x={card.place.x}
          y={card.place.y}
          width={card.place.width}
          height={card.place.height}
          rx={borderRadius}
          ry={borderRadius}
        />
        <Circle
          x={outline.place.centerX}
          y={outline.place.centerY}
          r={outline.place.width / 2}
        />
      </G>
      <G fill={card.fill.color}>
        <Rect
          x={card.place.x + thickness}
          y={card.place.y + thickness}
          width={card.place.width - thickness * 2}
          height={card.place.height - thickness * 2}
          rx={borderRadius - thickness}
          ry={borderRadius - thickness}
        />
        <Circle
          x={outline.place.centerX}
          y={outline.place.centerY}
          r={outline.place.width / 2 - thickness}
        />
      </G>
    </Svg>
    <SketchElement style={styles.vaultIcon} src={vaultIcon} />
    <SketchElement style={styles.lastAccess} src={lastAccess} value={useHumanSince(consento.creationTime)} />
    <SketchElement style={styles.relationName} src={relationName} value={consento.relationName !== '' ? consento.relationName : undefined} />
    <SketchElement style={styles.relationID} src={relationID} value={consento.relationHumanId} />
    <View style={styles.avatar}><Avatar size={avatar.place.width} avatarId={consento.relationAvatarId} /></View>
    <SketchElement style={styles.question} src={question} />
    <SketchElement style={styles.vaultName} src={vaultName} value={consento.vaultName} />
    <ConsentoState style={styles.state} state={consento.state} onAccept={consento.handleAccept} onDelete={consento.handleHide} />
  </View>
})
