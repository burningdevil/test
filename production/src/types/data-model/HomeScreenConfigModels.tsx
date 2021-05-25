import { iconDetail } from "../../modules/components/HomeScreenConfigConstant"
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
    'platform': Array<string>,
    'lastUpdate': number,
    'homeScreen': {
        mode: number, 
        homeLibrary: { 
            icons: Array<string>,
            sidebars: Array<string>,
            contentBundleIds: Array<string>,
            toolbarMode: number,
            toolbarDisabled: number
        }, 
        homeDocument: {
            url: string,
            icons: Array<string>,
            toolbarMode: number,
            toolbarDisabled: number
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