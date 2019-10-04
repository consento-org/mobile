import React from 'react'
import { Provider } from 'react-redux'
import { NotificationTest } from './src/view/NotificationTest'
import { store } from './src/store'

export default function App() {
  return <Provider store={store}>
    <NotificationTest />
  </Provider>
}
