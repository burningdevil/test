import { combineReducers } from 'redux'
import configEditorReducer from './reducers/HomeScreenConfigEditorReducer'

export const rootReducer = combineReducers({
  configEditor: configEditorReducer
})
