import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle, ScrollView, } from 'react-native'
import { styles } from '../styles'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { elementConsentosEmpty } from '../styles/component/elementConsentosEmpty'
import { IConsento, isConsentoAccess, TConsentoAccessState } from '../model/Consento'
import { elementConsentosBase } from '../styles/component/elementConsentosBase'
import { elementConsentosAccessAccepted } from '../styles/component/elementConsentosAccessAccepted'
import { ConsentoButton } from './components/ConsentoButton'
import { elementConsentosBaseIdle } from '../styles/component/elementConsentosBaseIdle'
import { elementConsentosBaseAccepted } from '../styles/component/elementConsentosBaseAccepted'
import { elementConsentosBaseExpired } from '../styles/component/elementConsentosBaseExpired'
import { elementConsentosBaseDenied } from '../styles/component/elementConsentosBaseDenied'
import { Polygon, Text, Link } from '../styles/Component'
import { screen02Consentos } from '../styles/component/screen02Consentos'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

const cardStyle = {
  position: 'relative',
  width: elementConsentosBase.width,
  height: elementConsentosBase.height,
  backgroundColor: elementConsentosBase.background.fill.color,
  margin: screen02Consentos.b.place.top - screen02Consentos.a.place.bottom,
  ...elementConsentosBase.background.borderStyle()
} as ViewStyle

function HorzLine ({ proto }: { proto: Polygon }) {
  return <View style={{
    width: proto.place.width,
    left: proto.place.left,
    top: proto.place.top,
    ...proto.border.style()
  }} />
}

function humanTime (time: number) {
  return String(time)
}

interface IStateStyle {
  state: Text
  line: Polygon
  deleteButton: Link<any, { label: string }>
}

function ConsentoState ({ state, style, onDelete, onAccept }: { state: TConsentoAccessState, onDelete: () => any, onAccept: () => any, style?: ViewStyle }) {
  const viewStyle = {
    position: 'absolute',
    ... style
  } as ViewStyle
  if (state === TConsentoAccessState.idle) {
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
    state === TConsentoAccessState.denied ? elementConsentosBaseDenied :
    state === TConsentoAccessState.expired ? elementConsentosBaseExpired :
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

class Consento extends React.Component<{ consento: IConsento, key: string }> {
  render () {
    const consento = this.props.consento
    if (isConsentoAccess(consento)) { 
      return <View style={ cardStyle }>
        <elementConsentosBase.lastAccess.Render value={ humanTime(consento.time) } />
        <elementConsentosBase.relationName.Render value={ 'Some Person' } style={{ ...elementConsentosBase.relationName.place.size(), backgroundColor: '#00000000', position: 'relative' }} />
        <elementConsentosBase.actionRequested.Render />
        <elementConsentosBase.vaultIcon.Render />
        <elementConsentosBase.vaultName.Render value={ 'Vault Name' } />
        <ConsentoState state={ consento.state } onAccept={ () => {} } onDelete={ () => {} } style={ elementConsentosAccessAccepted.state.place.style() }/>
      </View>
    }
    return <View></View>
  }
}

const listStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 10,
  marginBottom: 20
}

function Open ({ consentos }: { consentos: IConsento[] }) {
  return <View style={ styles.screen }>
    <TopNavigation title="Consentos" />
    {
      (consentos.length === 0)
        ? <EmptyView prototype={ elementConsentosEmpty } />
        : <ScrollView centerContent={ true }>
            <View style={ listStyle }>
            {
              consentos.map(consento => <Consento consento={ consento } key={ consento.key } />)
            }
            </View>
          </ScrollView>
    }
  </View>
}

export const ConsentosScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Open)
