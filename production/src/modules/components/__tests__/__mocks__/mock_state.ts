import { CONSTANTS, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag } from '../../HomeScreenConfigConstant';
export default {
    configEditor: {
        currentConfig: {
            'name': 'test application',
            'description': 'this is test application description',
            'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
            'default': true,
            'homeScreen': {
                mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN, 
                homeLibrary: { 
                icons: libraryIconKeys.map((key) => iconValidKey(key)), 
                sidebars: sidebarIconKeys.filter((key) => key !== iconTypes.defaultGroup.key).map((key) => iconValidKey(key)), 
                contentBundleIds: [],
                defaultGroupsName: '',
                toolbarMode: CONSTANTS.SHOW_TOOLBAR,
                toolbarDisabled: false,
                }, 
                homeDocument: {
                url: "", 
                icons: dossierIconKeys.map((key) => iconValidKey(key)), 
                toolbarMode: CONSTANTS.SHOW_TOOLBAR,
                toolbarDisabled: false,
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
        previewDeviceType: featureFlag.platformEnable ? reviewType.TABLET : reviewType.WEB,
    },
    configMain: {
        configList: [
            {
                "id": "b81bb33e872c430f955a78359700c330",
                "name": "uuu",
                "description": "",
                "lastUpdate": 1623737954570,
                "schemaVersion": 2,
                "icons": [
                  "TOCs",
                  "bookmark",
                  "reset",
                  "filters",
                  "comments",
                  "share",
                  "notifications",
                  "options",
                  "sidebars",
                  "sortAndFilter",
                  "multiSelect",
                  "search",
                  "notifications",
                  "options"
                ],
                "mode": 0,
                "platform": [
                  "Web"
                ],
                "contentBundleIds": [
                  
                ]
              },
              {
                "id": "6ffebaf2b758470b90f3b192bfb98932",
                "name": "eee",
                "description": "",
                "lastUpdate": 1623738822369,
                "schemaVersion": 2,
                "icons": [
                  "TOCs",
                  "bookmark",
                  "reset",
                  "filters",
                  "comments",
                  "share",
                  "notifications",
                  "options",
                  "sidebars",
                  "sortAndFilter",
                  "multiSelect",
                  "search",
                  "notifications",
                  "options"
                ],
                "mode": 0,
                "platform": [
                  "Web"
                ],
                "contentBundleIds": [
                  
                ]
              },
              {
                "id": "9a06fbc789c54d618207defec99114a4",
                "name": "iii",
                "description": "",
                "lastUpdate": 1623738840410,
                "schemaVersion": 2,
                "icons": [
                  "TOCs",
                  "bookmark",
                  "reset",
                  "filters",
                  "comments",
                  "share",
                  "notifications",
                  "options",
                  "sidebars",
                  "sortAndFilter",
                  "multiSelect",
                  "search",
                  "notifications",
                  "options"
                ],
                "mode": 0,
                "platform": [
                  "Web"
                ],
                "contentBundleIds": [
                  
                ]
              }
        ],
        contentBundleList: []
    },
    bundleContent: {
        dossiers: [],
        documents: [],
        loadingDossiers: false,
        loadingDossiersFinish: false,
    }
}