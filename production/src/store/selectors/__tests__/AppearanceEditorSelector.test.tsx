import { selectAppearanceEditorTheme } from '../AppearanceEditorSelector'
import { CONSTANTS, localizedStrings, reviewType, platformType } from '../../../modules/components/HomeScreenConfigConstant'
import { cloneDeep } from 'lodash'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'

const storeState : RootState = {
  configEditor: {
    currentConfig: {
      'name': '',
      'description': '',
      'platforms': [platformType.mobile, platformType.web, platformType.desktop],
      'isDefault': false,
      'objectNames': [],
      'objectAcl': [],
      'homeScreen': {
        mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN,
        homeLibrary: {
          icons: [],
          sidebars: [],
          customizedItems: {},
          contentBundleIds: [],
          defaultGroupsName: localizedStrings.DEFAULT_GROUPS,
          toolbarMode: CONSTANTS.SHOW_TOOLBAR,
          toolbarEnabled: true,
        },
        homeDocument: {
          url: '',
          icons: [],
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
  appearanceEditor: {
    appearancePreviewDeviceType: reviewType.WEB
  }
}

const theme1 = {
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

const storeStateWithTheme = cloneDeep(storeState)
storeStateWithTheme.appearanceEditor.theme = theme1


describe('Application Appearance Editor Selectors selectTheme', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('theme does not exist in config - selectTheme', () => {
    const theme = selectAppearanceEditorTheme(storeState)
    expect(theme).toEqual(undefined)
  })

  it('theme exists in config - selectTheme', () => {
    const theme = selectAppearanceEditorTheme(storeStateWithTheme)
    expect(theme).toEqual(theme1)
  })
})
