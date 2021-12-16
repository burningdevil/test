export interface MainViewContentBundleType {
    'id': string,
    'name': string,
    'color': number
}

export interface ColorPaletteType {
    'colors': Array<string>,
    'name': string,
    'id': string,
    'paletteType': number
}

export interface HomeScreenConfigType {
    'id': string,
    'name': string,
    'schemaVersion': number,
    'description': string,
    'isDefault': boolean,
    'platforms': Array<string>,
    'dateModified': string,
    'dateCreated': string,
    'objectVersion': string,
    'objectNames': [],
    'objectAcl': [],
    'homeScreen': {
        mode: number, 
        homeLibrary: { 
            icons: Array<string>,
            sidebars: Array<string>,
            customizedItems: any,
            contentBundleIds: Array<string>,
            defaultGroupsName: string,
            toolbarMode: number,
            toolbarEnabled: boolean,
        }, 
        homeDocument: {
            url: string,
            icons: Array<string>,
            toolbarMode: number,
            toolbarEnabled: boolean,
            homeDocumentType?: string
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
    },
    // Color Palette
    useProjectPalettes: boolean,
    applicationPalettes: Array<string>,
    applicationDefaultPalette: string
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
