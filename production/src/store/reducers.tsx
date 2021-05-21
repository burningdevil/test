import { combineReducers } from 'redux'
import configEditorReducer from './reducers/HomeScreenConfigEditorReducer'
import configMainReducer from './reducers/HomeScreenConfigMainReducer'

export const rootReducer = combineReducers({
  configEditor: configEditorReducer,
  configMain: configMainReducer
})
