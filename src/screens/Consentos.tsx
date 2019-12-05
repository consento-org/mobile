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
import { elementConsentosAccessExpired } from '../styles/component/elementConsentosAccessExpired'
import { elementConsentosAccessDenied } from '../styles/component/elementConsentosAccessDenied'
import { elementConsentosAccessIdle } from '../styles/component/elementConsentosAccessIdle'
import { Polygon } from '../styles/Component'
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
        {
          consento.state !== TConsentoAccessState.idle
            ? <View style={{ position: 'absolute' }}>
                <HorzLine proto={ elementConsentosAccessAccepted.line } />
                {
                  consento.state === TConsentoAccessState.denied
                    ? <elementConsentosAccessDenied.state.Render />
                    : (consento.state === TConsentoAccessState.expired
                      ? <elementConsentosAccessExpired.state.Render />
                      : <elementConsentosAccessAccepted.state.Render />
                    )
                }
                <ConsentoButton style={{ ...elementConsentosAccessAccepted.deleteButton.place.style(), position: 'absolute' }} thin={ true } title={
                  elementConsentosAccessAccepted.deleteButton.text.label
                } onPress={ () => {} } /> 
              </View>
            : <View style={{ position: 'absolute' }}>
                <elementConsentosAccessIdle.timeLeft.Render value={ '1235' }/>
                <ConsentoButton style={{ ...elementConsentosAccessIdle.allowButton.place.style(), position: 'absolute' }} light={ true } title={
                  elementConsentosAccessIdle.allowButton.text.label
                } onPress={ () => {} } />
                <ConsentoButton style={{ ...elementConsentosAccessIdle.deleteButton.place.style(), position: 'absolute' }} thin={ true } title={
                  elementConsentosAccessIdle.deleteButton.text.label
                } onPress={ () => {} } />
              </View>
        }
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
