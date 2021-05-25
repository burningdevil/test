import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { childrenIcons, CONSTANTS, dossierIconsDossierHome, iconTypes, libraryIcons, reviewType, iconValidKey, platformType } from '../../modules/components/HomeScreenConfigConstant'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: HomeScreenConfigEditorState = {
  currentConfig: {
    'name': '',
    'description': '',
    'platform': [platformType.mobile, platformType.web, platformType.desktop],
    'homeScreen': {
      mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN, 
      homeLibrary: { 
        icons: libraryIcons.map((icon) => iconValidKey(icon.key)), 
        sidebars: childrenIcons.map((icon) => iconValidKey(icon.key)).filter((key) => key !== iconTypes.defaultGroup.key), 
        contentBundleIds: [],
        toolbarMode: CONSTANTS.SHOW_TOOLBAR, 
      }, 
      homeDocument: {
        url: "", 
        icons: dossierIconsDossierHome.map((icon) => iconValidKey(icon.key)), 
        toolbarMode: CONSTANTS.SHOW_TOOLBAR,
      }
    },
    'general': {
      networkTimeout: CONSTANTS.DEFAULT_NETWORK_TIMEOUT, 
      cacheClearMode: CONSTANTS.CLEAR_AUTOMATIC, 
      clearCacheOnLogout: false, 
      maxLogSize: CONSTANTS.DEFAULT_MAX_LOG_SIZE, 
      logLevel: CONSTANTS.LOG_LEVEL_WARNING, 
      updateInterval: CONSTANTS.DEFAULT_UPDATE_INTERVAL
    }
  },
  previewDeviceType: reviewType.TABLET,
}

const HomeScreenConfigEditorReducer = (state: HomeScreenConfigEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.UPDATE_CURRENT_CONFIG:
      return {...state, currentConfig: _.merge({}, state.currentConfig, data)}
    case Actions.SET_CURRENT_CONFIG:
      return {...state, currentConfig: data}
    case Actions.UPDATE_REVIEW_TYPE:
      return {...state, previewDeviceType: data}
    default:
      return state
  }
}

export default HomeScreenConfigEditorReducer
