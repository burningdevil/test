import * as _ from 'lodash';
import { LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION, LIBRARY_SERVER_SUPPORT_INSIGHTS_CONTROL, LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION, LIBRARY_SUPPORT_GRANULAR_CONTROL } from '../../utils';
import { t } from '../../i18n/i18next';
import { ICON_KEY_ENUM } from './views/home-screen-components/icon-key-enum';

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
    PROJECT_NAME: 'projectName',
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
    TOOLBAR_MODE: 'toolbarMode', // hide toolbar by default
    TOOLBAR_ENABLED: 'toolbarEnabled',
    DEFAULT_GROUPS_NAME: 'defaultGroupsName',
    CONTENT_BUNDLES: 'contentBundles',
    AUTHENTICATION_MODES: 'authModesDisplay',
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
    CACHE_SMART_DOWNLOAD: 'smart_download',
    //Config Constants
    DEFAULT_NETWORK_TIMEOUT: 180,
    UPDATE_INTERVAL_DISABLED: -1,
    DEFAULT_MAX_LOG_SIZE: 500,
    DEFAULT_UPDATE_INTERVAL: 30,
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
    ICON_MY_SUBSCRIBE: 'subscriptions',
    ICON_CONTENT_DISCOVERY: 'content_discovery',
    ICON_HOME: 'home',
    ICON_FULL_SCREEN: 'fullScreen',
    ICON_NEW_DOSSIER: 'new_dossier',
    ICON_EDIT_DOSSIER: 'edit_dossier',
    ICON_ADD_LIBRARY: 'add_library_server',
    ICON_SWITCH_LIBRARY: 'switch_library_server',
    ICON_UNDO_REDO: 'undo_and_redo',
    ICON_INSIGHT_LIST: 'insights',

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
    FONT_DATA_SEARCH: 'icon-search_tb_box',
    FONT_HYPER: 'icon-hyper',
    FONT_AA_FONT: 'icon-aa_font',
    FONT_ALL: 'icon-group_all',
    FONT_FAV: 'icon-home_favorite_i',
    FONT_RECENT: 'icon-clock-lines',
    FONT_DEFAULT_GROUP: 'icon-group_groups',
    FONT_MY_GROUP: 'icon-group_groups',
    FONT_MY_CONTENT: 'icon-group_my-content',
    FONT_MY_SUBSCRIBE: 'icon-group_recents',
    FONT_ADD_NEW: 'icon-pnl_add-new',
    FONT_GROUP: 'icon-group_groups_a',
    FONT_DOSSIER: 'icon-dossier',
    FONT_DOCUMENT: 'icon-rsd-cover',
    FONT_CERTIFIED: 'iconCertified',
    FONT_MSG_INFO: 'icon-msg_info',
    FONT_NEW_DOSSIER: 'icon-tb_create_dossier',
    FONT_EDIT_DOSSIER: 'icon-info_edit',
    FONT_ADD_LIBRARY: 'icon-tb_create_dossier',
    FONT_UNDO_REDO: 'icon-tb_undo',
    FONT_REDO: 'icon-tb_redo',
    FONT_SIDEBAR_PREVIEW_TABLET: 'icon-sidebar_preview_tablet',
    FONT_INSIGHT_LIST: 'icon-watchlist',
    FONT_CONTENT_DISCOVERY: 'icon-content_discovery',
    FONT_SIDEBAR_DOWNLOADS: 'icon-pnl_commentpage',
    FONT_CONTENT_CREATOR: 'icon-tb_profile_n',
    FONT_MODIFIED_DATE: 'icon-clock-lines',
    FONT_INFO_WINDOW: 'icon-home_info',

    // preview use only
    FONT_HOME: 'icon-tb_home',
    FONT_DESK_HOME: 'icon-tb_hamburger',
    FONT_PREVIEWSIDEBAR: 'icon-library',
    FONT_PREVIEWSIDEBAR_MOBILE: 'icon-backarrow',
    FONT_PREVIEWSIDEBAR_TABLET: 'icon-sidebar_preview_tablet',
    FONT_PREVIEWTOC: 'icon-tb_undoarrow',
    FONT_PREVIEWOPTIONS: 'icon-user-profile',
    FONT_FULLSCREEN: 'icon-fullscreen',
    FONT_FULLSCREEN_TABLET: 'icon-v-down',
    FONT_LIBRARY_MOBILE: 'icon-tb_appicon',
    FONT_ERROR: 'icon-error',

    // mobile appearance preview font codes
    MOBILE_FONT_LIST_VIEW: 'mobile-icon-list_view_ios',
    MOBILE_AA_FONT: 'mobile-icon-aa',
    MOBILE_CONTEXT_MENU: 'mobile-icon-context_menu',

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
    CUSTOMEMAILSETTINGS: 'customEmailSettings',
    ENVIRONMENT_CONNECTION_SETTINGS: 'environmentConnectionSettings',

    BACK: 'back',
    GENERATE: 'Generate',
    JSONFILE_SUFFIX: '.json',
    CONFIG_PROJECT: '38A062302D4411D28E71006008960167',

    // ObjectEditor Type
    CONFIG_EDITOR_OBJTYPE: "HomeScreenConfig",
    CONTENT_GROUP_OBJTYPE: "ContentBundle",
    APPEARANCE_OBJ_TYPE: 'Appearance',

    BASE_URL: 'baseUrl',
    SELECTED_APPLICATION: 'selectedApplication'
};

export const featureFlag = {
    platformEnable: true,
};

export const reviewType = {
    TABLET: 'Tablet',
    PHONE: 'Phone',
    DESKTOP: 'Desktop',
    WEB: 'Web',
};

export const platformType = {
    mobile: 'mobile',
    web: 'web',
    desktop: 'desktop',
};

export const EnumDSSXMLViewMedia = {
    DssXmlViewMediaViewStatic: 0x00000001,
    DssXmlViewMediaViewAnalysis: 0x00000800,
    DssXmlViewMediaHTML5Dashboard: 0x00002000,
};

export const DossierViewMediaList = [1610612736, 1879048192];
export const DocumentViewMediaList = [
    536870912, 402653184, 268435456, 134217728,
];

export enum HomeScreenHomeObjectType {
    DOCUMENT = 'Document',
    DOSSIER = 'Dossier',
}

export enum BundleRecipientType {
    NONE = 'None',
    USER = 'User',
    GROUP = 'Group',
    BOTH = 'Both',
}

// toolbar icon [display text, icon-name, key]
export interface iconDetail {
    displayText: string;
    iconName: string;
    key: string;
    expandable?: boolean;
}

