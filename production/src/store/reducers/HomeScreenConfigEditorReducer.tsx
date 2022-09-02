import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { CONSTANTS, localizedStrings, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag, libraryCustomizedIconKeys, platformSpecificIconKeys, customEmailStringDict } from '../../modules/components/HomeScreenConfigConstant'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'
export const DEFAULT_EMAIL_SETTING = {
  'enabled': false,
  'hostPortal': '',
  'showBrandingImage': true,
  'showBrowserButton': true,
  'showMobileButton': true,
  'showReminder': true,
  'showSentBy': true,
  'sentByText': 'MicroStrategy Inc.',
  'showSocialMedia': true,
  // added by the version v2
  'content': {
    'SHARE_DOSSIER': {
      'subject': customEmailStringDict.formGroup.subjectAndBody.subsection1.placeholder1,
      'body': customEmailStringDict.formGroup.subjectAndBody.subsection1.placeholder2
    },
    'SHARE_BOOKMARK': {
      'subject': customEmailStringDict.formGroup.subjectAndBody.subsection2.placeholder1,
      'body': customEmailStringDict.formGroup.subjectAndBody.subsection2.placeholder2
    },
    'MEMBER_ADDED': {
      'subject': customEmailStringDict.formGroup.subjectAndBody.subsection3.placeholder1,
      'body': customEmailStringDict.formGroup.subjectAndBody.subsection3.placeholder2
    },
    'USER_MENTION': {
      'subject': customEmailStringDict.formGroup.subjectAndBody.subsection4.placeholder1,
      'body': customEmailStringDict.formGroup.subjectAndBody.subsection4.placeholder2
    },
  },
  'showButtonDescription': true,
  'sender': {
    'displayName': customEmailStringDict.formGroup.emailSender.defaultName,
    'address': customEmailStringDict.formGroup.emailSender.placeholder
},
'brandingImage': {
    'url': ''
},
'button': {
      "browserButtonStyle": {
        "backgroundColor": customEmailStringDict.formGroup.actionButton.button1_bg_color,
        "fontColor": customEmailStringDict.formGroup.actionButton.button1_fontColor,
        "text": customEmailStringDict.formGroup.actionButton.button1_default
      },
      "mobileButtonStyle": {
          "backgroundColor": customEmailStringDict.formGroup.actionButton.button2_bg_color,
          "fontColor": customEmailStringDict.formGroup.actionButton.button2_fontColor,
          "text": customEmailStringDict.formGroup.actionButton.button2_default
      },
      "mobileButtonScheme": "dossier",
      "mobileButtonLinkType": "DEFAULT",
      "description": customEmailStringDict.formGroup.actionButton.descriptionDefaultStr
},
"reminder": {
  "text": customEmailStringDict.formGroup.notificationReminder.defaultReminder,
  "linkText": customEmailStringDict.formGroup.notificationReminder.defaultReminderLinkText
},
"socialMedia": {
  "showFacebook": true,
  "facebookLink": customEmailStringDict.formGroup.socialMedia.fb_default,
  "showTwitter": true,
  "twitterLink": customEmailStringDict.formGroup.socialMedia.twitter_default,
  "showLinkedIn": true,
  "linkedInLink": customEmailStringDict.formGroup.socialMedia.linked_default,
  "showYouTube": true,
  "youTubeLink": customEmailStringDict.formGroup.socialMedia.yt_default
}

}
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
    },
    'emailSettings': DEFAULT_EMAIL_SETTING,
    applicationPalettes: [],
    useConfigPalettes: false
  },
  isDuplicateConfig: false,
  isConfigNameError: false,
  isCustomEmailError: false,
  shouldSendPreviewEmail: false,
  configInfoList: [],
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
    case Actions.SET_CUSTOM_EMAIL_ERROR:
      return {...state, isCustomEmailError: data}
    case Actions.SET_SHOULD_SEND_PREVIEW_EMAIL:
      return {...state, shouldSendPreviewEmail: data}
    case Actions.UPDATE_REVIEW_TYPE:
      return {...state, previewDeviceType: data}
    case Actions.UPDATE_HOMESCREEN_THEME:
      return {
        ...state,
        currentConfig: {
          ...state.currentConfig,
          homeScreen: {
            ...state.currentConfig.homeScreen,
            theme: data
          }
        }
      }
    case Actions.DELETE_HOMESCREEN_THEME:
      const currConfig = state.currentConfig
      const homeScreen = state.currentConfig.homeScreen
      const updatedHomeScreen: any = {}
      for (const [key, value] of Object.entries(homeScreen)) {
        if (key !== 'theme') {
            updatedHomeScreen[key] = value;
        }
      }
      const updatedConfig = { ...currConfig }
      updatedConfig.homeScreen = updatedHomeScreen
      return {
        ...state,
        currentConfig: updatedConfig
      }
    default:
      return state
  }
}

export default HomeScreenConfigEditorReducer
