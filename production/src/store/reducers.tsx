import { combineReducers } from 'redux'
import configEditorReducer from './reducers/HomeScreenConfigEditorReducer'
import configMainReducer from './reducers/HomeScreenConfigMainReducer'
import bundleContentFetchReducer from './reducers/HomeScreenContentFetchReducer'

export const rootReducer = combineReducers({
  configEditor: configEditorReducer,
  configMain: configMainReducer,
  bundleContentFetch: bundleContentFetchReducer
})