export interface BundleRecipient {
    id: string;
    group: boolean;
    name: string;
}
export interface BundleOwner {
    id: string;
    name: string;
}
export interface BundleInfo {
    color: number;
    opacity: number;
    emailEnabled: boolean;
    id: string;
    name: string;
    dateCreated: string;
    dateModified: string;
    owner: BundleOwner;
    type: number;
    recipients: BundleRecipient[];
    recipientStr: string; //eg: 2 users and 2 groups
    expand: boolean;
    recipientType: number;
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
    NAVBAR_CONTENT_BUNDLES: t('content'),
    NAVBAR_MORE_SETTINGS: t('moreSettings'),
    NAVBAR_CUSTOM_EMAIL_SETTINGS: t('customEmailSettings'),
    NAVBAR_ENVIRONMENT_CONNECTION_SETTINGS: t('environmentConnectionSettings'),
    CANCEL: t('cancel'),
    SAVE: t('save'),
    ERR_APP_SAVE: t('errAppSave'),
    ERR_APP_LOAD: t('errAppLoad'),
    ERR_APP_DELETE: t('errAppDelete'),
    ERR_PALETTE_DELETE: t('errPaletteDelete'),
    AND: t('andStr'),

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
    ERR_EDITOR_OPEN: t('errEditorOpen'),
    ERR_SESSION_OUT: t('errSessionOut'),
    COPY_LINK: t('copyLink'),
    DOWNLOAD_JSON: t('downloadJson'),
    LINK_COPIED: t('linkCopied'),
    ERR_LINK_COPY: t('errCopyLink'),
    EDIT: t('edit'),
    DELETE: t('delete'),
    DUPLICATE: t('duplicate'),
    DEFAULT: t('default'),
    NEW_APP_BTN_TEXT: t('newApplicationBtn'),
    NEW_APP_TEXT: t('newApplication'),
    DEFAULT_APP_NAME: t('defaultApplicationName'),
    HOME: t('home'),
    BUNDLE_USER_HINT: t('bundleUserHint'),
    DATE_MODIFIED: t('dateModified'),
    DATE_CREATED: t('dateCreated'),
    LIBRARY: t('library'),
    DOSSIER: t('dossier'),
    DOCUMENT: t('document'),
    SELECT: t('select'),
    SELECT_CONTENT_BUNDLES: t('selectContentBundles'),
    SEARCH: t('search'),
    SORT_BY: t('sortBy'),
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
    PROPERTIES: t('properties'),
    INVALID_COLOR_PALETTE_NAME_ERROR: t('invalidPaletteNameError'),

    // Dossier Setting Strings
    COLOR_PALETTE: t('colorPalette'),
    ENABLE_MICORSTRATEGY_COLOR_PALETTE_DESC: t(
        'enableMicroStrategyColorPaletteDesc'
    ),
    ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP: t(
        'enableMicroStrategyColorPaletteTooltip'
    ),
    CUSTOM_COLOR_PALETTE_TITLE: t('customColorPaletteTitle'),
    CUSTOM_COLOR_PALETTE_TAB_DESC: t('colorPaletteTabDesc'),
    NEW_COLOE_PALETTE: t('newColorPalette'),
    EMPTY_COLOR_PALETTE_LIST_HINT: t('emptyColorPaletteListHint'),
    USE_NEW_COLOR_PALETTE_DESC: t('useNewColorPaletteDesc'),
    USE_PREVIOUS_COLOR_PALETTE_DESC: t('usePreviousColorPaletteDesc'),
    CUSTOM_COLOR_PALETTE_DESC: t('customColorPaletteDesc'),
    DEFAULT_COLOR_PALETTE_TITLE: t('defaultColorPaletteTitle'),
    DEFAULT_COLOR_PALETTE_TOOLTIP: t('defaultColorPaletteTooltip'),
    ADD_CUSTOM_COLOR_PALETTES: t('addCustomColorPalettes'),
    // Error Message Strings
    ENVIRONTMENT_DISCONNECT_ERROR_TITLE_MSG: t(
        'environmentDisconnectErrorTitleMsg'
    ),
    ENVIRONTMENT_DISCONNECT_ERROR_DETAIL_MSG: t(
        'environmentDisconnectErrorDetailMsg'
    ),
    USER_PRIVILEGE_ERROR_MSG: t('userPrivilegeErrorMsg'),
    MD_VERSION_ERROR_MSG: t('mdVersionErrorMsg'),
    SERVER_VERSION_ERROR_TITLE_MSG: t('serverVersionErrorTitleMsg'),
    SERVER_VERSION_ERROR_DETAIL_MSG: t('serverVersionErrorDetailMsg'),
    ISERVER_VERSION_ERROR_DETAIL_MSG: t('iServerVersionErrorDetailMsg'),
    CONFIRM_DELETE_DIALOG_MSG_TITLE: t('confirmDeleteDialogMsgTitle'),
    CONFIRM_DELETE_DIALOG_MSG_DETAIL: t('confirmDeleteDialogMsgDetail'),
    CONFIRM_CANCEL_DIALOG_MSG_TITLE: t('confirmCancelDialogMsgTitle'),
    CONFIRM_CANCEL_DIALOG_MSG_DETAIL: t('confirmCancelDialogMsgDetail'),
    YES: t('yes'),
    NO: t('no'),
    NO_DATA_MESSAGE: t('noDataMessage'),
    DISABLE_TOOLBAR_TOOLTIP: t('disableToolbarTooltip'),
    DISABLE_SIDEBAR_TOOLTIP: t('disableSidebarTooltip'),
    DISABLE_ACCOUNT_TOOLTIP: t('disableAccountTooltip'),
    PLATFORM_SPECIFIC: t('platformSpecific'),
    ADD_CONTENT_BUNDLE_TIP_MSG: t('addContentBundleTipMsg'),
    ALLOW_USERS_VIEW_ALL_CONTENT_MSG: t('allowUsersViewAllContentMsg'),
    LIMIT_USERS_VIEW_ALL_CONTENT_MSG: t('limitUsersViewAllContentMsg'),
    ALLOW_USERS_VIEW_ALL_CONTENT_TIP: t('allowUsersViewAllContentTip'),
    ALLOW_USERS_VIEW_ALL_CONTENT_TIP2: t('allowUsersViewAllContentTip2'),
    DISABLE_NEW_DOSSIER_TOOLTIP: t('disableNewDossierTooltip'),
    DISABLE_EDIT_DOSSIER_TOOLTIP: t('disableEditDossierTooltip'),
    DISABLE_NEW_DOSSIER_TOOLTIP_CONTENT: t('disableNewDossierTooltipContent'),
    DISABLE_CONTENT_DISCOVERY_TOOLTIP: t('disableContentDiscoveryTooltip'),
    PROJECT_NAME: t('project'),
    CONTINUE: t('continue'),
    OK: t('ok'),
    PALETTE: t('palette'),
    NEW_PALETTE_DEFAULT_NAME: t('newPaletteDefaultName'),
    ADD_CUSTOM_COLOR_PALETTE_MESSAGE: t('addCustomColorPalettesMessage'),
    PALETTE_COUNT: t('paletteCount'),
    AUTH_MODES: t('authModes'),
    FOLLOW_LIBRARY_SERVER: t('followLibraryServer'),
    USE_EXIST_SERVER_LEVEL_AUTH: t('useExistServerLevelAuth'),
    USE_SPECIFIC_AUTH: t('useSpecificAuth'),
    SET_AS_DEFAULT: t('setAsDefaultAuth'),
    DEFAULT_AUTH: t('defaultAuth'),
    STANDARD: t('standard'),

