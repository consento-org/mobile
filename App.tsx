import React from 'react'
import { Text } from 'react-native'
import { Provider } from 'react-redux'
import { Loading } from './src/screens/Loading'
import { loadFonts } from './src/fonts'
import 'react-native-gesture-handler' // Imported to fix gesture error in tab navigation

export default class App extends React.Component<{}, { store, Screens, error: Error }> {

  componentDidMount() {
    this.initProject().catch(error => {
      console.log(error)
      this.setState({ error })
    })
  }
  async initProject () {
    const [ { store }, { Screens }, _ ] = await Promise.all([
      import('./src/store'),
      import('./src/screens'),
      loadFonts()
    ])
    this.setState({ store, Screens })
  }
  render () {
    if (!this.state) return <Loading/>
    if (this.state.error !== undefined) {
      return <Text>{ `Error while initing:\n${this.state.error}` }</Text>
    }
    return <Provider store={this.state.store}>
      <this.state.Screens />
    </Provider>

  }
}
