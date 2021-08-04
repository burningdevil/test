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
    DESC: 'description',
    VERSION: 'version',
    SCHEMA_VERSION: 'schemaVersion',
    IS_DEFAULT: 'isDefault',
    //Home Screen
    MODE_USE_DEFAULT_HOME_SCREEN: 0,
    MODE_USE_DOSSIER_AS_HOME_SCREEN: 1,
    
    HOME_SCREEN: 'homeScreen',
    HOME_DOCUMENT: 'homeDocument',
    HOME_LIBRARY: 'homeLibrary',
    MODE: 'mode',
    URL: 'url',
    ICONS: 'icons',
    CUSTOMIZED_ITEMS: 'customizedItems',
    TOOLBAR_MODE: 'toolbarMode',   // hide toolbar by default
    TOOLBAR_ENABLED: 'toolbarEnabled',
    DEFAULT_GROUPS_NAME: 'defaultGroupsName',
    CONTENT_BUNDLES: 'contentBundles',
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
    ICON_SORT_FILTER: 'sort_and_filter',
    ICON_MULTI_SELECT: 'multi_select',
    ICON_SEARCH: 'search',
    ICON_COMMENTS: 'comments',
    ICON_NOTIFICATIONS: 'notifications',
    ICON_OPTIONS: 'options',
    ICON_TOCS: 'table_of_contents',
    ICON_BOOKMARK: 'bookmarks',
    ICON_RESET: 'reset',
    ICON_FILTER: 'filters',
    ICON_SHARE: 'share',
    ICON_DATA_SEARCH: 'data_search',
    ICON_HYPER: 'hyper_intelligence',
    ICON_AA_FONT: 'font_size',
    ICON_ALL: 'all',
    ICON_FAV: 'favorites',
    ICON_RECENENT: 'recents',
    ICON_DEFAULT_GROUP: 'default_groups',
    ICON_MY_GROUP: 'my_groups',
    ICON_MY_CONTENT: 'my_content',
    ICON_HOME: 'home',
    ICON_FULL_SCREEN: 'fullScreen',

    // icon font code
    FONT_SIDEBAR: 'icon-tb_hamburger',
    FONT_SORT_FILTER: 'icon-tb_filter_n',
    FONT_MULTI_SELECT: 'icon-tb_select_n',
    FONT_SEARCH: 'icon-search_tb_box',
    FONT_COMMENTS: 'icon-tb_comments_n',
    FONT_NOTIFICATIONS: 'icon-tb_notif_n',
    FONT_OPTIONS: 'icon-tb_profile_n',
    FONT_TOCS: 'icon-tb_toc_n',
    FONT_BOOKMARK: 'icon-tb_bookmarks_n',
    FONT_RESET: 'icon-tb_reset',
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
    FONT_MY_CONTENT: 'icon-tb_profile_n',
    FONT_ADD_NEW: 'icon-pnl_add-new',
    FONT_GROUP: 'icon-group_groups_a',
    FONT_DOSSIER: 'icon-dossier',
    FONT_DOCUMENT: 'icon-rsd-cover',
    FONT_CERTIFIED: 'icon-home_certified',
    FONT_MSG_INFO: 'icon-msg_info',

    // preview use only
    FONT_HOME: 'icon-tb_home',
    FONT_PREVIEWSIDEBAR: 'icon-library',
    FONT_PREVIEWSIDEBAR_MOBILE: 'icon-backarrow',
    FONT_PREVIEWTOC: 'icon-tb_undoarrow',
    FONT_PREVIEWOPTIONS: 'icon-user-profile',
    FONT_FULLSCREEN: 'icon-fullscreen',
    FONT_LIBRARY_MOBILE: 'icon-tb_appicon',
    FONT_ERROR: 'icon-error',

    //common use
    PLATFORM: 'platforms',
    PLATFORM_STR: 'platformstr',
    DATE_MODIFIED: 'dateModified',
    DATE_CREATED: 'dateCreated',
    OWNER_NAME: 'ownerName',
    CERTIFIED: 'certified',
    DATE_CREATED_SHORT: 'dateCreatedShort',
    DATE_MODIFIED_SHORT: 'dateModifiedShort',
    RECIPIENT_STR: 'recipientStr',
    POINTER: 'pointer',
    RIGHT: 'right',
    LEFT: 'left',
    CONTENT_BUNDLE_IDS: 'contentBundleIds',
    COMPONENTS: 'components',
    APPEARANCE: 'appearance',
    DOSSIERSETTINGS: 'dossierSettings',
    MORESETTINGS: 'moreSettings',
    BACK: 'back',
    GENERATE: 'Generate',
    CONFIG_EDITOR_OBJTYPE: 'HomeScreenConfig',
    JSONFILE_SUFFIX: '.json',
    
}

