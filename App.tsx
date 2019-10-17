import React from 'react'
import { Provider } from 'react-redux'
import { Loading } from './src/screens/Loading'
import { loadFonts } from './src/fonts'

export default class App extends React.Component<{}, { store, Screens }> {

  componentDidMount() {
    this.initProject().catch(err => {
      console.log(err)
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
    return <Provider store={this.state.store}>
      <this.state.Screens />
    </Provider>

  }
}
