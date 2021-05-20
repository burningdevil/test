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
    REVIEW_MODE_TABLET: 'tablet',
    REVIEW_MODE_PHONE: 'Phone',
    REVIEW_MODE_DESKTOP: 'Desktop',
    REVIEW_MODE_WEB: 'Web',
    HOME_SCREEN: 'homeScreen',
    HOME_DOCUMENT: 'homeDocument',
    HOME_LIBRARY: 'homeLibrary',
    MODE: 'mode',
    URL: 'url',
    ICONS: 'icons',
    TOOLBAR_MODE: 'toolbarMode',   // hide toolbar by default
    TOOLBAR_DISABLED: 'toolbarDisabled',  // remove toolbar from view
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
    LOG_LEVEL_ALL: 0,
    LOG_LEVEL_INFO: 10,
    LOG_LEVEL_WARNING: 12,
    LOG_LEVEL_SEVERE: 14,
    LOG_LEVEL_OFF: 16,
    CLEAR_ON_CLOSE: 2,
    CLEAR_AUTOMATIC: 1,

    // components for TOOLBAR_MODE, TOOLBAR_DISABLED
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
    ICON_FAV: 'favourites',
    ICON_RECENENT: 'recents',
    ICON_DEFAULT_GROUP: 'defaultGroups',
    ICON_MY_GROUP: 'myGroups',
    ICON_HOME: 'home',
    ICON_FULL_SCREEN: 'fullScreen',

    // icon font code
    FONT_SIDEBAR: 'icon-listview',
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
}

export const platformType = {
    mobile: 'Mobile',
    web: 'Web',
    desktop: 'Desktop',
  };
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
    sidebar: {displayText: 'Sidebar', iconName: CONSTANTS.FONT_SIDEBAR, key: CONSTANTS.ICON_SIDEBAR},
    sortAndFilter: {displayText: 'Library Sort and Filter', iconName: CONSTANTS.FONT_SORT_FILTER, key: CONSTANTS.ICON_SORT_FILTER},
    multiSelect: {displayText: 'Multi-Select (Web and Desktop)', iconName: CONSTANTS.FONT_MULTI_SELECT, key: CONSTANTS.ICON_MULTI_SELECT},
    search: {displayText: 'Search', iconName: CONSTANTS.FONT_SEARCH, key: CONSTANTS.ICON_SEARCH},
    notification: {displayText: 'Notification', iconName: CONSTANTS.FONT_NOTIFICATIONS, key: CONSTANTS.ICON_NOTIFICATIONS},
    account: {displayText: 'Account', iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS},
    toc: {displayText: 'Table of Contents', iconName: CONSTANTS.FONT_TOCS, key: CONSTANTS.ICON_TOCS},
    bookmark: {displayText: 'Bookmark', iconName: CONSTANTS.FONT_BOOKMARK, key: CONSTANTS.ICON_BOOKMARK},
    reset: {displayText: 'Reset Dossier', iconName: CONSTANTS.FONT_RESET, key: CONSTANTS.ICON_RESET},
    filter: {displayText: 'Filter', iconName: CONSTANTS.FONT_FILTER, key: CONSTANTS.ICON_FILTER},
    comment: {displayText: 'Comments', iconName: CONSTANTS.FONT_COMMENTS, key: CONSTANTS.ICON_COMMENTS},
    share: {displayText: 'Share', iconName: CONSTANTS.FONT_SHARE, key: CONSTANTS.ICON_SHARE},
    // platform specified
    dataSearch: {displayText: 'Data Search (Desktop Only)', iconName: CONSTANTS.FONT_DATA_SEARCH, key: CONSTANTS.ICON_DATA_SEARCH},
    hyper: {displayText: 'Hyper Intelligence (Desktop Only)', iconName: CONSTANTS.FONT_HYPER, key: CONSTANTS.ICON_HYPER},
    aaFont: {displayText: 'Font Size in Grid (Mobile Only)', iconName: CONSTANTS.FONT_AA_FONT, key: CONSTANTS.ICON_AA_FONT},
    // sidebar children
    all: {displayText: 'All', iconName: CONSTANTS.FONT_ALL, key: CONSTANTS.ICON_ALL},
    favorites: {displayText: 'Favorites', iconName: CONSTANTS.FONT_FAV, key: CONSTANTS.ICON_FAV},
    recents: {displayText: 'Recents', iconName: CONSTANTS.FONT_RECENT, key: CONSTANTS.ICON_RECENENT},
    defaultGroup: {displayText: 'Default Groups', iconName: CONSTANTS.FONT_DEFAULT_GROUP, key: CONSTANTS.ICON_DEFAULT_GROUP},
    myGroup: {displayText: 'My Groups', iconName: CONSTANTS.FONT_MY_GROUP, key: CONSTANTS.ICON_MY_GROUP},
    
    //// for preview
    // home button
    home: {displayText: 'Home', iconName: CONSTANTS.FONT_HOME, key: CONSTANTS.ICON_HOME},
    previewSidebar: {displayText: 'Sidebar', iconName: CONSTANTS.FONT_PREVIEWSIDEBAR, key: CONSTANTS.ICON_SIDEBAR},
    previewSidebarMobile: {displayText: 'Sidebar', iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_MOBILE, key: CONSTANTS.ICON_SIDEBAR},
    previewAccountMobile: {displayText: 'Account', iconName: CONSTANTS.FONT_PREVIEWOPTIONS, key: CONSTANTS.ICON_OPTIONS},
    previewTocPhone: {displayText: 'Table of Contents', iconName: CONSTANTS.FONT_PREVIEWTOC, key: CONSTANTS.ICON_TOCS},
    previewFullScreen: {displayText: 'Full Screen', iconName: CONSTANTS.FONT_FULLSCREEN, key: CONSTANTS.ICON_FULL_SCREEN},
}


/// for icon switch
// icons may appear in both library and dossier
export const bothSideIcons = [iconTypes.notification, iconTypes.account]

// library icons when mode is Libary as home
export const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.account]

// dossier icons when mode is Library as home
export const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home, should append 
export const dossierIconsDossierHome = dossierIcons.concat(bothSideIcons)

// extra icons for specified platforms
export const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
export const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
export const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup]

export default CONSTANTS