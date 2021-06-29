export interface MainViewContentBundleType {
    'id': string,
    'name': string,
    'color': number
}
export interface HomeScreenConfigType {
    'id': string,
    'name': string,
    'schemaVersion': number,
    'description': string,
    'isDefault': boolean,
    'platform': Array<string>,
    'dateModified': string,
    'dateCreated': string,
    'homeScreen': {
        mode: number, 
        homeLibrary: { 
            icons: Array<string>,
            sidebars: Array<string>,
            contentBundleIds: Array<string>,
            defaultGroupsName: string,
            toolbarMode: number,
            toolbarDisabled: boolean,
        }, 
        homeDocument: {
            url: string,
            icons: Array<string>,
            toolbarMode: number,
            toolbarDisabled: boolean,
        }
    },
    'general': {
        disableAdvancedSettings: boolean,
        disablePreferences: boolean,
        networkTimeout: number,
        cacheClearMode: number,
        clearCacheOnLogout: boolean, 
        maxLogSize: number,
        logLevel: number,
        updateInterval: number
    }
}

export interface HomeScreenConfigInfo {
    name: string
}

export interface HomeScreenBundleContentListItem {
    id: string,
    projectId: string,
    type: number,
    viewMedia: number,
    dateModified: string,
    owner: {name: string, id: string},
    name: string
    dateCreated: string,
    acg: number,
    certifiedInfo: {certified: any}
}