import React from 'react'
import { View, ViewStyle } from 'react-native'
import { ConsentoButton } from './ConsentoButton'
import { Text, Polygon, Link } from '../../styles/Component'
import { elementConsentosBaseIdle } from '../../styles/component/elementConsentosBaseIdle'
import { elementConsentosBaseDenied } from '../../styles/component/elementConsentosBaseDenied'
import { elementConsentosBaseExpired } from '../../styles/component/elementConsentosBaseExpired'
import { elementConsentosBaseAccepted } from '../../styles/component/elementConsentosBaseAccepted'
import { TRequestState } from '../../model/RequestBase'

interface IStateStyle {
  state: Text
  line: Polygon
  deleteButton: Link<any, { label: string }>
}

function HorzLine ({ proto }: { proto: Polygon }) {
  return <View style={{
    width: proto.place.width,
    left: proto.place.left,
    top: proto.place.top,
    ...proto.border.style(),
    borderTopWidth: 0
  }} />
}

export function ConsentoState ({ state, style, onDelete, onAccept }: { state: TRequestState, onDelete: () => any, onAccept: () => any, style?: ViewStyle }) {
  const viewStyle = {
    position: 'absolute',
    ... style
  } as ViewStyle
  if (state === TRequestState.active) {
    return <View style={ viewStyle }>
      <elementConsentosBaseIdle.timeLeft.Render value={ '1235' }/>
      <ConsentoButton style={{ ...elementConsentosBaseIdle.allowButton.place.style(), position: 'absolute' }} light={ true } title={
        elementConsentosBaseIdle.allowButton.text.label
      } onPress={ onAccept } />
      <ConsentoButton style={{ ...elementConsentosBaseIdle.deleteButton.place.style(), position: 'absolute' }} thin={ true } title={
        elementConsentosBaseIdle.deleteButton.text.label
      } onPress={ onDelete } />
    </View>
  }
  const stateStyle: IStateStyle = (
    state === TRequestState.denied ? elementConsentosBaseDenied :
    state === TRequestState.expired ? elementConsentosBaseExpired :
    elementConsentosBaseAccepted
  )
  return <View style={ viewStyle }>
    <HorzLine proto={ stateStyle.line } />
    <stateStyle.state.Render />
    <ConsentoButton style={{ ...stateStyle.deleteButton.place.style(), position: 'absolute' }} thin={ true } title={
      stateStyle.deleteButton.text.label
    } onPress={ onDelete } /> 
  </View>
}
