import { combineReducers } from 'redux'
import configEditorReducer from './reducers/HomeScreenConfigEditorReducer'
import configMainReducer from './reducers/HomeScreenConfigMainReducer'
import bundleContentReducer from './reducers/HomeScreenBundleContentReducer'
import contentReducer from './reducers/HomeScreenContentBundleReducer'
import colorPaletteReducer from './reducers/HomeScreenColorPaletteReducer';

export const rootReducer = combineReducers({
  configEditor: configEditorReducer,
  configMain: configMainReducer,
  bundleContent: bundleContentReducer,
  content: contentReducer,
  colorPalette: colorPaletteReducer
})
