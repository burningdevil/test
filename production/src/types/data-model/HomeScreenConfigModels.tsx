export interface HomeScreenConfigType {
    'id': string,
    'name': string,
    'description': string,
    'lastUpdate': number,
    'schemaVersion': number,
    'icons': Array<string>,
    'mode': number,
    'platform': Array<string>
    'contentBundleIds': Array<string>
}

export interface MainViewContentBundleType {
    'id': string,
    'name': string,
    'color': number
}

export interface HomeScreenEditConfigType {
    'id': string,
    'name': string,
    'description': string,
    'default': boolean,
    'platform': Array<string>,
    'lastUpdate': number,
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
        networkTimeout: number,
        cacheClearMode: number,
        clearCacheOnLogout: boolean, 
        maxLogSize: number,
        logLevel: number,
        updateInterval: number
    }
}

export interface HomeScreenBundleContentListItem {
    id: string,
    projectId: string,
    type: number,
    viewMedia: number,
    dateModified: string,
    owner: {name: string, id: string},
    isCertified: boolean,
    name: string
    dateCreated: string,
    acg: number,
    certifiedInfo: {certified: any}
}