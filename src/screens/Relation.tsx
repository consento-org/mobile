import React, { useContext, useEffect, useState, useRef } from 'react'
import { View, Alert, Text, BackHandler } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { Relation as RelationModel } from '../model/Relation'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/ConsentoContext'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'
import { BottomButtonView } from './components/BottomButtonView'

function confirmAlert (title: string, message: string, onOk: () => void): void {
  Alert.alert(
    title,
    message,
    [
      { text: 'Delete', onPress: onOk },
      { text: 'Cancel' }
    ]
  )
}

function confirmDelete (user: User, relation: RelationModel, navigation: TNavigation): void {
  confirmAlert('Delete', 'Are you sure you want to delete this Relation?', () => {
    user.relations.delete(relation)
    navigation.navigate('relations')
  })
}

const RelationName = ({ name, defaultName, onEdit }: { name: string, defaultName: string, onEdit(newName: string): any }): JSX.Element => {
  const ref = useRef<Text>()
  return <View style={{ height: elementRelationName.caption.place.bottom, display: 'flex' }}>
    <elementRelationName.rectangle.Render horz='stretch' />
    <elementRelationName.cutout.Render />
    <elementRelationName.label.Render />
    <elementRelationName.caption.Render />
    {name !== null
      ? <View>
        <elementRelationName.active.Render
          value={name} targetRef={ref} onLayout={() => ref.current.focus()} horz='stretch' onInstantEdit={(newName: string): void => { onEdit(newName) }} />
        <elementRelationName.iconCrossGrey.Render
          onPress={() => { onEdit(null) }}
          horz='end' />
      </View>
      : <elementRelationName.inactive.Render value={defaultName} onPress={() => onEdit('')} />}
  </View>
}

export const Relation = observer(withNavigation(({ relation, navigation }: { relation: RelationModel, navigation: TNavigation }): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  const [name, setName] = useState<string>(relation.name)
  const [hasChanged, setHasChanged] = useState<boolean>(false)
  const save = (): void => {
    relation.setName(name)
    setHasChanged(false)
  }
  const doBack = (next: () => any): boolean => {
    if (!hasChanged) {
      return next()
    }
    Alert.alert('Unsaved Changes', 'Leaving this page will discard any changes!', [
      {
        text: 'Save & Close',
        onPress: () => {
          save()
          next()
        }
      },
      {
        text: 'Discard',
        onPress: next
      },
      {
        text: 'Stay'
      }
    ])
    return true
  }
  useEffect(() => {
    if (!hasChanged) return
    const fnc = doBack.bind(null, () => {
      BackHandler.removeEventListener('hardwareBackPress', fnc)
      navigation.goBack()
    })
    BackHandler.addEventListener('hardwareBackPress', fnc)
    return () => BackHandler.removeEventListener('hardwareBackPress', fnc)
  }, [hasChanged, name])
  return <View style={{ ...styles.screen, display: 'flex' }}>
    <TopNavigation
      title={relation.displayName}
      back={() => doBack(() => navigation.navigate('relations'))}
      onDelete={() => confirmDelete(user, relation, navigation)}
    />
    <BottomButtonView prototype={elementRelationName} onPress={hasChanged ? save : null}>
      <RelationName
        name={name}
        defaultName={relation.defaultName}
        onEdit={value => {
          setName(value)
          setHasChanged(value !== relation.name)
        }}
      />
    </BottomButtonView>
  </View>
}))
