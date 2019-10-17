import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reduce } from './reducers'
import { consentoMiddleware } from './middleware/consento'
import { backButtonMiddleware } from './middleware/navigation'

export const store = createStore(reduce, applyMiddleware(thunk, consentoMiddleware, backButtonMiddleware))
export default store
