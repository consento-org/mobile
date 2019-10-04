import { createStore, applyMiddleware } from 'redux'
import { reduce } from './reducers'
import thunk from 'redux-thunk'
import { consentoMiddleware } from './middleware'

export const store = createStore(reduce, applyMiddleware(thunk, consentoMiddleware))