export const featureFlag = {
    platformEnable: false,
}

export const reviewType = {
    TABLET: 'Tablet',
    PHONE: 'Phone',
    DESKTOP: 'Desktop',
    WEB: 'Web',
}

export const platformType = {
    mobile: 'mobile',
    web: 'web',
    desktop: 'desktop',
}

export const EnumDSSXMLViewMedia = {
    DssXmlViewMediaViewStatic: 0x00000001,
    DssXmlViewMediaViewAnalysis: 0x00000800,
    DssXmlViewMediaHTML5Dashboard: 0x00002000
}

export enum HomeScreenHomeObjectType {
    DOCUMENT = 'Document',
    DOSSIER = 'Dossier'
}

export enum BundleRecipientType {
    NONE = 'None',
    USER = 'User',
    GROUP = 'Group',
    BOTH = 'Both'
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

export const editorSize = {
    width: 962,
    height: 708,
    headerHeight: 0,
};

export const bundlePickerSize = {
    width: 900,
    height: 600,
    headerHeight: 0,
};

export const contentPickerSize = {
    width: 909,
    height: 617,
    headerHeight: 0,
};

export const localizedStrings = {
    ENABLE_FEATURE_TITLE: t('enableFeatureTitle'),
    ENABLE_FEATURE_DESC: t('enableFeatureDesc'),
    DISABLE_TOOLBAR: t('disableToolbar'),
    COLLAPSE_TOOLBAR: t('collapseToolbar'),

    LIBRARY_WINDOW: t('libraryWindow'),
    DOSSIER_WINDOW: t('dossierWindow'),
    DOSSIER_WINDOW_HOME: t('dossierWindowHome'),
    DEFAULT_GROUPS: t('defaultGroups'),
    // PLATFORM_SPECIFIC: 'PLATFORM SPECIFIC',
    NAVBAR_GENERAL: t('general'),
    NAVBAR_HOME_SCREEN: t('homeScreen'),
    NAVBAR_COMPONENTS: t('components'),
    NAVBAR_APPEARANCE: t('appearance'),
    NAVBAR_DOSSIERSETTINGS: t('dossierSettings'),
    NAVBAR_CONTENT_BUNDLES: t('contentBundles'),
    NAVBAR_MORE_SETTINGS: t('moreSettings'),
    CANCEL: t('cancel'),
    SAVE: t('save'),
    ERR_APP_SAVE: t('errAppSave'),
    ERR_APP_LOAD: t('errAppLoad'),

    ENVIRONMENT: t('environment'),
    NAME: t('name'),
    DESCRIPTION: t('description'),
    PLATFORMS: t('platforms'),
    MOBILE: t('mobile'),
    WEB: t('web'),
    DESKTOP: t('desktop'),
    CHANGE: t('change'),
    PICKDOSSIER: t('pickDossier'),
    PICKDOSSIER_ERROR_MSG: t('pickDossierErrorMsg'),
    SELECT_HOMESCREEN: t('selectHomeScreen'),
    DEFAULT_HOME: t('useDefaultHome'),
    DOSSIER_HOME: t('useDossierHome'),
    DOSSIER_HOME_DESC: t('useDossierHomeDesc'),
    INVALID_DOSSIER: t('invalidDossier'),
    TABLET: t('tablet'),
    PHONE: t('phone'),
    PREVIEW: t('preview'),
    LIBRARYHOME: t('libraryWindowLowerCase'),
    DOSSIER_WINDOW_LOWERCASE: t('dossierWindowLowerCase'),
    DOSSIERHOME: t('dossierWindowHomeLowerCase'),
    ERR_EDITOR_OPEN: t('errEditorOpen'),
    ERR_SESSION_OUT: t('errSessionOut'),
    COPY_LINK: t('copyLink'),
    DOWNLOAD_JSON: t('downloadJson'),
    LINK_COPIED: t('linkCopied'),
    ERR_LINK_COPY: t('errCopyLink'),
    EDIT: t('edit'),
    DELETE: t('delete'),
    DUPLICATE: t('duplicate'),
    NEW_APP_BTN_TEXT: t('newApplicationBtn'),
    NEW_APP_TEXT: t('newApplication'),
    DEFAULT_APP_NAME: t('defaultApplicationName'),
    HOME: t('home'),
    BUNDLE_USER_HINT: t('bundleUserHint'),
    DATE_MODIFIED: t('dateModified'),
    DATE_CREATED: t('dateCreated'),
    LIBRARY: t('library'),
    DOSSIER: t('dossier'),
    SELECT: t('select'),
    SELECT_CONTENT_BUNDLES: t('selectContentBundles'),
    SEARCH: t('search'),
    SELECT_DOSSIER_HINT: t('selectDossierHint'),
    DOSSIERS: t('dossiers'),
    DOCUMENTS: t('documents'),
    DOSSIER_TAB_TEXT: t('dossiersTab'),
    DOCUMENT_TAB_TEXT: t('documentsTab'),
    CERTIFIED: t('certified'),
    OWNER: t('owner'),
    ADD_CONTENT: t('addContent'),
    ADD_CONTENT_BUNDLES: t('addContentBundles'),
    ADD_CONTENT_BUNDLES_TEXT: t('addContentBundlesBtn'),
    DEFAULT_GROUPS_TITLE: t('defaultGroupsSectionTitle'),
    DEFAULT_GROUPS_TIP: t('tipOfDefaultGroups'),
    REMOVE_BUNDLE: t('removeBundle'),
    CONTENT: t('content'),
    RECIPIENTS: t('recipients'),
    BLANK_APP_NAME_ERROR: t('blankAppNameError'),
    DUPLICATE_APP_NAME_ERROR: t('duplicateAppNameError'),
    INVALID_CHARACTER_APP_NAME_ERROR: t('invalidCharacterAppNameError'),
    GETINFO: t('getInfo'),

    // Dossier Setting Strings
    COLOR_PALETTE: t('colorPalette'),
    ENABLE_MICORSTRATEGY_COLOR_PALETTE_DESC: t('enableMicroStrategyColorPaletteDesc'),
    ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP: t('enableMicroStrategyColorPaletteTooltip'),
    CUSTOM_COLOR_PALETTE_TITLE: t('customColorPaletteTitle'),
    NEW_COLOE_PALETTE: t('newColorPalette'),
    EMPTY_COLOR_PALETTE_LIST_HINT: t('emptyColorPaletteListHint'),

    // Error Message Strings
    ENVIRONTMENT_DISCONNECT_ERROR_TITLE_MSG: t('environmentDisconnectErrorTitleMsg'),
    ENVIRONTMENT_DISCONNECT_ERROR_DETAIL_MSG: t('environmentDisconnectErrorDetailMsg'),
    USER_PRIVILEGE_ERROR_MSG: t('userPrivilegeErrorMsg'),
    MD_VERSION_ERROR_MSG: t('mdVersionErrorMsg'),
    SERVER_VERSION_ERROR_TITLE_MSG: t('serverVersionErrorTitleMsg'),
    SERVER_VERSION_ERROR_DETAIL_MSG: t('serverVersionErrorDetailMsg')
}

export const sectionTitle = {
    DESC: t('mobileOnlyDesc'),
    SECURITY: t('security'),
    ACCESS: t('access'),
    CONNECTIVITY: t('connectivity'),
    LOGGING: t('logging'),
    CACHE: t('cache')
};

export const sectionAccess = {
    ACCESS_PREFERENCE: t('allowPreference'),
    ACCESS_ADVANCED_SETTINGS: t('allowAdvancedSettings'),
    CHECK_UPDATE: t('checkUpdate'),
};

export const sectionConnectivity = {
    NETWORK_TIMEOUT: t('networkTimeout'),
};

export const sectionLogging = {
    MAX_LOG_SIZE: t('maxLogSize'),
    LOG_LEVEL: t('logLevel'),
};

export const logLevelStr = {
    ALL: t('logAll'),
    INFO: t('logInfo'),
    WARNING: t('logWarning'),
    SEVERE: t('logServre'),
    OFF: t('logOff'),
};

export const sectionCache = {
    CLEAR_CACHE_ON_CLOSE: t('clearCacheOnClose'),
    CLEAR_CACHE_ON_LOGOUT: t('clearCacheOnLogout'),
};

export const metricStr = {
    HOUR: t('hour'),
    HOURS: t('hours'),
    SECOND: t('second'),
    SECONDS: t('seconds'),
    ENTRY: t('item'),
    ENTRIES: t('items'),
};

export const tooltipStr = (min: string, max: string) => {
    return t('tooltipStr',  {min, max}) 
};

export const selectedBundlesStr = (bundlesCount: number) => {
    return t('selectedStr', {bundlesCount})
};

export const iconTypes = {
    sidebar: {displayText: t('sidebar'), iconName: CONSTANTS.FONT_SIDEBAR, key: CONSTANTS.ICON_SIDEBAR},
    sortAndFilter: {displayText: t('librarySortFilter'), iconName: CONSTANTS.FONT_SORT_FILTER, key: CONSTANTS.ICON_SORT_FILTER},
    multiSelect: {displayText: t('multiSelect'), iconName: CONSTANTS.FONT_MULTI_SELECT, key: CONSTANTS.ICON_MULTI_SELECT},
    search: {displayText: t('search'), iconName: CONSTANTS.FONT_SEARCH, key: CONSTANTS.ICON_SEARCH},
    notification: {displayText: t('notification'), iconName: CONSTANTS.FONT_NOTIFICATIONS, key: CONSTANTS.ICON_NOTIFICATIONS},
    account: {displayText: t('account'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS},
    accountWeb: {displayText: t('accountWeb'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS+'__web'},
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
    myContent: {displayText: t('myContent'), iconName: CONSTANTS.FONT_MY_CONTENT, key: CONSTANTS.ICON_MY_CONTENT},
    accountMobile: {displayText: t('accountMobile'), iconName: CONSTANTS.FONT_OPTIONS, key: CONSTANTS.ICON_OPTIONS+'__mobile'},
    
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

// library icons when mode is Library as home
export const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.accountWeb]

// dossier icons when mode is Library as home
export const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home
export const dossierIconsDossierHome = [iconTypes.toc, 
    iconTypes.filter, iconTypes.comment, iconTypes.share, iconTypes.notification, iconTypes.account]

// extra icons for specified platforms
export const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
export const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
// export const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup, iconTypes.accountMobile]
export const childrenIcons = [iconTypes.all, iconTypes.myContent, iconTypes.favorites, iconTypes.recents, iconTypes.myGroup] // Hide default group, as content bundle is not enabled in Q3

// for accountMobile and accountWeb to remove suffix
export const iconValidKey = (iconKey: string) => iconKey.split('__').length > 0 ? iconKey.split('__')[0] : iconKey

export const dossierIconKeys =  dossierIcons.map((element) => element.key)
export const libraryIconKeys = libraryIcons.map((element) => element.key)
export const sidebarIconKeys = childrenIcons.map((element) => element.key)
export const libraryCustomizedIconKeys = [iconTypes.myContent].map((element) => element.key)

export const mobileOnlyIconKeys = [iconTypes.accountMobile].map((element) => element.key)
export const webDesktopOnlyIconKeys = [iconTypes.multiSelect, iconTypes.accountWeb].map((element) => element.key)
export const previewerWidth = '274px';
export const APPLICATION_OBJECT_TYPE = 78;
export const APPLICATION_OBJECT_SUBTYPE = 0x4e00;

export default CONSTANTS