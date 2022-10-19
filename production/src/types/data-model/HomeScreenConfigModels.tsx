import { CustomAuthModes } from "src/modules/components/features/custom-auth/custom-auth.model";

export interface MainViewContentBundleType {
    'id': string,
    'name': string,
    'color': number
}

export interface ColorPaletteType {
    'colors': Array<string>,
    'name': string,
    'id': string,
    'paletteType': number,
    'isDefaultPalette'?: boolean
}
export interface CustomEmailSettingType {
    'enabled': boolean,
    'hostPortal': string,
    'showBrandingImage': boolean,
    'showBrowserButton': boolean,
    'showMobileButton': boolean,
    'showReminder': boolean,
    'showSentBy': boolean,
    'sentByText': string,
    'showSocialMedia': boolean
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
        },
        theme?: ApplicationTheme
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
    useConfigPalettes: boolean,
    applicationPalettes: Array<string>,
    applicationDefaultPalette: string,
    // customize email
    emailSettings: CustomEmailSettingType,
    authModes: CustomAuthModes
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

export interface ThemePropObject {
    type: string,
    value: any
}
export interface ApplicationLogos {
    web?: ThemePropObject,
    favicon?: ThemePropObject,
    mobile?: ThemePropObject
}
export interface ApplicationTheme {
    schemaVersion: number,
    logos: ApplicationLogos
} 
