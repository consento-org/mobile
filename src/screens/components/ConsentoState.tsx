import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
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

export interface IConsentoBaseState {
  onDelete: () => any
  onAccept: () => any
  style?: ViewStyle
  expiration?: number
}

function createInactiveState (stateStyle: IStateStyle): (props: IConsentoInactiveState) => JSX.Element {
  const { line, state, deleteButton } = stateStyle.layers
  const styles = StyleSheet.create({
    container: {
      position: 'relative'
    },
    line: {
      width: line.place.width,
      left: line.place.left,
      top: line.place.top,
      ...line.borderStyle(ViewBorders.skipTop)
    },
    state: {
      position: 'absolute',
      left: state.place.left,
      top: state.place.top,
      width: state.place.width
    },
    delete: {
      position: 'absolute',
      left: deleteButton?.place.left,
      top: deleteButton?.place.top,
      width: deleteButton?.place.width
    }
  })
  return ({ onDelete, style }: IConsentoInactiveState): JSX.Element => {
    return <View style={StyleSheet.compose<ViewStyle>(styles.container, style)}>
      <View style={styles.line} />
      <SketchElement style={styles.state} src={state} />
      {
        exists(deleteButton)
          ? <ConsentoButton
            src={deleteButton}
            style={styles.delete}
            onPress={onDelete}
          />
          : null
      }
    </View>
  }
}

const inactive = {
  [TRequestState.cancelled]: createInactiveState(elementConsentosBaseCancelled),
  [TRequestState.denied]: createInactiveState(elementConsentosBaseDenied),
  [TRequestState.expired]: createInactiveState(elementConsentosBaseExpired),
  [TRequestState.confirmed]: createInactiveState(elementConsentosBaseAccepted),
  [TRequestState.accepted]: createInactiveState(elementConsentosBaseConfirming)
}

export interface IConsentoInactiveState extends IConsentoBaseState {
  state: keyof typeof inactive
}

export interface IConsentoActiveState extends IConsentoBaseState {
  state: TRequestState.active
}

export type IConsentoState = IConsentoInactiveState | IConsentoActiveState

function isActiveProps (props: IConsentoState): props is IConsentoActiveState {
  return props.state === TRequestState.active
}

export function ConsentoState (props: IConsentoState): JSX.Element {
  if (isActiveProps(props)) {
    return <ActiveState {...props} />
  }
  const InactiveState = inactive[props.state]
  return <InactiveState {...props} />
}
