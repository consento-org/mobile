import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Switch, TextInput, Button, ScrollView, FlatList } from 'react-native'
import { styles } from '../styles'
import { changeUser, setServer, setMessage, submit } from '../actions'

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => ({
  changeUser: user => dispatch(changeUser(user)),
  setServer: server => dispatch(setServer(server)),
  setMessage: message => dispatch(setMessage(message)),
  submit: (target, message) => dispatch(submit(target, message))
})

const defaultServer = 'http://192.168.11.11:3000'

function NotificationTest ({ user, message, changeUser, server, setServer, setMessage, submit, active, messages }) {
  let _server = server || defaultServer
  return <View style={ styles.container }>
    <Text style={ styles.label }>Server</Text>
    <TextInput style={ styles.input } defaultValue={ defaultServer } value={ server } onChangeText={text => { _server=text }}/>
    <Button title={ server ? 'update' : 'connect' } onPress={() => {
      setServer(_server)
     }}></Button>
    <Text style={ styles.label }>User</Text>
    <View style={{ flexDirection: 'row' }}>
      <Switch value={ user === 'bob' } onValueChange={(value) => changeUser(value ? 'bob' : 'alice')}/>
      <Text style={ styles.label }>{ user }</Text>
    </View>
    <Text style={ styles.label }>Message</Text>
    <TextInput style={ styles.input } defaultValue="Message" value={ message } onChangeText={ setMessage }/>
    {
      !active ? null :
        <View style={{ flexDirection: 'row' }}>
          <Button title="To ALICE" onPress={ () => submit('alice', message) }></Button>
          <Text> </Text>
          <Button title="To BOB" onPress={ () => submit('bob', message) }></Button>
        </View>
    }
    <Text style={ styles.label }>Messages</Text>
    <ScrollView style={{
      width: '100%'
    }}>
      <FlatList
        data={messages}
        keyExtractor={
          (_, index) => `item[${index}]`
        }
        renderItem={
          ({item}) => <Text>{item}</Text>
        }
      />
    </ScrollView>
  </View>
}

export const NotificationTestScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationTest)
