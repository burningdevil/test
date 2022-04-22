import { selectTheme } from '../ApplicationDesignEditorSelector'
import { CONSTANTS, localizedStrings, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag, libraryCustomizedIconKeys, platformSpecificIconKeys } from '../../../modules/components/HomeScreenConfigConstant'

import { RootState } from '../../../types/redux-state/HomeScreenConfigState'

const storeState : RootState = {
  configEditor: {
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
      applicationPalettes: [],
      useConfigPalettes: false
    },
    isDuplicateConfig: false,
    isConfigNameError: false,
    configInfoList: [],
    previewDeviceType: reviewType.WEB,
    isStateChangeByManual: false
  },
  configMain: {
    configList: [],
    configLoading: false,
    contentBundleList: []
  },
  bundleContent: {
    dossiers: [],
    documents: [],
    loadingDossiers: false,
    loadingDossiersFinish: false,
    loadingDocuments: false,
    loadingDocumentsFinish: false
  },
  content: {
    data: [],
    loadingContentBundle: false,
    loadingContentBundleFinish: false
  },
  appDesignEditor: {}
}

describe('Application Design Editor Selectors selectTheme', () => {

  it('theme does not exist in config - selectTheme', () => {
    const theme = selectTheme(storeState)
    expect(theme).toEqual(undefined)
  })

  it('theme exists in config - selectTheme', () => {
    const expectedTheme = {
        schemaVersion: 1,
        logos: {
            web: {
                type: 'URL',
                value: 'https://www.imageRepo/web.png'
            },
            favicon: {
                type: 'URL',
                value: 'https://www.imageRepo/favicon.svg'
            },
            mobile: {
              type: 'URL',
              value: 'https://www.imageRepo/mobile.svg'
            }
        }
      }
      
    storeState.appDesignEditor.theme = expectedTheme
    const theme = selectTheme(storeState)
    expect(theme).toEqual(expectedTheme)
  })
})
