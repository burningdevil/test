import * as _ from 'lodash'
import { t } from '../../i18n/i18next'

export const CONSTANTS = {
    GENERAL: 'general',
    ALL: 'all',
    //PAGE
    PAGE_TAB1: '1',
    PAGE_TAB2: '2',
    //alert
    DELETE: 'Delete',
    SHARE: 'Share',
    //info
    NAME: 'name',
    DESC: 'desc',
    //Home Screen
    MODE_USE_DEFAULT_HOME_SCREEN: 0,
    MODE_USE_DOSSIER_AS_HOME_SCREEN: 1,
    
    HOME_SCREEN: 'homeScreen',
    HOME_DOCUMENT: 'homeDocument',
    HOME_LIBRARY: 'homeLibrary',
    MODE: 'mode',
    URL: 'url',
    ICONS: 'icons',
    TOOLBAR_MODE: 'toolbarMode',   // hide toolbar by default
    TOOLBAR_DISABLED: 'toolbarDisabled',
    DEFAULT_GROUPS_NAME: 'defaultGroupsName',
    //Advanced Settings
    AUTH_MODES: 'authModes',
    DISABLE_ADVANCED_SETTINGS: 'disableAdvancedSettings',
    DISABLE_PREFERENCES: 'disablePreferences',
    UPDATE_INTERVAL: 'updateInterval',
    UPDATE_INTERVAL_TEXT: 'updateIntervalText',
    NETWORK_TIMEOUT: 'networkTimeout',
    LOG_LEVEL: 'logLevel',
    MAX_LOG_SIZE: 'maxLogSize',
    CACHE_CLEAR_MODE: 'cacheClearMode',
    CLEAR_CACHE_ON_LOGOUT: 'clearCacheOnLogout',
    CLEAR_CACHE_ON_CLOSE: 'clearCacheOnClose',
    //Config Constants
    DEFAULT_NETWORK_TIMEOUT: 180,
    UPDATE_INTERVAL_DISABLED: -1,
    DEFAULT_MAX_LOG_SIZE: 500,
    DEFAULT_UPDATE_INTERVAL: 1440,
    LOG_LEVEL_ALL: 0,
    LOG_LEVEL_INFO: 10,
    LOG_LEVEL_WARNING: 12,
    LOG_LEVEL_SEVERE: 14,
    LOG_LEVEL_OFF: 16,
    CLEAR_ON_CLOSE: 2,
    CLEAR_AUTOMATIC: 1,

    // components for TOOLBAR_MODE
    SHOW_TOOLBAR: 0,
    COLLAPSE_TOOLBAR: 1,

    // icons key name
    ICON_SIDEBAR: 'sidebars',
    ICON_SORT_FILTER: 'sortAndFilter',
    ICON_MULTI_SELECT: 'multiSelect',
    ICON_SEARCH: 'search',
    ICON_COMMENTS: 'comments',
    ICON_NOTIFICATIONS: 'notifications',
    ICON_OPTIONS: 'options',
    ICON_TOCS: 'TOCs',
    ICON_BOOKMARK: 'bookmark',
    ICON_RESET: 'reset',
    ICON_FILTER: 'filters',
    ICON_SHARE: 'share',
    ICON_DATA_SEARCH: 'dataSearch',
    ICON_HYPER: 'hyper',
    ICON_AA_FONT: 'aaFont',
    ICON_ALL: 'all',
    ICON_FAV: 'favorites',
    ICON_RECENENT: 'recents',
    ICON_DEFAULT_GROUP: 'defaultGroups',
    ICON_MY_GROUP: 'myGroups',
    ICON_HOME: 'home',
    ICON_FULL_SCREEN: 'fullScreen',

    // icon font code
    FONT_SIDEBAR: 'icon-tb_hamburger',
    FONT_SORT_FILTER: 'icon-filter',
    FONT_MULTI_SELECT: 'icon-tb_select_a',
    FONT_SEARCH: 'icon-search',
    FONT_COMMENTS: 'icon-comments',
    FONT_NOTIFICATIONS: 'icon-bell',
    FONT_OPTIONS: 'icon-tb_profile_n',
    FONT_TOCS: 'icon-toc',
    FONT_BOOKMARK: 'icon-tb_bookmarks_n',
    FONT_RESET: 'icon-resetfile',
    FONT_FILTER: 'icon-tb_filter_n',
    FONT_SHARE: 'icon-tb_share_n',
    FONT_DATA_SEARCH: 'icon-searchfilter',
    FONT_HYPER: 'icon-checkmark2',
    FONT_AA_FONT: 'icon-pnl_shared',
    FONT_ALL: 'icon-group_all',
    FONT_FAV: 'icon-home_favorite_i',
    FONT_RECENT: 'icon-group_recents',
    FONT_DEFAULT_GROUP: 'icon-group_groups',
    FONT_MY_GROUP: 'icon-group_groups',

    // preview use only
    FONT_HOME: 'icon-tb_home',
    FONT_PREVIEWSIDEBAR: 'icon-library',
    FONT_PREVIEWSIDEBAR_MOBILE: 'icon-backarrow',
    FONT_PREVIEWTOC: 'icon-tb_undoarrow',
    FONT_PREVIEWOPTIONS: 'icon-user-profile',
    FONT_FULLSCREEN: 'icon-fullscreen',
    FONT_LIBRARY_MOBILE: 'icon-tb_appicon',
}

