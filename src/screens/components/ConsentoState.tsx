import React from 'react'
import { View, ViewStyle } from 'react-native'
import { ConsentoButton } from './ConsentoButton'
import { TRequestState } from '../../model/RequestBase'
import { useHumanUntil } from '../../util/useHumanUntil'
import { elementConsentosBaseAccepted } from '../../styles/design/layer/elementConsentosBaseAccepted'
import { elementConsentosBaseCancelled } from '../../styles/design/layer/elementConsentosBaseCancelled'
import { elementConsentosBaseConfirming } from '../../styles/design/layer/elementConsentosBaseConfirming'
import { elementConsentosBaseDenied } from '../../styles/design/layer/elementConsentosBaseDenied'
import { elementConsentosBaseExpired } from '../../styles/design/layer/elementConsentosBaseExpired'
import { elementConsentosBaseIdle } from '../../styles/design/layer/elementConsentosBaseIdle'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { Polygon } from '../../styles/util/Polygon'
import { ILayer, ITextBox, ViewBorders } from '../../styles/util/types'
import { exists } from '../../styles/util/lang'

type IStateStyle = ILayer<{ state: ITextBox, line: Polygon, deleteButton?: typeof elementConsentosBaseAccepted.layers.deleteButton }>

function HorzLine ({ proto }: { proto: Polygon }): JSX.Element {
  return <View style={{
    width: proto.place.width,
    left: proto.place.left,
    top: proto.place.top,
    ...proto.borderStyle(ViewBorders.skipTop)
  }} />
}

export const TimeDisplay = ({ expiration }: { expiration: number }): JSX.Element => {
  return <SketchElement src={elementConsentosBaseIdle.layers.timeLeft} value={useHumanUntil(expiration)} />
}

const { allowButton, deleteButton } = elementConsentosBaseIdle.layers

function ActiveState ({ expiration, onDelete, onAccept, style }: IConsentoState): JSX.Element {
  return <View style={style}>
    {exists(expiration) ? <TimeDisplay expiration={expiration} /> : null}
    <ConsentoButton
      style={{ ...allowButton.place, position: 'absolute' }}
      light
      title={allowButton.layers.label.text}
      onPress={onAccept} />
    <ConsentoButton
      style={{ ...deleteButton.place, position: 'absolute' }}
      thin
      title={deleteButton.layers.label.text}
      onPress={onDelete} />
  </View>
}

const inactiveStyleByState = {
  [TRequestState.cancelled]: elementConsentosBaseCancelled,
  [TRequestState.denied]: elementConsentosBaseDenied,
  [TRequestState.expired]: elementConsentosBaseExpired,
  [TRequestState.confirmed]: elementConsentosBaseAccepted,
  [TRequestState.accepted]: elementConsentosBaseConfirming
}

export interface IConsentoBaseState {
  onDelete: () => any
  onAccept: () => any
  style?: ViewStyle
  expiration?: number
}

export interface IConsentoInactiveState extends IConsentoBaseState {
  state: keyof typeof inactiveStyleByState
}

export interface IConsentoActiveState extends IConsentoBaseState {
  state: TRequestState.active
}

export type IConsentoState = IConsentoInactiveState | IConsentoActiveState

function InactiveState ({ onDelete, state, style }: IConsentoInactiveState): JSX.Element {
  const stateStyle: IStateStyle = inactiveStyleByState[state]
  const { line, state: sketchState, deleteButton } = stateStyle.layers
  return <View style={style}>
    <HorzLine proto={line} />
    <SketchElement src={sketchState} />
    {
      exists(deleteButton)
        ? <ConsentoButton
          style={{ left: deleteButton.place.left, position: 'absolute' }}
          thin
          title={deleteButton.layers.label.text}
          onPress={onDelete}
        />
        : null
    }
  </View>
}

function isActiveProps (props: IConsentoState): props is IConsentoActiveState {
  return props.state === TRequestState.active
}

export function ConsentoState (props: IConsentoState): JSX.Element {
  if (isActiveProps(props)) {
    return <ActiveState {...props} />
  }
  return <InactiveState {...props} />
}
