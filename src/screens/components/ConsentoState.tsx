import React from 'react'
import { View, ViewStyle } from 'react-native'
import { ConsentoButton } from './ConsentoButton'
import { TRequestState } from '../../model/RequestBase'
import { exists } from '@consento/api/util'
import { useHumanUntil } from '../../util/useHumanUntil'
import { elementConsentosBaseAccepted } from '../../styles/design/layer/elementConsentosBaseAccepted'
import { elementConsentosBaseCancelled } from '../../styles/design/layer/elementConsentosBaseCancelled'
import { elementConsentosBaseConfirming } from '../../styles/design/layer/elementConsentosBaseConfirming'
import { elementConsentosBaseDenied } from '../../styles/design/layer/elementConsentosBaseDenied'
import { elementConsentosBaseExpired } from '../../styles/design/layer/elementConsentosBaseExpired'
import { elementConsentosBaseIdle } from '../../styles/design/layer/elementConsentosBaseIdle'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { Polygon } from '../../styles/util/Polygon'
import { TextBox } from '../../styles/util/TextBox'
import { ILayer } from '../../styles/util/types'

type IStateStyle = ILayer<{ state: TextBox, line: Polygon, deleteButton?: typeof elementConsentosBaseAccepted.layers.deleteButton }>

function HorzLine ({ proto }: { proto: Polygon }): JSX.Element {
  return <View style={{
    width: proto.place.width,
    left: proto.place.left,
    top: proto.place.top,
    borderRadius: proto.borderRadius,
    borderColor: proto.fill.color,
    borderWidth: proto.border.thickness,
    borderStyle: proto.border.borderStyle,
    borderTopWidth: 0
  }} />
}

export interface IConsentoState {
  state: TRequestState
  onDelete: () => any
  onAccept: () => any
  style?: ViewStyle
  expiration?: number
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

function InactiveState ({ onDelete, state, style }: IConsentoState): JSX.Element {
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

export function ConsentoState (props: IConsentoState): JSX.Element {
  const { state } = props
  if (state === TRequestState.active) {
    return React.createElement(ActiveState, props)
  }
  return React.createElement(InactiveState, props)
}