export const reviewType = {
    TABLET: 'Tablet',
    PHONE: 'Phone',
    DESKTOP: 'Desktop',
    WEB: 'Web',
}

export const platformType = {
    mobile: 'Mobile',
    web: 'Web',
    desktop: 'Desktop',
}

// toolbar icon [display text, icon-name, key]
export interface iconDetail{
    displayText: string,
    iconName: string,
    key: string,
}

export interface BundleRecipient {
    id: string,
    group: boolean,
    name: string
}

export interface BundleOwner {
  id: string,
  name: string
}

export interface BundleInfo {
  color: number,
  opacity: number,
  emailEnabled: boolean,
  id: string,
  name: string,
  dateCreated: string,
  dateModified: string,
  owner: BundleOwner,
  type: number,
  recipients: BundleRecipient[],
  recipientStr: string,//eg: 2 users and 2 groups
  expand: boolean,
  recipientType: number
}

export const iconTypes = {
    sidebar: {displayText: t('sidebar'), iconName: CONSTANTS.FONT_SIDEBAR, key: CONSTANTS.ICON_SIDEBAR},
    sortAndFilter: {displayText: t('librarySortFilter'), iconName: CONSTANTS.FONT_SORT_FILTER, key: CONSTANTS.ICON_SORT_FILTER},
    multiSelect: {displayText: t('multiSelect'), iconName: CONSTANTS.FONT_MULTI_SELECT, key: CONSTANTS.ICON_MULTI_SELECT},
    search: {displayText: t('search'), iconName: CONSTANTS.FONT_SEARCH, key: CONSTANTS.ICON_SEARCH},
    notification: {displayText: t('notification'), iconName: CONSTANTS.FONT_NOTIFICATIONS, key: CONSTANTS.ICON_NOTIFICATIONS},
    account: {displayText: t('account'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS},
    accountWeb: {displayText: t('accountWeb'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS+'_web'},
    toc: {displayText: t('toc'), iconName: CONSTANTS.FONT_TOCS, key: CONSTANTS.ICON_TOCS},
    bookmark: {displayText: t('bookmark'), iconName: CONSTANTS.FONT_BOOKMARK, key: CONSTANTS.ICON_BOOKMARK},
    reset: {displayText: t('reset'), iconName: CONSTANTS.FONT_RESET, key: CONSTANTS.ICON_RESET},
    filter: {displayText: t('filter'), iconName: CONSTANTS.FONT_FILTER, key: CONSTANTS.ICON_FILTER},
    comment: {displayText: t('comments'), iconName: CONSTANTS.FONT_COMMENTS, key: CONSTANTS.ICON_COMMENTS},
    share: {displayText: t('share'), iconName: CONSTANTS.FONT_SHARE, key: CONSTANTS.ICON_SHARE},
    // platform specified
    dataSearch: {displayText: 'Data Search (Desktop Only)', iconName: CONSTANTS.FONT_DATA_SEARCH, key: CONSTANTS.ICON_DATA_SEARCH},
    hyper: {displayText: 'Hyper Intelligence (Desktop Only)', iconName: CONSTANTS.FONT_HYPER, key: CONSTANTS.ICON_HYPER},
    aaFont: {displayText: 'Font Size in Grid (Mobile Only)', iconName: CONSTANTS.FONT_AA_FONT, key: CONSTANTS.ICON_AA_FONT},
    // sidebar children
    all: {displayText: t('all'), iconName: CONSTANTS.FONT_ALL, key: CONSTANTS.ICON_ALL},
    favorites: {displayText: t('favorites'), iconName: CONSTANTS.FONT_FAV, key: CONSTANTS.ICON_FAV},
    recents: {displayText: t('recents'), iconName: CONSTANTS.FONT_RECENT, key: CONSTANTS.ICON_RECENENT},
    defaultGroup: {displayText: t('defaultGroups'), iconName: CONSTANTS.FONT_DEFAULT_GROUP, key: CONSTANTS.ICON_DEFAULT_GROUP},
    myGroup: {displayText: t('myGroup'), iconName: CONSTANTS.FONT_MY_GROUP, key: CONSTANTS.ICON_MY_GROUP},
    accountMobile: {displayText: t('accountMobile'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS+'_mobile'},
    
    //// for preview. Localization not needed.
    // home button
    home: {displayText: t('home'), iconName: CONSTANTS.FONT_HOME, key: CONSTANTS.ICON_HOME},
    // stands for 'sidebar' in library
    previewSidebar: {displayText: t('sidebar'), iconName: CONSTANTS.FONT_PREVIEWSIDEBAR, key: CONSTANTS.ICON_SIDEBAR},
    // stands for 'library' in dossier
    previewLibraryWeb: {displayText: t('home'), iconName: CONSTANTS.FONT_PREVIEWSIDEBAR, key: CONSTANTS.ICON_HOME},
    previewLibraryMobile: {displayText: t('home'), iconName: CONSTANTS.FONT_LIBRARY_MOBILE, key: CONSTANTS.ICON_HOME},
    // mobile sidebar
    previewSidebarMobile: {displayText: t('sidebar'), iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_MOBILE, key: CONSTANTS.ICON_SIDEBAR},
    previewAccountMobile: {displayText: t('account'), iconName: CONSTANTS.FONT_PREVIEWOPTIONS, key: CONSTANTS.ICON_OPTIONS+'_mobile'},
    previewTocPhone: {displayText: t('toc'), iconName: CONSTANTS.FONT_PREVIEWTOC, key: CONSTANTS.ICON_TOCS},
    previewFullScreen: {displayText: 'Full Screen', iconName: CONSTANTS.FONT_FULLSCREEN, key: CONSTANTS.ICON_FULL_SCREEN},
}


/// for icon switch
// icons may appear in both library and dossier
// export const bothSideIcons = [iconTypes.notification, iconTypes.account]

// library icons when mode is Libary as home
export const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.accountWeb]

// dossier icons when mode is Library as home
export const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home, should append 
export const dossierIconsDossierHome = [iconTypes.toc, 
    iconTypes.filter, iconTypes.comment, iconTypes.share, iconTypes.notification, iconTypes.account]

// extra icons for specified platforms
export const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
export const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
export const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup, iconTypes.accountMobile]

// for accountMobile and accountWeb to remove suffix
export const iconValidKey = (iconKey: string) => iconKey.split('_').length > 0 ? iconKey.split('_')[0] : iconKey

export const dossierIconKeys =  _.union(dossierIcons.map((element) => element.key), dossierIconsDossierHome.map((element) => element.key)) 
export const libraryIconKeys = libraryIcons.map((element) => element.key)
export const sidebarIconKeys = childrenIcons.map((element) => element.key)

export const mobileOnlyIconKeys = [iconTypes.accountMobile].map((element) => element.key)
export const webDesktopOnlyIconKeys = [iconTypes.multiSelect, iconTypes.accountWeb].map((element) => element.key)

export default CONSTANTS