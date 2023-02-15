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
export enum MobileButtonLinkEnum {
    DEFAULT = 'DEFAULT',
    APP_SCHEME = 'APP_SCHEME',
    UNIVERSAL_LINK = 'UNIVERSAL_LINK'
}
export interface ActionButtonInterface {
    "browserButtonStyle": {
        "backgroundColor": string,
        "fontColor": string,
        "text": string
        },
    "mobileButtonStyle": {
        "backgroundColor": string,
        "fontColor": string,
        "text": string
    },
    "mobileButtonLinkType": MobileButtonLinkEnum,
    "mobileButtonScheme": string,
    "description": string
}
export interface EmailBodyInterface {
    'subject': string,
    'body': string
}
export interface EmailContentInterface {
    'SHARE_DOSSIER': EmailBodyInterface,
    'SHARE_BOOKMARK': EmailBodyInterface,
    'MEMBER_ADDED': EmailBodyInterface,
    'USER_MENTION': EmailBodyInterface
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
    'showSocialMedia': boolean,

    'showButtonDescription': boolean,
    'content': EmailContentInterface,
    'sender': {
        'displayName': string,
        'address': string
    },
    'brandingImage': {
        'url': string
    },
    'button': ActionButtonInterface,
    "reminder": {
        "text": string,
        "linkText": string
    },
    "socialMedia": {
        "showFacebook": boolean,
        "facebookLink": string,
        "showTwitter": boolean,
        "twitterLink": string,
        "showLinkedIn": boolean,
        "linkedInLink": string,
        "showYouTube": boolean,
        "youTubeLink": string
    }
}

export interface EnvironmentConnectionInterface {
    name: string,
    url: string,
    applicationList?: Array<EnvironmentConnectionApplicationType>,
    isConfigured?: boolean,
    isConnected?: boolean,
    errorMessage?: string
}

export interface EnvironmentConnectionSettingType {
    current: string,
    other: Array<EnvironmentConnectionInterface>
}

export interface EnvironmentConnectionApplicationType {
    id: string,
    isDefault: boolean,
    name: string,
    logo?: ThemePropObject
}

export interface EnvironmentConnectionTableDataType {
    key: string,
    name: string,
    wsName: string,
    baseUrl: string,
    selectedApplication?: EnvironmentConnectionApplicationType,
    applicationList?: Array<EnvironmentConnectionApplicationType>,
    isConfigured: boolean,
    isConnected: boolean,
    errorMessage?: string
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
            showAllContents: boolean,
            defaultGroupsName: string,
            toolbarMode: number,
            toolbarEnabled: boolean
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
    authModes: CustomAuthModes,
    // Environment Connection
    environments: EnvironmentConnectionSettingType,
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

export interface ThemeColorFormats {
  toolbarFill: string,
  toolbarColor: string,

  sidebarFill: string,
  sidebarColor: string,

  sidebarActiveFill: string,
  sidebarActiveColor: string,

  panelFill: string,
  panelColor: string,

  canvasFill: string,
  
  accentFill: string,

  buttonColor: string,

  notificationBadgeFill: string
}
export interface ApplicationColor {
    selectedTheme?: string,
    formatting?: ThemeColorFormats
}

export interface ApplicationTheme {
    schemaVersion: number,
    logos: ApplicationLogos,
    color: ApplicationColor
} 
