import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { CONSTANTS, localizedStrings, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag, libraryCustomizedIconKeys, platformSpecificIconKeys } from '../../modules/components/HomeScreenConfigConstant'
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
    'objectAcl': [],
    'homeScreen': {
      mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN, 
      homeLibrary: { 
        icons: libraryIconKeys.filter(key => !libraryCustomizedIconKeys.includes(key)).map((key) => iconValidKey(key)), 
        sidebars: sidebarIconKeys.filter((key) => !_.includes(libraryCustomizedIconKeys, key)).map((key) => iconValidKey(key)),
        customizedItems: {},
        contentBundleIds: [],
        defaultGroupsName: localizedStrings.DEFAULT_GROUPS,
        toolbarMode: CONSTANTS.SHOW_TOOLBAR,
        toolbarEnabled: true,
      }, 
      homeDocument: {
        url: '', 
        icons: dossierIconKeys.concat(platformSpecificIconKeys).filter(key => !libraryCustomizedIconKeys.includes(key)).map((key) => iconValidKey(key)), 
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
  previewDeviceType: reviewType.WEB,
  isStateChangeByManual: false
}

const HomeScreenConfigEditorReducer = (state: HomeScreenConfigEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.UPDATE_CURRENT_CONFIG:
      return {
        ...state, 
        isStateChangeByManual: true,
        currentConfig : _.mergeWith({}, state.currentConfig, data, (target, source) => {
          if (_.isArray(target)) {
            return source
          }
        })
      }
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
    case Actions.LOAD_COLOR_PALETTE_LIST_SUCCESS:
      return {...state, colorPalettes: data}
    default:
      return state
  }
}

export default HomeScreenConfigEditorReducer