    // Appearance Editor strings
    PAGE_NAME: t('pageName'),
    NOTIFICATION_PANEL: t('notificationPanel'),
    NOTIFICATIONS: t('notifications'),
    SAMPLE_NOTIFICATION_TITLE_1: t('sampleNotificationTitle1'),
    SAMPLE_NOTIFICATION_TITLE_2: t('sampleNotificationTitle2'),
    SAMPLE_NOTIFICATION_SUBTITLE_1: t('sampleNotificationSubtitle1'),
    SAMPLE_NOTIFICATION_SUBTITLE_2: t('sampleNotificationSubtitle2'),
    ACCEPT: t('accept'),
    IGNORE: t('ignore'),
    CLOSE: t('close'),
    CLEAR_ALL: t('clearAll'),
    DOSSIER_NAME: t('dossierName'),
    FAVORITES: t('favorites'),
    ALL: t('all'),

    // Environment Connection strings
    ENVIRONMENT_WS_NAME_TOOLTIP: t('nameInWorkstation'),
    ENVIRONMENT_CONNECTION_SETTINGS_DESC: t('environmentConnectionSettingsDesc'),
    ENVIRONMENT_CONNECTION_AVAILABLE_ENVS_DESC: t('environmentConnectionAvailableEnvsDesc'),
    CURRENT_ENV_LABEL: t('currentEnvLabel'),
    URL: t('url'),
    APPLICATION: t('application'),
    REFRESH: t('refresh'),
    EMPTY_AVAILABLE_ENVS_MSG: t('emptyAvailableEnvsMsg'),
    AVAILABLE_ENVS_INFO_MSG: t('availableEnvsInfoMsg'),
    CONNECT_TO_ENV_MSG: t('pleaseConnectToEnv'),
    CUSTOM_APPS_NOT_SUPPORTED_MSG: t('customAppsNotSupported'),
    CURRENT_APP_DELETED_LABEL: t('applicationDeleted'),
    CURRENT_APP_LIMITED_ACCESS_LABEL: t('accessLimited'),
    CURRENT_APP_DELETED_TOOLTIP: t('applicationDeletedTooltip'),
    CURRENT_APP_LIMITED_ACCESS_TOOLTIP: t('accessLimitedTooltip'),
    CURRENT_APPLICATION: t('currentApplication'),

    INSIGHTS_WEB_ONLY: t('insightsWebOnly'),
    CONTENT_INFO: t('contentInfo'),
    INVALID_EMAIL_ADDRESS: t('invalidEmailAddress'),
    DISABLE_ADD_LIBRARY_TIP: t('disableAddLibraryTip')
};

export const sectionTitle = {
    GLOBAL: t('globalSettings'),
    DESC: t('mobileOnlyDesc'),
    SECURITY: t('security'),
    ACCESS: t('access'),
    FEEDBACK: t('send_email'),
    CONNECTIVITY: t('connectivity'),
    LOGGING: t('logging'),
    CACHE: t('cache'),
};
export const sectionFeedback = {
    FEEDBACK_REPORT_EMAIL: t('feedbackReportEmail'),
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
    SMART_DOWNLOAD: t('smartDownloadCheckbox')
};

export const metricStr = {
    HOUR: t('hour'),
    HOURS: t('hours'),
    SECOND: t('second'),
    SECONDS: t('seconds'),
    ENTRY: t('item'),
    ENTRIES: t('items'),
};

export const customEmailStringDict = {
    'title': t('customEmailTitle'),
    'desc': t('customEmailDesc'),
    'formGroup': {
        'emailSender': {
            'title': t('emailSender'),
            'labelName': t('emailSenderDisplayName'),
            'labelAddress': t('emailSenderAddress'),
            'placeholder': 'library@microstrategy.com',
            'defaultName': 'MicroStrategy Library'
        },
        'image': {
            'title': t('customEmailImage'),
            'label': t('showBrandImage'),
            'brandImageTitle': t('brandingImageTitle'),
            'brandImageLabel': t('brandImageLabel'),
            'brandImageUrl': t('brandImageUrl'),
            'invalidImageAddressTip': t('invalidImageAddressTip')
        },
        'actionButton': {
            'title': t('actionButton'),
            'label1': t('showButton1'),
            'label2': t('hostWebPortal'),
            'label3': t('showButton2'),
            'placeholder': t('hostWebPortalPlaceholder'),
            'hostTooltip': t('hostPortalTooltip'),
            'hostInvalidTip': t('hostInvalidTip'),
            'portalLinkNotInWhiteListMsg': t('portalLinkNotInWhiteListMsg'),
            'portalLinkNotInWhiteListTip1': t('portalLinkNotInWhiteListTip1'),
            'portalLinkNotInWhiteListTip2': t('portalLinkNotInWhiteListTip2'),
            'portalLinkAclForbiddenMsg': t('portalLinkAclForbiddenMsg'),
            'hostTooltipHelp': t('hostPortalHelp'),
            'showDescription': t('showDescription'),
            'descriptionDefaultStr': "'View in Mobile App' may not work for all mobile mail apps. Use 'View in Browser' option for such cases.",
            'button1': t('actionButton1'),
            'button1_default': 'View in Browser',
            'button2': t('actionButton2'),
            'button2_default': 'View in Mobile App',
            'button2Link': t('actionButton2Link'),
            'scheme_default': t('actionButtonSchemeTypeDefault'),
            'scheme_app': t('actionButtonSchemeTypeApp'),
            'scheme_universal': t('actionButtonSchemeTypeUni'),
        },
        'notificationReminder': {
            'title': t('notificationReminder'),
            'label': t('showReminder'),
            'tooltip': t('notificationReminderTooltip'),
            'labelReminder': t('reminder'),
            'reminderLinkText': t('reminderLinkText'),
            'defaultReminderLinkText': 'View Notification Center',
            'defaultReminder': 'Since you last checked, {&NewNotificationCount} notification has been sent to you.',
            'reminderMacroTip': t('reminderMacroTip'),
            'notificationMsgTip': t('notificationMsgTip'),
            'notificationLinkTip': t('notificationLinkTip')
        },
        'sentBy': {
            'title': t('sendBy'),
            'label1': t('showSentByInfo'),
            'label2': t('sendByOwner'),
            'defaultSender': t('senderDefault')

        },
        'socialMedia': {
            'title': t('socialMedia'),
            'label': t('showSocialMedia'),
            'fb': t('facebook'),
            'fb_default': "microstrategy",
            'fb_prefix': "https://facebook.com/",
            'placeholder': 'microstrategy',
            'twitter': t('twitter'),
            'twitter_default': 'microstrategy',
            'twitter_prefix': 'https://twitter.com/',
            'linked': t('linkedIn'),
            'linked_default': 'microstrategy',
            'linked_prefix': 'https://linkedin.com/',
            'yt': t('youTube'),
            'yt_default': 'microstrategy',
            'yt_prefix': 'https://youtube.com/'

        },
        'subjectAndBody': {
            'title': t('subjectAndBodyText'),
            'subsection1': {
                'title': t('shareDossierToTheRecipent'),
                'label1': t('subject'),
                'label2': t('bodyText'),
                'placeholder1': 'You have been invited to view {&DossierName} in your library',
                'placeholder2': 'Hi, {&RecipientName}! \r\n {&SenderName} shared {&DossierName} with you.'
            },
            'subsection2': {
                'title': t('shareDossierToTheRecipentWithBookmark'),
                'label1': t('subject'),
                'label2': t('bodyText'),
                'placeholder1': 'You have been invited to view {&DossierName} with shared bookmarks in your library',
                'placeholder2': 'Hi, {&RecipientName}! \r\n {&SenderName} shared {&DossierName} and {&BookmarkCount} bookmark with you.'
            },
            'subsection3': {
                'title': t('inviteOneRecipientDiscussion'),
                'label1': t('subject'),
                'label2': t('bodyText'),
                'placeholder1': 'You have been invited to a discussion',
                'placeholder2': 'Hi, {&RecipientName}! \r\n {&SenderName} invited you to a discussion in a dossier.'
            },
            'subsection4': {
                'title': t('mentionRecipientComment'),
                'label1': t('subject'),
                'label2': t('bodyText'),
                'placeholder1': 'You have been mentioned in a {&MentionTarget}',
                'placeholder2': 'Hi, {&RecipientName}! \r\n {&SenderName} mentioned you in a comment in {&DossierName}.'
            },
            'dossierTip': t('DossierNameTip'),
            'recipientNameTip': t('RecipientNameTip'),
            'senderNameTip': t('SenderNameTip'),
            'bookmarkCountTip': t('BookmarkCountTip'),
            'commentDiscussionTip': t('CommentDiscussionTip')
        }
    },
    'emptyValidTip': t('emptyValidTip'),
    'mobileLinkValidTip': t('mobileLinkValidTip'),
    'emailNameInvalidTip': t('invalidEmailName'),
    'emailAddressInvalidTip': t('invalidEmailAddress'),
    'sendPreview': t('sendPreview'),
    'featureFlag': t('disableCustomEmail'),
    'resetHeaderTip': t('resetTip')
}

