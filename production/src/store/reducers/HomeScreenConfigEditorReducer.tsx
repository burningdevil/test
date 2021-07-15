import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { CONSTANTS, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag } from '../../modules/components/HomeScreenConfigConstant'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: HomeScreenConfigEditorState = {
  currentConfig: {
    'name': '',
    'description': '',
    'platforms': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web, platformType.desktop],
    'isDefault': false,
    'objectNames': [],
    'homeScreen': {
      mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN, 
      homeLibrary: { 
        icons: libraryIconKeys.map((key) => iconValidKey(key)), 
        sidebars: sidebarIconKeys.filter((key) => key !== iconTypes.defaultGroup.key).map((key) => iconValidKey(key)), 
        contentBundleIds: [],
        defaultGroupsName: 'Default Groups',
        toolbarMode: CONSTANTS.SHOW_TOOLBAR,
        toolbarEnabled: true,
      }, 
      homeDocument: {
        url: '', 
        icons: dossierIconKeys.map((key) => iconValidKey(key)), 
        toolbarMode: CONSTANTS.SHOW_TOOLBAR,
        toolbarEnabled: true,
      }
    },
    'general': {
      disableAdvancedSettings: false,
      disablePreferences: false,
      networkTimeout: CONSTANTS.DEFAULT_NETWORK_TIMEOUT, 
      cacheClearMode: CONSTANTS.CLEAR_AUTOMATIC, 
      clearCacheOnLogout: false, 
      maxLogSize: CONSTANTS.DEFAULT_MAX_LOG_SIZE, 
      logLevel: CONSTANTS.LOG_LEVEL_WARNING, 
      updateInterval: CONSTANTS.DEFAULT_UPDATE_INTERVAL
    }
  },
  isDuplicateConfig: false,
  isConfigNameError: false,
  configInfoList: [],
  colorPalettes: [],
  previewDeviceType: featureFlag.platformEnable ? reviewType.TABLET : reviewType.WEB,
}

const HomeScreenConfigEditorReducer = (state: HomeScreenConfigEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.UPDATE_CURRENT_CONFIG:
      return {...state, currentConfig: _.merge({}, state.currentConfig, data)}
    case Actions.SET_CURRENT_CONFIG:
      return {...state, currentConfig: data}
    case Actions.SET_CONFIG_INFO_LIST:
      return {...state, configInfoList: data}
    case Actions.SET_DUPLICATE_CONFIG:
      return {...state, isDuplicateConfig: data}
    case Actions.SET_CONFIG_NAME_ERROR:
      return {...state, isConfigNameError: data}
    case Actions.UPDATE_REVIEW_TYPE:
      return {...state, previewDeviceType: data}
    default:
      return state
  }
}

export default HomeScreenConfigEditorReducer
