import React from 'react'
import { View, ViewStyle } from 'react-native'
import { ConsentoButton } from './ConsentoButton'
import { Text, Polygon, Link } from '../../styles/Component'
import { elementConsentosBaseIdle } from '../../styles/component/elementConsentosBaseIdle'
import { elementConsentosBaseDenied } from '../../styles/component/elementConsentosBaseDenied'
import { elementConsentosBaseExpired } from '../../styles/component/elementConsentosBaseExpired'
import { elementConsentosBaseAccepted } from '../../styles/component/elementConsentosBaseAccepted'
import { elementConsentosBaseConfirming } from '../../styles/component/elementConsentosBaseConfirming'
import { TRequestState } from '../../model/RequestBase'
import { exists } from '@consento/api/util'
import { useHumanUntil } from '../../util/useHumanUntil'
import { elementConsentosBaseCancelled } from '../../styles/component/elementConsentosBaseCancelled'

interface IStateStyle {
  state: Text
  line: Polygon
  deleteButton?: Link<any, { label: string }>
}

function HorzLine ({ proto }: { proto: Polygon }): JSX.Element {
  return <View style={{
    width: proto.place.width,
    left: proto.place.left,
    top: proto.place.top,
    ...proto.border.style(),
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
  return <elementConsentosBaseIdle.timeLeft.Render value={useHumanUntil(expiration)} />
}

export function ConsentoState ({ state, style, onDelete, onAccept, expiration }: IConsentoState): JSX.Element {
  const viewStyle: ViewStyle = {
    position: 'absolute',
    ...style
  }
  if (state === TRequestState.active) {
    return <View style={viewStyle}>
      {exists(expiration) ? <TimeDisplay expiration={expiration} /> : null}
      <ConsentoButton
        style={{ ...elementConsentosBaseIdle.allowButton.place.style(), position: 'absolute' }}
        light
        title={
          elementConsentosBaseIdle.allowButton.text.label
        }
        onPress={onAccept} />
      <ConsentoButton
        style={{ ...elementConsentosBaseIdle.deleteButton.place.style(), position: 'absolute' }}
        thin
        title={
          elementConsentosBaseIdle.deleteButton.text.label
        }
        onPress={onDelete} />
    </View>
  }
  const stateStyle: IStateStyle = (
    state === TRequestState.cancelled
      ? elementConsentosBaseCancelled
      : state === TRequestState.denied
        ? elementConsentosBaseDenied
        : state === TRequestState.expired
          ? elementConsentosBaseExpired
          : state === TRequestState.confirmed
            ? elementConsentosBaseAccepted
            : elementConsentosBaseConfirming
  )
  return <View style={viewStyle}>
    <HorzLine proto={stateStyle.line} />
    <stateStyle.state.Render />
    {
      exists(stateStyle.deleteButton)
        ? <ConsentoButton
          style={{ ...stateStyle.deleteButton.place.style(), position: 'absolute' }}
          thin
          title={
            stateStyle.deleteButton.text.label
          }
          onPress={onDelete}
        />
        : null
    }
  </View>
}
