import React from 'react'
import { Provider } from 'react-redux'
import { Loading } from './src/screens/Loading'

export default class App extends React.Component<{}, { store, NotificationTestScreen }> {

  componentDidMount() {
    this.initProject().catch(err => {
      console.log(err)
    })
  }
  async initProject () {
    const [ store, NotificationTestScreen ] = await Promise.all([
      import('./src/store'),
      import('./src/screens/NotificationTest')
    ])
    this.setState({
      store: store.store,
      NotificationTestScreen: NotificationTestScreen.NotificationTestScreen
    })
  }
  render () {
    if (!this.state) return <Loading/>
    return <Provider store={this.state.store}>
      <this.state.NotificationTestScreen />
    </Provider>

  }
}
