import React from 'react'
import { connect } from 'react-redux'
import { View, ViewStyle, ScrollView, } from 'react-native'
import { styles } from '../styles'
import { EmptyView } from './components/EmptyView'
import { TopNavigation } from './components/TopNavigation'
import { elementConsentosEmpty } from '../styles/component/elementConsentosEmpty'
import { IConsento, isConsentoAccess, isConsentoLockee } from '../model/Consento'
import { elementConsentosBase } from '../styles/component/elementConsentosBase'
import { elementConsentosAccessAccepted } from '../styles/component/elementConsentosAccessAccepted'
import { screen02Consentos } from '../styles/component/screen02Consentos'
import { ConsentoState } from './components/ConsentoState'
import Svg, { Circle, Rect, Defs, ClipPath, Image, G } from 'react-native-svg'
import { elementConsentosLockeeIdle } from '../styles/component/elementConsentosLockeeIdle'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({})

const cardMargin = screen02Consentos.b.place.top - screen02Consentos.a.place.bottom

const accessCardStyle = {
  position: 'relative',
  width: elementConsentosBase.width,
  height: elementConsentosBase.height,
  backgroundColor: elementConsentosBase.background.fill.color,
  margin: cardMargin,
  ...elementConsentosBase.background.borderStyle()
} as ViewStyle

function humanTime (time: number) {
  return String(time)
}

const viewBox = `0 0 ${elementConsentosLockeeIdle.width } ${elementConsentosLockeeIdle.height}`
const lockeeCardStyle = {
  position: 'relative',
  width: elementConsentosLockeeIdle.width,
  height: elementConsentosLockeeIdle.height,
  margin: cardMargin
} as ViewStyle

class Consento extends React.Component<{ consento: IConsento, key: string }> {
  render () {
    const consento = this.props.consento
    if (isConsentoAccess(consento)) { 
      return <View style={ accessCardStyle }>
        <elementConsentosBase.lastAccess.Render value={ humanTime(consento.time) } />
        <elementConsentosBase.relationName.Render value={ 'Some Person' } style={{ ...elementConsentosBase.relationName.place.size(), backgroundColor: '#00000000', position: 'relative' }} />
        <elementConsentosBase.actionRequested.Render />
        <elementConsentosBase.vaultIcon.Render />
        <elementConsentosBase.vaultName.Render value={ 'Vault Name' } />
        <ConsentoState state={ consento.state } onAccept={ () => {} } onDelete={ () => {} } style={ elementConsentosAccessAccepted.state.place.style() }/>
      </View>
    }
    if (isConsentoLockee(consento)) {
      const { card, outline } = elementConsentosLockeeIdle
      const thickness = card.border.thickness
      return <View style={ lockeeCardStyle }>
        <Svg width={ elementConsentosLockeeIdle.width } height={ elementConsentosLockeeIdle.height } viewBox={ viewBox }>
          <G fill={ card.border.fill.color }>
            <Rect
              x={ card.place.x }
              y={ card.place.y }
              width={ card.place.width }
              height={ card.place.height }
              rx={ card.border.radius }
              ry={ card.border.radius }
            />
            <Circle
              x={ outline.place.centerX }
              y={ outline.place.centerY }
              r={ outline.place.width / 2 }
            />
          </G>
          <G fill={ card.fill.color }>
            <Rect
              x={ card.place.x + thickness }
              y={ card.place.y + thickness }
              width={ card.place.width - thickness * 2 }
              height={ card.place.height - thickness * 2 }
              rx={ card.border.radius - thickness }
              ry={ card.border.radius - thickness }
            />
            <Circle
              x={ outline.place.centerX }
              y={ outline.place.centerY }
              r={ outline.place.width / 2 - thickness }
            />
          </G>
        </Svg>
        <elementConsentosLockeeIdle.vaultIcon.Render />
        <elementConsentosLockeeIdle.lastAccess.Render />
        <elementConsentosLockeeIdle.relationName.Render />
        <elementConsentosLockeeIdle.question.Render />
        <elementConsentosLockeeIdle.vaultName.Render />
        <ConsentoState state={ consento.state } onAccept={ () => {} } onDelete={ () => {} } style={ elementConsentosLockeeIdle.state.place.style() }/>
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
