import { RootState } from '../../../../types/redux-state/HomeScreenConfigState';
import { CONSTANTS, iconTypes, reviewType, iconValidKey, platformType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, featureFlag } from '../../HomeScreenConfigConstant';
export default {
    configEditor: {
        currentConfig: {
            'name': 'test application',
            'description': 'this is test application description',
            'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
            'isDefault': false,
            'homeScreen': {
                mode: CONSTANTS.MODE_USE_DOSSIER_AS_HOME_SCREEN, 
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
            "id": "B98E838240D2B2014F95FEA1E6001013",
            "name": "zzhouTest1013",
            "description": "zzhouTest Desc1013",
            "schemaVersion": 1,
            "version": 0,
            "general": {
              "disableAdvancedSettings": false,
              "disablePreferences": false,
              "networkTimeout": 180,
              "cacheClearMode": 1,
              "clearCacheOnLogout": false,
              "maxLogSize": 500,
              "logLevel": 12,
              "updateInterval": -1
            },
            "homeScreen": {
              "mode": 0,
              "homeDocument": {
                "url": "",
                "icons": [
                  "TOCs",
                  "bookmark",
                  "reset",
                  "filters",
                  "comments",
                  "share"
                ],
                "toolbarMode": 0,
                "toolbarDisabled": false
              },
              "homeLibrary": {
                "contentBundleIds": [
                  
                ],
                "icons": [
                  "sidebars",
                  "sortAndFilter",
                  "multiSelect",
                  "search",
                  "notifications",
                  "options"
                ],
                "toolbarMode": 0,
                "sidebars": [
                  "all",
                  "favorites",
                  "recents",
                  "defaultGroups",
                  "myGroups",
                  "options"
                ],
                "toolbarDisabled": false,
                "defaultGroupsName": "Default Groups"
              }
            },
            "dateCreated": "2021-06-23T02:48:40.000+0000",
            "dateModified": "2021-06-23T02:48:40.000+0000",
            "isDefault": true,
            "objectVersion": "19650A2E43A2CAAEF37957A4ABE4B303"
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

export const mockLibraryAsHome: RootState = {
  configEditor: {
      currentConfig: {
          'name': 'test application',
          'description': 'this is test application description',
          'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
          'isDefault': false,
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
      configInfoList: [],
      previewDeviceType: featureFlag.platformEnable ? reviewType.TABLET : reviewType.WEB,
  },
  configMain: {
      configList: [
        {
          "id": "B98E838240D2B2014F95FEA1E6001013",
          "name": "zzhouTest1013",
          "description": "zzhouTest Desc1013",
          "schemaVersion": 1,
          "version": 0,
          "general": {
            "disableAdvancedSettings": false,
            "disablePreferences": false,
            "networkTimeout": 180,
            "cacheClearMode": 1,
            "clearCacheOnLogout": false,
            "maxLogSize": 500,
            "logLevel": 12,
            "updateInterval": -1
          },
          "homeScreen": {
            "mode": 0,
            "homeDocument": {
              "url": "",
              "icons": [
                "TOCs",
                "bookmark",
                "reset",
                "filters",
                "comments",
                "share"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": false
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "sidebars",
                "sortAndFilter",
                "multiSelect",
                "search",
                "notifications",
                "options"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "all",
                "favorites",
                "recents",
                "defaultGroups",
                "myGroups",
                "options"
              ],
              "toolbarDisabled": false,
              "defaultGroupsName": "Default Groups"
            }
          },
          "dateCreated": "2021-06-23T02:48:40.000+0000",
          "dateModified": "2021-06-23T02:48:40.000+0000",
          "isDefault": true,
          "objectVersion": "19650A2E43A2CAAEF37957A4ABE4B303"
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

export const mockDossierAsHome: RootState = {
  configEditor: {
      currentConfig: {
          'name': 'test application dossier as home',
          'description': 'this is test application description for dossier as home',
          'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
          'isDefault': false,
          'homeScreen': {
              mode: CONSTANTS.MODE_USE_DOSSIER_AS_HOME_SCREEN, 
              homeLibrary: { 
                icons: libraryIconKeys.map((key) => iconValidKey(key)), 
                sidebars: sidebarIconKeys.filter((key) => key !== iconTypes.defaultGroup.key).map((key) => iconValidKey(key)), 
                contentBundleIds: [],
                defaultGroupsName: '',
                toolbarMode: CONSTANTS.SHOW_TOOLBAR,
                toolbarDisabled: false,
              },
              homeDocument: {
                url: "http://localhost:8282/consume-dev/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/B7CA92F04B9FAE8D941C3E9B7E0CD753", 
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
      configInfoList: [],
      previewDeviceType: featureFlag.platformEnable ? reviewType.TABLET : reviewType.WEB,
  },
  configMain: {
      configList: [
        {
          "id": "B98E838240D2B2014F95FEA1E6001013",
          "name": "zzhouTest1013",
          "description": "zzhouTest Desc1013",
          "schemaVersion": 1,
          "version": 0,
          "general": {
            "disableAdvancedSettings": false,
            "disablePreferences": false,
            "networkTimeout": 180,
            "cacheClearMode": 1,
            "clearCacheOnLogout": false,
            "maxLogSize": 500,
            "logLevel": 12,
            "updateInterval": -1
          },
          "homeScreen": {
            "mode": 0,
            "homeDocument": {
              "url": "",
              "icons": [
                "TOCs",
                "bookmark",
                "reset",
                "filters",
                "comments",
                "share"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": false
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "sidebars",
                "sortAndFilter",
                "multiSelect",
                "search",
                "notifications",
                "options"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "all",
                "favorites",
                "recents",
                "defaultGroups",
                "myGroups",
                "options"
              ],
              "toolbarDisabled": false,
              "defaultGroupsName": "Default Groups"
            }
          },
          "dateCreated": "2021-06-23T02:48:40.000+0000",
          "dateModified": "2021-06-23T02:48:40.000+0000",
          "isDefault": true,
          "objectVersion": "19650A2E43A2CAAEF37957A4ABE4B303"
        },
        {
          "id": "ED458237316F4DBC8A09C1EC9AA3A46E",
          "name": "tesEnum",
          "description": "test modified",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 1,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-28T04:12:30.703+0000",
          "dateModified": "2021-06-28T04:12:30.703+0000",
          "platform": [
            "Mobile"
          ],
          "isDefault": false,
          "objectVersion": "652527A1407CC57CB2BA96B925CB1139"
        },
        {
          "id": "7544EA99C531408F81AABD7015D6CDFE",
          "name": "tesEnum1",
          "description": "test010 des",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 0,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-25T06:48:15.282+0000",
          "dateModified": "2021-06-25T06:48:15.282+0000",
          "isDefault": false,
          "objectVersion": "A39631F84FB38F31AFB7A686FD167778"
        },
        {
          "id": "64CAD96509964218A802D677B398A4CC",
          "name": "tesEnum2",
          "description": "test010 des",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 1,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-25T06:50:02.296+0000",
          "dateModified": "2021-06-25T06:50:02.296+0000",
          "isDefault": false,
          "objectVersion": "02C16C68488A5BB503BA4F9586C4D3D4"
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

export const mockDossierPicker: RootState = {
  configEditor: {
      currentConfig: {
          'name': 'test application dossier as home',
          'description': 'this is test application description for dossier as home',
          'platform': featureFlag.platformEnable ? [platformType.mobile, platformType.web, platformType.desktop] : [platformType.web],
          'isDefault': false,
          'homeScreen': {
              mode: CONSTANTS.MODE_USE_DOSSIER_AS_HOME_SCREEN, 
              homeLibrary: { 
                icons: libraryIconKeys.map((key) => iconValidKey(key)), 
                sidebars: sidebarIconKeys.filter((key) => key !== iconTypes.defaultGroup.key).map((key) => iconValidKey(key)), 
                contentBundleIds: [],
                defaultGroupsName: '',
                toolbarMode: CONSTANTS.SHOW_TOOLBAR,
                toolbarDisabled: false,
              },
              homeDocument: {
                url: "http://localhost:8282/consume-dev/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/B7CA92F04B9FAE8D941C3E9B7E0CD753", 
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
      configInfoList: [],
      previewDeviceType: featureFlag.platformEnable ? reviewType.TABLET : reviewType.WEB,
  },
  configMain: {
      configList: [
        {
          "id": "B98E838240D2B2014F95FEA1E6001013",
          "name": "zzhouTest1013",
          "description": "zzhouTest Desc1013",
          "schemaVersion": 1,
          "version": 0,
          "general": {
            "disableAdvancedSettings": false,
            "disablePreferences": false,
            "networkTimeout": 180,
            "cacheClearMode": 1,
            "clearCacheOnLogout": false,
            "maxLogSize": 500,
            "logLevel": 12,
            "updateInterval": -1
          },
          "homeScreen": {
            "mode": 0,
            "homeDocument": {
              "url": "",
              "icons": [
                "TOCs",
                "bookmark",
                "reset",
                "filters",
                "comments",
                "share"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": false
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "sidebars",
                "sortAndFilter",
                "multiSelect",
                "search",
                "notifications",
                "options"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "all",
                "favorites",
                "recents",
                "defaultGroups",
                "myGroups",
                "options"
              ],
              "toolbarDisabled": false,
              "defaultGroupsName": "Default Groups"
            }
          },
          "dateCreated": "2021-06-23T02:48:40.000+0000",
          "dateModified": "2021-06-23T02:48:40.000+0000",
          "isDefault": true,
          "objectVersion": "19650A2E43A2CAAEF37957A4ABE4B303"
        },
        {
          "id": "ED458237316F4DBC8A09C1EC9AA3A46E",
          "name": "tesEnum",
          "description": "test modified",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 1,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-28T04:12:30.703+0000",
          "dateModified": "2021-06-28T04:12:30.703+0000",
          "platform": [
            "Mobile"
          ],
          "isDefault": false,
          "objectVersion": "652527A1407CC57CB2BA96B925CB1139"
        },
        {
          "id": "7544EA99C531408F81AABD7015D6CDFE",
          "name": "tesEnum1",
          "description": "test010 des",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 0,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-25T06:48:15.282+0000",
          "dateModified": "2021-06-25T06:48:15.282+0000",
          "isDefault": false,
          "objectVersion": "A39631F84FB38F31AFB7A686FD167778"
        },
        {
          "id": "64CAD96509964218A802D677B398A4CC",
          "name": "tesEnum2",
          "description": "test010 des",
          "schemaVersion": 0,
          "version": 0,
          "general": {
            "disableAdvancedSettings": true,
            "disablePreferences": true,
            "networkTimeout": 0,
            "cacheClearMode": 0,
            "clearCacheOnLogout": true,
            "maxLogSize": 0,
            "logLevel": 0,
            "updateInterval": 0
          },
          "homeScreen": {
            "mode": 1,
            "homeDocument": {
              "url": "string",
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "toolbarDisabled": true
            },
            "homeLibrary": {
              "contentBundleIds": [
                
              ],
              "icons": [
                "string"
              ],
              "toolbarMode": 0,
              "sidebars": [
                "string"
              ],
              "toolbarDisabled": true,
              "defaultGroupsName": "string"
            }
          },
          "dateCreated": "2021-06-25T06:50:02.296+0000",
          "dateModified": "2021-06-25T06:50:02.296+0000",
          "isDefault": false,
          "objectVersion": "02C16C68488A5BB503BA4F9586C4D3D4"
        }
      ],
      contentBundleList: []
  },
  bundleContent: {
      dossiers: [
        {
            "name": "New Dossier",
            "id": "4802DE4C4C18F434C75BFA84EC8A5E4B",
            "type": 55,
            "dateCreated": "2013-12-03T19:31:23.000+0000",
            "dateModified": "2018-09-04T04:02:17.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 1879072805,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "A13890BC11D4E0F1C000EB9495D0F44F"
        },
        {
            "name": "Analysis Document",
            "id": "52576385422A3F9F174B97BE6E361116",
            "type": 55,
            "dateCreated": "2010-09-27T21:17:51.000+0000",
            "dateModified": "2014-11-27T00:50:27.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 1610614921,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "A13890BC11D4E0F1C000EB9495D0F44F"
        },
        {
            "name": "Customer Income Analysis2",
            "id": "30F2F4CE420EE7261CD20D828FF0C852",
            "type": 55,
            "dateCreated": "2021-05-12T07:20:13.000+0000",
            "dateModified": "2021-05-12T07:35:13.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 1879072805,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "B19DEDCC11D4E0EFC000EB9495D0F44F"
        }
    ],
      documents: [
        {
            "name": "iPad Landscape",
            "id": "036C946741BB821F9DE3BE82C19FA45A",
            "type": 55,
            "dateCreated": "2010-06-12T18:55:38.000+0000",
            "dateModified": "2015-01-12T13:53:08.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 268435711,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "A13890BC11D4E0F1C000EB9495D0F44F"
        },
        {
            "name": "Colorful",
            "id": "09B362B8461C59F627122EA7685C83FA",
            "type": 55,
            "dateCreated": "2003-11-12T17:49:31.000+0000",
            "dateModified": "2009-06-25T15:50:13.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 268435263,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "A13890BC11D4E0F1C000EB9495D0F44F"
        },
        {
            "name": "08 One Content Top Two Contents Bottom",
            "id": "176B047B443EB412282B258A3BF18A75",
            "type": 55,
            "dateCreated": "2008-05-23T17:08:00.000+0000",
            "dateModified": "2015-09-16T21:44:53.000+0000",
            "acg": 255,
            "owner": {
                "name": "Administrator",
                "id": "54F3D26011D2896560009A8E67019608"
            },
            "viewMedia": 134217845,
            "certifiedInfo": {
                "certified": false
            },
            "projectId": "A13890BC11D4E0F1C000EB9495D0F44F"
        }
    ],
      loadingDossiers: false,
      loadingDossiersFinish: true,
  }
}