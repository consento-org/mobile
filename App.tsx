import React from 'react'
import { Provider } from 'react-redux'
import { NotificationTestScreen } from './src/screens/NotificationTest'
import { store } from './src/store'
 
export default function App() {
  return <Provider store={store}>
    <NotificationTestScreen />
  </Provider>
}
