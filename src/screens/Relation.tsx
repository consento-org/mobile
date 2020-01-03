import React, { useContext, RefObject } from 'react'
import { View, Alert, ScrollView, TextInput, Text } from 'react-native'
import { TopNavigation } from './components/TopNavigation'
import { styles } from '../styles'
import { Relation as RelationModel } from '../model/Relation'
import { observer } from 'mobx-react'
import { ConsentoContext } from '../model/ConsentoContext'
import { User } from '../model/User'
import { withNavigation, TNavigation } from './navigation'
import { elementRelationName } from '../styles/component/elementRelationName'

function confirmAlert (title: string, message: string, onOk: () => void): void {
  Alert.alert(
    title,
    message,
    [
      { text: 'Delete', onPress: onOk },
      { text: 'Abort' }
    ]
  )
}

function confirmDelete (user: User, relation: RelationModel, navigation: TNavigation): void {
  confirmAlert('Please Confirm', 'Are you sure you want to delete the Relation?', () => {
    user.relations.delete(relation)
    navigation.navigate('relations')
  })
}

class RelationName extends React.Component<{ relation: RelationModel }, { name: string | null }> {
  inputRef: RefObject<Text | TextInput>

  constructor (props) {
    super(props)
    const { relation } = props
    this.state = { name: relation.name }
    this.inputRef = React.createRef()
  }

  render (): JSX.Element {
    return <View style={{ height: elementRelationName.height, position: 'relative', display: 'flex', width: '100%' }}>
      <elementRelationName.rectangle.Render horz='stretch' />
      <elementRelationName.cutout.Render />
      <elementRelationName.label.Render />
      <elementRelationName.caption.Render />
      {this.state.name !== null
        ? <>
          <elementRelationName.active.Render
            value={this.state.name} targetRef={this.inputRef} onLayout={() => this.inputRef.current.focus()} horz='stretch' onEdit={(value: string) => {
              this.setState({ name: value })
              console.log(value)
            }} />
          <elementRelationName.iconCrossGrey.Render onPress={() => this.setState({ name: null })} horz='end' /></>
        : <elementRelationName.inactive.Render value={this.props.relation.defaultName} onPress={() => this.setState({ name: '' })} />}
    </View>
  }
}

export const Relation = observer(withNavigation(({ relation, navigation }: { relation: RelationModel, navigation: TNavigation }): JSX.Element => {
  const { user } = useContext(ConsentoContext)
  return <View style={styles.screen}>
    <TopNavigation title={relation.displayName} back='relations' onDelete={() => confirmDelete(user, relation, navigation)} />
    <ScrollView style={{ backgroundColor: elementRelationName.backgroundColor }}>
      <RelationName relation={relation} />
    </ScrollView>
  </View>
}))
