import { CONSTANTS, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag } from '../../HomeScreenConfigConstant';
export default {
    configEditor: {
        currentConfig: {
            'name': 'test application',
            'description': 'this is test application description',
            'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
            'default': false,
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
        configList: [],
        contentBundleList: []
    },
    bundleContent: {
        dossiers: [],
        documents: [],
        loadingDossiers: false,
        loadingDossiersFinish: false,
    }
}