export const tooltipStr = (min: string, max: string) => {
    return t('tooltipStr', { min, max });
};

export const selectedBundlesStr = (bundlesCount: number) => {
    return t('selectedStr', { bundlesCount });
};
export const copyApplicationName = (name: string) => {
    return t('copyApplicationName', { name });
};
export const closeWindowConfirmationStr = (name: string) => {
    return t('closeWindowConfirmationStr', { name });
};
export const paletteCountsStr = (count: number) => {
  return t('paletteCount', { count });
};
export const serverRestartStr = (icon: string) => {
    return t('serverRestartTip', { icon: icon})
}
export enum IconEnum {
    sidebar = 'sidebar',
    sortAndFilter  ='sortAndFilter',
    multiSelect = 'multiSelect',
    search = 'search',
    notification = 'notification',
    account = 'account',
    accountWeb = 'accountWeb',
    accountWebDossierHome = 'accountWebDossier',
    toc  = 'toc',
    bookmark = 'bookmark',
    reset = 'reset',
    filter = 'filter',
    comment = 'comment',
    share = 'share',
    dataSearch = 'dataSearch',
    hyper = 'hyper',
    aaFont = 'aaFont',
    all =  'all',
    favorites = 'favorites',
    recents = 'recents',
    defaultGroup = 'defaultGroup',
    myGroup = 'myGroup',
    myContent = 'myContent',
    mySubscribe = 'mySubscribe',
    contentDiscovery = 'contentDiscovery',
    sidebar_downloads = 'sidebarDownloads',
    accountMobile = 'accountMobile',
    accountMobileDossierHome  = 'accountMobileDossier',
    newDossier = 'newDossier',
    editDossier = 'editDossier',
    addLibrary = 'addLibrary',
    undoRedo = 'undoRedo',
    redo  = 'redo',
    insights = 'insights',
    home = 'home',
    deskHome = 'deskHome',
    previewSidebar = 'previewSidebar',
    previewLibraryWeb = 'previewLibraryWeb',
    previewLibraryMobile  = 'previewLibraryMobile',
    previewSidebarMobile = 'previewSidebarMobile',
    previewSidebarTablet = 'previewSidebarTablet',
    previewAccountMobile = 'previewAccountMobile',
    previewTocPhone =  'previewTocPhone',
    previewFullScreen = 'previewFullScreen',
    previewFullScreenTablet = 'previewFullScreenTablet',
    previewListViewMobile = 'previewListViewMobile',
    previewAaFontMobile = 'previewAaFontMobile',
    previewContextMenuMobile = 'previewContextMenuMobile',
    // new added from the US388075, will use the a_b_c to indicate the level relation
    // account mobile
    mobile_userName = 'mobile_userName',
    mobile_preferences = 'mobile_preferences',
    mobile_preferences_myLanguage = 'mobile_preferences_myLanguage',
    mobile_preferences_myTimeZone = 'mobile_preferences_myTimeZone',
    mobile_preferences_myCalendar = 'mobile_preferences_myCalendar',
    mobile_preferences_faceIDLogin = 'mobile_preferences_faceIDLogin',
    mobile_preferences_takeATour = 'mobile_preferences_takeATour',
    mobile_preferences_refreshViewAutomatically = 'mobile_preferences_refreshViewAutomatically',
    mobile_preferences_smartDownload = 'mobile_preferences_smartDownload',
    mobile_preferences_automaticallyAddToLibrary = 'mobile_preferences_automaticallyAddToLibrary',

    mobile_advancedSettings = 'mobile_advancedSettings',
    mobile_advancedSettings_appSettings = 'mobile_advancedSettings_appSettings',
    mobile_advancedSettings_securitySettings = 'mobile_advancedSettings_securitySettings',
    mobile_advancedSettings_logging  ='mobile_advancedSettings_logging',

    mobile_helpAndLegal = 'mobile_helpAndLegal',
    mobile_helpAndLegal_help = 'mobile_helpAndLegal_help',
    mobile_helpAndLegal_legal = 'mobile_helpAndLegal_legal',
    mobile_helpAndLegal_reportProblem = 'mobile_helpAndLegal_reportProblem',

    mobile_logOut = 'mobile_logOut',
    // new added by account web and desktop
    web_userName = 'web_userName',
    web_myLibraries = 'web_myLibraries',
    web_manageLibrary = 'web_manageLibrary',
    web_preferences = 'web_preferences',
    web_preferences_myLanguage = 'web_preferences_myLanguage',
    web_preferences_myTimeZone = 'web_preferences_myTimeZone',
    web_preferences_myCalendar = 'web_preferences_myCalendar',
    web_switchWorkspace = 'web_switchWorkspace',
    web_takeATour = 'web_takeATour',
    web_help = 'web_help',
    web_logOut = 'web_logOut',

    // new added by share
    share_share = 'share_share',
    share_exportToExcel = 'share_exportToExcel',
    share_exportToPDF = 'share_exportToPDF',
    share_download  = 'share_download',
    share_subscribe = 'share_subscribe',
    share_annotate = 'share_annotate',
    // new added by content info
    contentCreator = 'contentCreator',
    modifiedDate = 'modifiedDate',
    infoWindow = 'infoWindow',
    // new added in the dossier window
    filterSummary = 'filter_summary',
    toc_header = 'toc_header',
    toc_contentinfo = 'toc_contentinfo',
    toc_chapter = 'toc_chapter',
    switch_library = 'switch_library'


}

export enum TAGS {
  share = 'share',
  action = 'action',
  info = 'info',
}

