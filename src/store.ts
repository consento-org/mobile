import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reduce } from './reducers'
import { consentoMiddleware } from './middleware/consento'

export const store = createStore(reduce, applyMiddleware(thunk, consentoMiddleware))
export default store