export interface IconType {
    displayText: string;
    iconName: string;
    tag?: TAGS[];
    key: string;
    supportTip?: boolean;
    tipMsg?: string;
    deps?: string[];
}
export type IconTypes = {
    [key in IconEnum]: IconType;
}
export const REVERSE = '!';
export const iconTypes: IconTypes = {
    [IconEnum.sidebar]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_SIDEBAR,
        key: CONSTANTS.ICON_SIDEBAR,
        tag: [TAGS.action],
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_SIDEBAR],
        tipMsg: localizedStrings.DISABLE_SIDEBAR_TOOLTIP,
    },
    [IconEnum.sortAndFilter]: {
        displayText: t('librarySortFilter'),
        iconName: CONSTANTS.FONT_SORT_FILTER,
        tag: [TAGS.info],
        key: CONSTANTS.ICON_SORT_FILTER,
    },
    [IconEnum.multiSelect]: {
        displayText: t('multiSelect'),
        iconName: CONSTANTS.FONT_MULTI_SELECT,
        key: CONSTANTS.ICON_MULTI_SELECT,
    },
    [IconEnum.search]: {
        displayText: t('search'),
        iconName: CONSTANTS.FONT_SEARCH,
        tag: [TAGS.info],
        key: CONSTANTS.ICON_SEARCH,
    },
    [IconEnum.notification]: {
        displayText: t('notification'),
        iconName: CONSTANTS.FONT_NOTIFICATIONS,
        tag: [TAGS.info],
        key: CONSTANTS.ICON_NOTIFICATIONS,
    },
    [IconEnum.account]: {
        displayText: t('account'),
        iconName: CONSTANTS.FONT_OPTIONS,
        key: CONSTANTS.ICON_OPTIONS,
    },
    [IconEnum.accountWeb]: {
        displayText: t('accountWeb'),
        iconName: CONSTANTS.FONT_OPTIONS,
        key: CONSTANTS.ICON_OPTIONS + '__web',
        supportTip: false, // maybe enabled in the future.
        deps: [
            REVERSE + CONSTANTS.ICON_SIDEBAR,
            REVERSE + CONSTANTS.ICON_OPTIONS + '__web',
        ],
        tipMsg: localizedStrings.DISABLE_ACCOUNT_TOOLTIP,
    },
    [IconEnum.accountWebDossierHome]: {
        displayText: t('webAndDesktop'),
        iconName: '',
        key: ICON_KEY_ENUM.account_web_dossier_home,
    },
    [IconEnum.toc]: {
        displayText: t('toc'),
        iconName: CONSTANTS.FONT_TOCS,
        key: CONSTANTS.ICON_TOCS,
    },
    [IconEnum.bookmark]: {
        displayText: t('bookmark'),
        iconName: CONSTANTS.FONT_BOOKMARK,
        key: CONSTANTS.ICON_BOOKMARK,
    },
    [IconEnum.reset]: {
        displayText: t('reset'),
        iconName: CONSTANTS.FONT_RESET,
        key: CONSTANTS.ICON_RESET,
    },
    [IconEnum.filter]: {
        displayText: t('filter'),
        iconName: CONSTANTS.FONT_FILTER,
        key: CONSTANTS.ICON_FILTER,
    },
    [IconEnum.filterSummary]: {
        displayText: t('filterSummary'),
        iconName: CONSTANTS.FONT_FILTER,
        deps: [REVERSE + CONSTANTS.ICON_FILTER],
        key: ICON_KEY_ENUM.filter_summary,
    },
    [IconEnum.comment]: {
        displayText: t('comments'),
        iconName: CONSTANTS.FONT_COMMENTS,
        key: CONSTANTS.ICON_COMMENTS,
    },
    [IconEnum.share]: {
        displayText: t('share'),
        iconName: CONSTANTS.FONT_SHARE,
        key: CONSTANTS.ICON_SHARE,
    },
    // platform specified
    [IconEnum.dataSearch]: {
        displayText: t('dataSearchText'),
        iconName: CONSTANTS.FONT_DATA_SEARCH,
        key: CONSTANTS.ICON_DATA_SEARCH,
    },
    [IconEnum.hyper]: {
        displayText: t('hyperIconText'),
        iconName: CONSTANTS.FONT_HYPER,
        key: CONSTANTS.ICON_HYPER,
    },
    [IconEnum.aaFont]: {
        displayText: t('fontIconText'),
        iconName: CONSTANTS.FONT_AA_FONT,
        key: CONSTANTS.ICON_AA_FONT,
    },
    // sidebar children
    [IconEnum.all]: {
        displayText: t('all'),
        iconName: CONSTANTS.FONT_ALL,
        key: CONSTANTS.ICON_ALL,
    },
    [IconEnum.favorites]: {
        displayText: t('favorites'),
        iconName: CONSTANTS.FONT_FAV,
        key: CONSTANTS.ICON_FAV,
    },
    [IconEnum.recents]: {
        displayText: t('recents'),
        iconName: CONSTANTS.FONT_RECENT,
        key: CONSTANTS.ICON_RECENENT,
    },
    [IconEnum.defaultGroup]: {
        displayText: t('defaultGroups'),
        iconName: CONSTANTS.FONT_DEFAULT_GROUP,
        key: CONSTANTS.ICON_DEFAULT_GROUP,
    },
    [IconEnum.myGroup]: {
        displayText: t('myGroup'),
        iconName: CONSTANTS.FONT_MY_GROUP,
        key: CONSTANTS.ICON_MY_GROUP,
    },
    [IconEnum.myContent]: {
        displayText: t('myContent'),
        iconName: CONSTANTS.FONT_MY_CONTENT,
        key: CONSTANTS.ICON_MY_CONTENT,
    },
    [IconEnum.mySubscribe]: {
        displayText: t('mySubscribe'),
        iconName: CONSTANTS.FONT_MY_SUBSCRIBE,
        key: CONSTANTS.ICON_MY_SUBSCRIBE,
    },
    [IconEnum.contentDiscovery]: {
        displayText: t('contentDiscovery'),
        iconName: CONSTANTS.FONT_CONTENT_DISCOVERY,
        key: CONSTANTS.ICON_CONTENT_DISCOVERY,
        supportTip: true,
        tipMsg: localizedStrings.DISABLE_CONTENT_DISCOVERY_TOOLTIP,
    },
    [IconEnum.sidebar_downloads]: {
        displayText: t('sidebar_downloads'),
        iconName: CONSTANTS.FONT_SIDEBAR_DOWNLOADS,
        key: ICON_KEY_ENUM.sidebar_downloads,
    },
    [IconEnum.accountMobile]: {
        displayText: t('accountMobile'),
        iconName: CONSTANTS.FONT_OPTIONS,
        key: CONSTANTS.ICON_OPTIONS + '__mobile',
    },
    [IconEnum.accountMobileDossierHome]: {
        displayText: t('mobile'),
        iconName: '',
        key: ICON_KEY_ENUM.account_mobile_dossier_home,
    },
    [IconEnum.newDossier]: {
        displayText: t('newDossier'),
        iconName: CONSTANTS.FONT_NEW_DOSSIER,
        key: CONSTANTS.ICON_NEW_DOSSIER,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_NEW_DOSSIER],
        tipMsg: localizedStrings.DISABLE_NEW_DOSSIER_TOOLTIP,
    },
    [IconEnum.editDossier]: {
        displayText: t('editDossier'),
        iconName: CONSTANTS.FONT_EDIT_DOSSIER,
        key: CONSTANTS.ICON_EDIT_DOSSIER,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_EDIT_DOSSIER],
        tipMsg: localizedStrings.DISABLE_EDIT_DOSSIER_TOOLTIP,
    },
    [IconEnum.addLibrary]: {
        displayText: t('addLibrary'),
        iconName: CONSTANTS.FONT_ADD_LIBRARY,
        key: CONSTANTS.ICON_ADD_LIBRARY,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_SWITCH_LIBRARY],
        tipMsg: localizedStrings.DISABLE_ADD_LIBRARY_TIP,
    },
    [IconEnum.undoRedo]: {
        displayText: t('undoRedo'),
        iconName: CONSTANTS.FONT_UNDO_REDO,
        key: CONSTANTS.ICON_UNDO_REDO,
    },
    [IconEnum.redo]: {
        displayText: t('undoRedo'),
        iconName: CONSTANTS.FONT_REDO,
        key: CONSTANTS.ICON_UNDO_REDO,
    },
    [IconEnum.insights]: {
        displayText: t('insights'),
        iconName: CONSTANTS.FONT_INSIGHT_LIST,
        key: CONSTANTS.ICON_INSIGHT_LIST,
    },
    //// for preview. Localization not needed.
    // home button
    [IconEnum.home]: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_HOME,
        key: CONSTANTS.ICON_HOME,
    },
    [IconEnum.deskHome]: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_DESK_HOME,
        key: CONSTANTS.ICON_HOME,
    },
    // stands for 'sidebar' in library
    [IconEnum.previewSidebar]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    // stands for 'library' in dossier
    [IconEnum.previewLibraryWeb]: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR,
        key: CONSTANTS.ICON_HOME,
    },
    [IconEnum.previewLibraryMobile]: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_LIBRARY_MOBILE,
        key: CONSTANTS.ICON_HOME,
    },
    // phone sidebar
    [IconEnum.previewSidebarMobile]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_MOBILE,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    // tablet sidebar
    [IconEnum.previewSidebarTablet]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_TABLET,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    [IconEnum.previewAccountMobile]: {
        displayText: t('account'),
        iconName: CONSTANTS.FONT_PREVIEWOPTIONS,
        key: CONSTANTS.ICON_OPTIONS + '_mobile',
    },
    [IconEnum.previewTocPhone]: {
        displayText: t('toc'),
        iconName: CONSTANTS.FONT_PREVIEWTOC,
        key: CONSTANTS.ICON_TOCS,
    },
    [IconEnum.previewFullScreen]: {
        displayText: 'Full Screen',
        iconName: CONSTANTS.FONT_FULLSCREEN,
        key: CONSTANTS.ICON_FULL_SCREEN,
    },
    [IconEnum.previewFullScreenTablet]: {
        displayText: 'Full Screen',
        iconName: CONSTANTS.FONT_FULLSCREEN_TABLET,
        key: CONSTANTS.ICON_FULL_SCREEN,
    },
    [IconEnum.previewListViewMobile]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.MOBILE_FONT_LIST_VIEW,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    [IconEnum.previewAaFontMobile]: {
        displayText: t('fontIconText'),
        iconName: CONSTANTS.MOBILE_AA_FONT,
        key: CONSTANTS.ICON_AA_FONT,
    },
    [IconEnum.previewContextMenuMobile]: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.MOBILE_CONTEXT_MENU,
        key: CONSTANTS.ICON_SIDEBAR
    },
    // US388075; add more granular control;
    [IconEnum.mobile_userName]: {
        displayText: t('userName'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_userName,
    },
    [IconEnum.mobile_preferences]: {
        displayText: t('mobile_preferences'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences,
    },
    [IconEnum.mobile_preferences_myLanguage]: {
        displayText: t('mobile_preferences_myLanguage'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_myLanguage,
    },
    [IconEnum.mobile_preferences_myTimeZone]: {
        displayText: t('mobile_preferences_myTimeZone'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_myTimeZone,
    },
    [IconEnum.mobile_preferences_myCalendar]: {
        displayText: t('mobile_preferences_myCalendar'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_myCalendar,
    },
    [IconEnum.mobile_preferences_faceIDLogin]: {
        displayText: t('mobile_preferences_faceIDLogin'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_faceIDLogin,
    },
    [IconEnum.mobile_preferences_takeATour]: {
        displayText: t('mobile_preferences_takeATour'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_takeATour,
    },
    [IconEnum.mobile_preferences_refreshViewAutomatically]: {
        displayText: t('mobile_preferences_refreshViewAutomatically'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_refreshViewAutomatically,
    },
    [IconEnum.mobile_preferences_smartDownload]: {
        displayText: t('mobile_preferences_smartDownload'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_smartDownload,
    },
    [IconEnum.mobile_preferences_automaticallyAddToLibrary]: {
        displayText: t('mobile_preferences_automaticallyAddToLibrary'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_preferences_automaticallyAddToLibrary,
    },
    [IconEnum.mobile_advancedSettings]: {
        displayText: t('mobile_advancedSettings'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_advancedSettings,
    },
    [IconEnum.mobile_advancedSettings_appSettings]: {
        displayText: t('mobile_advancedSettings_appSettings'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_advancedSettings_appSettings,
    },
    [IconEnum.mobile_advancedSettings_securitySettings]: {
        displayText: t('mobile_advancedSettings_securitySettings'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_advancedSettings_securitySettings,
    },
    [IconEnum.mobile_advancedSettings_logging]: {
        displayText: t('mobile_advancedSettings_logging'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_advancedSettings_logging,
    },
    [IconEnum.mobile_helpAndLegal]: {
        displayText: t('mobile_helpAndLegal'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_helpAndLegal,
    },
    [IconEnum.mobile_helpAndLegal_help]: {
        displayText: t('mobile_helpAndLegal_help'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_helpAndLegal_help,
    },
    [IconEnum.mobile_helpAndLegal_legal]: {
        displayText: t('mobile_helpAndLegal_legal'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_helpAndLegal_legal,
    },
    [IconEnum.mobile_helpAndLegal_reportProblem]: {
        displayText: t('mobile_helpAndLegal_reportProblem'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_helpAndLegal_reportProblem,
    },
    [IconEnum.mobile_logOut]: {
        displayText: t('mobile_logOut'),
        iconName: '',
        key: ICON_KEY_ENUM.mobile_logOut,
    },
    [IconEnum.web_userName]: {
        displayText: t('userName'),
        iconName: '',
        key: ICON_KEY_ENUM.web_userName,
    },
    [IconEnum.web_myLibraries]: {
        displayText: t('web_myLibraries'),
        iconName: '',
        key: ICON_KEY_ENUM.web_myLibraries,
    },
    [IconEnum.web_manageLibrary]: {
        displayText: t('web_manageLibrary'),
        iconName: '',
        key: ICON_KEY_ENUM.web_manageLibrary,
    },
    [IconEnum.web_preferences]: {
        displayText: t('web_preferences'),
        iconName: '',
        key: ICON_KEY_ENUM.web_preferences,
    },
    [IconEnum.web_preferences_myCalendar]: {
        displayText: t('web_preferences_myCalendar'),
        iconName: '',
        key: ICON_KEY_ENUM.web_preferences_myCalendar,
    },
    [IconEnum.web_preferences_myLanguage]: {
        displayText: t('web_preferences_myLanguage'),
        iconName: '',
        key: ICON_KEY_ENUM.web_preferences_myLanguage,
    },
    [IconEnum.web_preferences_myTimeZone]: {
        displayText: t('web_preferences_myTimeZone'),
        iconName: '',
        key: ICON_KEY_ENUM.web_preferences_myTimeZone,
    },
    [IconEnum.web_switchWorkspace]: {
        displayText: t('web_switchWorkspace'),
        iconName: '',
        key: ICON_KEY_ENUM.web_switchWorkspace,
    },
    [IconEnum.web_takeATour]: {
        displayText: t('web_takeATour'),
        iconName: '',
        key: ICON_KEY_ENUM.web_takeATour,
    },
    [IconEnum.web_help]: {
        displayText: t('web_help'),
        iconName: '',
        key: ICON_KEY_ENUM.web_help,
    },
    [IconEnum.web_logOut]: {
        displayText: t('web_logOut'),
        iconName: '',
        key: ICON_KEY_ENUM.web_logOut,
    },
    [IconEnum.share_share]: {
        displayText: t('share_share'),
        iconName: 'icon-share_dossier',
        key: ICON_KEY_ENUM.share_share,
    },
    [IconEnum.share_exportToExcel]: {
        displayText: t('share_exportToExcel'),
        iconName: 'icon-share_excel',
        key: ICON_KEY_ENUM.share_exportToExcel,
    },
    [IconEnum.share_exportToPDF]: {
        displayText: t('share_exportToPDF'),
        iconName: 'icon-share_pdf',
        key: ICON_KEY_ENUM.share_exportToPDF,
    },
    [IconEnum.share_download]: {
        displayText: t('share_download'),
        iconName: 'icon-info_download',
        key: ICON_KEY_ENUM.share_download,
    },
    [IconEnum.share_subscribe]: {
        displayText: t('share_subscribe'),
        iconName: CONSTANTS.FONT_MY_SUBSCRIBE,
        key: ICON_KEY_ENUM.share_subscribe,
    },
    [IconEnum.share_annotate]: {
        displayText: t('annotate_share'),
        iconName: 'icon-share_dossier',
        key: ICON_KEY_ENUM.share_annotate,
    },
    [IconEnum.contentCreator]: {
        displayText: t('contentCreator'),
        iconName: CONSTANTS.FONT_CONTENT_CREATOR,
        key: ICON_KEY_ENUM.contentCreator,
    },
    [IconEnum.modifiedDate]: {
        displayText: t('modifiedDate'),
        iconName: CONSTANTS.FONT_MODIFIED_DATE,
        key: ICON_KEY_ENUM.modifiedDate,
    },
    [IconEnum.infoWindow]: {
        displayText: t('infoWindow'),
        iconName: CONSTANTS.FONT_INFO_WINDOW,
        key: ICON_KEY_ENUM.infoWindow,
    },
    [IconEnum.toc_header]: {
        displayText: t('toc_header'),
        iconName: '',
        key: ICON_KEY_ENUM.toc_header
    },
    [IconEnum.toc_contentinfo]: {
        displayText: t('toc_content_info'),
        iconName: '',
        key: ICON_KEY_ENUM.toc_content_info
    },
    [IconEnum.toc_chapter]: {
        displayText: t('toc_chapter'),
        iconName: '',
        key: ICON_KEY_ENUM.toc_chapter
    },
    [IconEnum.switch_library]: {
        displayText: t('switchLibrary'),
        iconName: CONSTANTS.FONT_ADD_LIBRARY,
        key: CONSTANTS.ICON_SWITCH_LIBRARY,
    },

};

/// for icon switch
// icons may appear in both library and dossier
// export const bothSideIcons = [iconTypes.notification, iconTypes.account]

// library icons when mode is Library as home
export const libraryIcons = [
    iconTypes.sidebar,
    iconTypes.sortAndFilter,
    iconTypes.search,
    iconTypes.newDossier,
    iconTypes.notification,
    iconTypes.multiSelect,
    iconTypes.accountWeb,
];

// dossier icons when mode is Library as home
export const dossierIcons = [
    iconTypes.toc,
    iconTypes.bookmark,
    iconTypes.reset,
    iconTypes.undoRedo,
    iconTypes.filter,
    iconTypes.filter_summary,
    iconTypes.comment,
    iconTypes.share,
    iconTypes.editDossier,
];

// dossier icons when mode is dossier as home
export const dossierIconsDossierHome = [
    iconTypes.switch_library,
    iconTypes.toc,
    iconTypes.bookmark,
    iconTypes.undoRedo,
    iconTypes.filter,
    iconTypes.filter_summary,
    iconTypes.comment,
    iconTypes.share,
    iconTypes.notification,
    iconTypes.account,
    iconTypes.editDossier,
];
// platform specific
export const platformSpecificIcons = [
    iconTypes.dataSearch,
    iconTypes.hyper,
    iconTypes.aaFont,
];
// content info
export const contentInfoIcons = [
    iconTypes.contentCreator,
    iconTypes.modifiedDate,
    iconTypes.infoWindow
]
// extra icons for specified platforms
export const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper];
export const extraMobileIcons = [iconTypes.aaFont];
// children icons for sidebar
// export const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup, iconTypes.accountMobile]
export const childrenIcons = [
    iconTypes.addLibrary,
    iconTypes.all,
    iconTypes.myContent,
    iconTypes.favorites,
    iconTypes.recents,
    iconTypes.insights,
    iconTypes.mySubscribe,
    iconTypes.contentDiscovery,
    iconTypes.sidebarDownloads,
    iconTypes.defaultGroup,
    iconTypes.myGroup,
    iconTypes.accountMobile,
    iconTypes.switch_library
];
// used by the Custom App Theme previewer to display a custom set of tabs
export const appearancePreviewSidebarIcons = [
    iconTypes.all,
    iconTypes.myContent,
    iconTypes.favorites,
    iconTypes.recents,
    iconTypes.insights,
    iconTypes.mySubscribe,
    iconTypes.defaultGroup,
    iconTypes.myGroup,
];

// for accountMobile and accountWeb to remove suffix
export const iconValidKey = (iconKey: string) =>
    iconKey?.split('__').length > 0 ? iconKey?.split('__')[0] : iconKey;

export const dossierIconKeys = dossierIcons.map((element) => element.key);
export const libraryIconKeys = libraryIcons.map((element) => element.key);
export const sidebarIconKeys = childrenIcons.map((element) => element.key);
export const platformSpecificIconKeys = platformSpecificIcons.map(
    (element) => element.key
);
export const granularControlNewAddedIcons = [
    // added by the granular control
    iconTypes.mobile_userName,
    iconTypes.mobile_preferences_myLanguage,
    iconTypes.mobile_preferences_myTimeZone,
    iconTypes.mobile_preferences_myCalendar,
    iconTypes.mobile_preferences_faceIDLogin,
    iconTypes.mobile_preferences_takeATour,
    iconTypes.mobile_preferences_refreshViewAutomatically,
    iconTypes.mobile_preferences_smartDownload,
    iconTypes.mobile_preferences_automaticallyAddToLibrary,
    iconTypes.mobile_advancedSettings_appSettings,
    iconTypes.mobile_advancedSettings_securitySettings,
    iconTypes.mobile_advancedSettings_logging,
    iconTypes.mobile_helpAndLegal,
    iconTypes.mobile_helpAndLegal_help,
    iconTypes.mobile_helpAndLegal_legal,
    iconTypes.mobile_helpAndLegal_reportProblem,
    iconTypes.mobile_logOut,
    iconTypes.filter_summary,
    iconTypes.share_share,
    iconTypes.share_exportToExcel,
    iconTypes.share_exportToPDF,
    iconTypes.share_download,
    iconTypes.share_subscribe,
    iconTypes.share_annotate,
    iconTypes.web_userName,
    iconTypes.web_myLibraries,
    iconTypes.web_manageLibrary,
    iconTypes.web_preferences,
    iconTypes.web_preferences_myCalendar,
    iconTypes.web_preferences_myLanguage,
    iconTypes.web_preferences_myTimeZone,
    iconTypes.web_switchWorkspace,
    iconTypes.web_takeATour,
    iconTypes.web_help,
    iconTypes.web_logOut,
    iconTypes.sidebarDownloads,
    iconTypes.accountMobileDossier,
    iconTypes.accountWebDossier,
    iconTypes.toc_header,
    iconTypes.toc_contentinfo,
    iconTypes.toc_chapter,
    iconTypes.switch_library
].concat(contentInfoIcons)
export const libraryCustomizedIcons = [
    iconTypes.myContent,
    iconTypes.mySubscribe,
    iconTypes.newDossier,
    iconTypes.editDossier,
    iconTypes.addLibrary,
    iconTypes.dataSearch,
    iconTypes.hyper,
    iconTypes.aaFont,
    iconTypes.undoRedo,
    iconTypes.insights,
    iconTypes.contentDiscovery,
].concat(granularControlNewAddedIcons);
export const libraryCustomizedIconKeys = libraryCustomizedIcons.map(
    (element) => element.key
);
// the default value is freezed once setup， pls don't change in the reference forcefully.
export const libraryCustomizedIconDefaultValues = Object.freeze({
    [iconTypes.myContent.key]: true,
    [iconTypes.mySubscribe.key]: true,
    [iconTypes.newDossier.key]: true,
    [iconTypes.editDossier.key]: true,
    [iconTypes.addLibrary.key]: true,
    [iconTypes.dataSearch.key]: true,
    [iconTypes.hyper.key]: true,
    [iconTypes.aaFont.key]: true,
    [iconTypes.undoRedo.key]: true,
    [iconTypes.insights.key]: true,
    [iconTypes.contentDiscovery.key]: false,
    // newly-added by granular control feature
    [iconTypes.mobile_userName.key]: true,
    [iconTypes.mobile_preferences_myLanguage.key]: true,
    [iconTypes.mobile_preferences_myTimeZone.key]: true,
    [iconTypes.mobile_preferences_myCalendar.key]: true,
    [iconTypes.mobile_preferences_faceIDLogin.key]: true,
    [iconTypes.mobile_preferences_takeATour.key]: true,
    [iconTypes.mobile_preferences_refreshViewAutomatically.key]: true,
    [iconTypes.mobile_preferences_smartDownload.key]: true,
    [iconTypes.mobile_preferences_automaticallyAddToLibrary.key]: true,
    [iconTypes.mobile_advancedSettings_appSettings.key]: true,
    [iconTypes.mobile_advancedSettings_securitySettings.key]: true,
    [iconTypes.mobile_advancedSettings_logging.key]: true,
    [iconTypes.mobile_helpAndLegal.key]: true,
    [iconTypes.mobile_helpAndLegal_help.key]: true,
    [iconTypes.mobile_helpAndLegal_legal.key]: true,
    [iconTypes.mobile_helpAndLegal_reportProblem.key]: true,
    [iconTypes.mobile_logOut.key]: true,
    [iconTypes.filter_summary.key]: true,
    [iconTypes.contentCreator.key]: true,
    [iconTypes.modifiedDate.key]: true,
    [iconTypes.infoWindow.key]: true,
    [iconTypes.share_share.key]: true,
    [iconTypes.share_exportToExcel.key]: true,
    [iconTypes.share_exportToPDF.key]: true,
    [iconTypes.share_download.key]: true,
    [iconTypes.share_subscribe.key]: true,
    [iconTypes.share_annotate.key]: true,
    [iconTypes.web_userName.key]: true,
    [iconTypes.web_myLibraries.key]: true,
    [iconTypes.web_manageLibrary.key]: true,
    [iconTypes.web_preferences.key]: true,
    [iconTypes.web_preferences_myCalendar.key]: true,
    [iconTypes.web_preferences_myLanguage.key]: true,
    [iconTypes.web_preferences_myTimeZone.key]: true,
    [iconTypes.web_switchWorkspace.key]: true,
    [iconTypes.web_takeATour.key]: true,
    [iconTypes.web_help.key]: true,
    [iconTypes.web_logOut.key]: true,
    [iconTypes.sidebarDownloads.key]: true,
    [iconTypes.toc_header.key]: true,
    [iconTypes.toc_contentinfo.key]: true,
    [iconTypes.toc_chapter.key]: true,
    [iconTypes.switch_library.key]: true

});
const granularControlAddedIconsStartVersion: any = {}
granularControlNewAddedIcons.forEach(v => granularControlAddedIconsStartVersion[v.key] = LIBRARY_SUPPORT_GRANULAR_CONTROL);

export const libraryCustomizedIconStartVersion = {
    [iconTypes.insights.key]: LIBRARY_SERVER_SUPPORT_INSIGHTS_CONTROL,
    [iconTypes.contentDiscovery.key]: LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION,
    ...granularControlAddedIconsStartVersion

};


export const mobileOnlyIconKeys = [
    iconTypes.accountMobile,
    iconTypes.addLibrary,
].map((element) => element.key);
export const webDesktopOnlyIconKeys = [
    iconTypes.multiSelect,
    iconTypes.accountWeb,
].map((element) => element.key);
export const previewerWidth = '274px';
export const APPLICATION_OBJECT_TYPE = 78;
export const APPLICATION_OBJECT_SUBTYPE = 0x4e00;

export default CONSTANTS;
export const CONTENT_BUNDLE_FEATURE_FLAG = 'use-contentbundle';
export const CONTENT_BUNDLE_DEFAULT_GROUP_NAME = 'Default Groups';
export const SPECIAL_CHARACTER_REGEX = /[\\\[\]\"]/;
export const EXTRA_ATTR_VIEW_TYPE = 'viewMedia';
export const HOME_DOCUMENT_TYPE_DOSSIER = 'dossier';
export const HOME_DOCUMENT_TYPE_DOCUMENT = 'document';
export const SUPPORT_CONFIGURATION_PALETTE = 'Support Configuration Palette';
export const SUPPORT_CONFIGURATION_PALETTE_ID = 'F6E46AFF44AC27FCEA1B5D93451BE4FC';
export const GENERAL_PREVIEW_FEATURE_FLAG = 'preview-features';
export const APPLICATIONS_AUTH_MODES_FLAG = 'features.auth.applicationAuthModes.enabled';
export const CUSTOM_EMAIL_HOST_PORTAL_HELP_LINK = 'https://microstrategy.github.io/embedding-sdk-docs/add-functionality/use-custom-dossier-link/';
export const CUSTOM_EMAIL_WHITE_LIST_HELP_LINK = 'https://www2.microstrategy.com/producthelp/Current/InstallConfig/en-us/Content/library_admin_control_panel.htm';
