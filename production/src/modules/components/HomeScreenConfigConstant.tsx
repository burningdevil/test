import * as _ from 'lodash';
import { LIBRARY_SERVER_SUPPORT_INSIGHTS_CONTROL } from '../../utils';
import { t } from '../../i18n/i18next';

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
    ICON_HOME: 'home',
    ICON_FULL_SCREEN: 'fullScreen',
    ICON_NEW_DOSSIER: 'new_dossier',
    ICON_EDIT_DOSSIER: 'edit_dossier',
    ICON_ADD_LIBRARY: 'add_library_server',
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
    APPEARANCE_OBJ_TYPE: 'Appearance',

    BASE_URL: 'baseUrl',
    APPLICATION: 'application'
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
    SORT_BY: t('Sort By'),
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
    DISABLE_NEW_DOSSIER_TOOLTIP: t('disableNewDossierTooltip'),
    DISABLE_EDIT_DOSSIER_TOOLTIP: t('disableEditDossierTooltip'),
    DISABLE_NEW_DOSSIER_TOOLTIP_CONTENT: t('disableNewDossierTooltipContent'),
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

    // Environment Connection strings
    ENVIRONMENT_CONNECTION_SETTINGS_DESC: t('environmentConnectionSettingsDesc'),
    ENVIRONMENT_CONNECTION_AVAILABLE_ENVS_DESC: t('environmentConnectionAvailableEnvsDesc'),
    CURRENT_ENV_LABEL: t('currentEnvLabel'),
    URL: t('url'),
    APPLICATION: t('application'),
    SELECT_APPLICATION: t('selectApplication')
};

export const sectionTitle = {
    DESC: t('mobileOnlyDesc'),
    SECURITY: t('security'),
    ACCESS: t('access'),
    CONNECTIVITY: t('connectivity'),
    LOGGING: t('logging'),
    CACHE: t('cache'),
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
export interface IconType {
    displayText: string;
    iconName: string;
    key: string;
    supportTip?: boolean;
    tipMsg?: string;
    deps?: string[];
}
export interface IconTypes {
    [props: string]: IconType;
}
export const REVERSE = '!';
export const iconTypes: IconTypes = {
    sidebar: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_SIDEBAR,
        key: CONSTANTS.ICON_SIDEBAR,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_SIDEBAR],
        tipMsg: localizedStrings.DISABLE_SIDEBAR_TOOLTIP,
    },
    sortAndFilter: {
        displayText: t('librarySortFilter'),
        iconName: CONSTANTS.FONT_SORT_FILTER,
        key: CONSTANTS.ICON_SORT_FILTER,
    },
    multiSelect: {
        displayText: t('multiSelect'),
        iconName: CONSTANTS.FONT_MULTI_SELECT,
        key: CONSTANTS.ICON_MULTI_SELECT,
    },
    search: {
        displayText: t('search'),
        iconName: CONSTANTS.FONT_SEARCH,
        key: CONSTANTS.ICON_SEARCH,
    },
    notification: {
        displayText: t('notification'),
        iconName: CONSTANTS.FONT_NOTIFICATIONS,
        key: CONSTANTS.ICON_NOTIFICATIONS,
    },
    account: {
        displayText: t('account'),
        iconName: CONSTANTS.FONT_OPTIONS,
        key: CONSTANTS.ICON_OPTIONS,
    },
    accountWeb: {
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
    toc: {
        displayText: t('toc'),
        iconName: CONSTANTS.FONT_TOCS,
        key: CONSTANTS.ICON_TOCS,
    },
    bookmark: {
        displayText: t('bookmark'),
        iconName: CONSTANTS.FONT_BOOKMARK,
        key: CONSTANTS.ICON_BOOKMARK,
    },
    reset: {
        displayText: t('reset'),
        iconName: CONSTANTS.FONT_RESET,
        key: CONSTANTS.ICON_RESET,
    },
    filter: {
        displayText: t('filter'),
        iconName: CONSTANTS.FONT_FILTER,
        key: CONSTANTS.ICON_FILTER,
    },
    comment: {
        displayText: t('comments'),
        iconName: CONSTANTS.FONT_COMMENTS,
        key: CONSTANTS.ICON_COMMENTS,
    },
    share: {
        displayText: t('share'),
        iconName: CONSTANTS.FONT_SHARE,
        key: CONSTANTS.ICON_SHARE,
    },
    // platform specified
    dataSearch: {
        displayText: t('dataSearchText'),
        iconName: CONSTANTS.FONT_DATA_SEARCH,
        key: CONSTANTS.ICON_DATA_SEARCH,
    },
    hyper: {
        displayText: t('hyperIconText'),
        iconName: CONSTANTS.FONT_HYPER,
        key: CONSTANTS.ICON_HYPER,
    },
    aaFont: {
        displayText: t('fontIconText'),
        iconName: CONSTANTS.FONT_AA_FONT,
        key: CONSTANTS.ICON_AA_FONT,
    },
    // sidebar children
    all: {
        displayText: t('all'),
        iconName: CONSTANTS.FONT_ALL,
        key: CONSTANTS.ICON_ALL,
    },
    favorites: {
        displayText: t('favorites'),
        iconName: CONSTANTS.FONT_FAV,
        key: CONSTANTS.ICON_FAV,
    },
    recents: {
        displayText: t('recents'),
        iconName: CONSTANTS.FONT_RECENT,
        key: CONSTANTS.ICON_RECENENT,
    },
    defaultGroup: {
        displayText: t('defaultGroups'),
        iconName: CONSTANTS.FONT_DEFAULT_GROUP,
        key: CONSTANTS.ICON_DEFAULT_GROUP,
    },
    myGroup: {
        displayText: t('myGroup'),
        iconName: CONSTANTS.FONT_MY_GROUP,
        key: CONSTANTS.ICON_MY_GROUP,
    },
    myContent: {
        displayText: t('myContent'),
        iconName: CONSTANTS.FONT_MY_CONTENT,
        key: CONSTANTS.ICON_MY_CONTENT,
    },
    mySubscribe: {
        displayText: t('mySubscribe'),
        iconName: CONSTANTS.FONT_MY_SUBSCRIBE,
        key: CONSTANTS.ICON_MY_SUBSCRIBE,
    },
    accountMobile: {
        displayText: t('accountMobile'),
        iconName: CONSTANTS.FONT_OPTIONS,
        key: CONSTANTS.ICON_OPTIONS + '__mobile',
    },
    newDossier: {
        displayText: t('newDossier'),
        iconName: CONSTANTS.FONT_NEW_DOSSIER,
        key: CONSTANTS.ICON_NEW_DOSSIER,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_NEW_DOSSIER],
        tipMsg: localizedStrings.DISABLE_NEW_DOSSIER_TOOLTIP,
    },
    editDossier: {
        displayText: t('editDossier'),
        iconName: CONSTANTS.FONT_EDIT_DOSSIER,
        key: CONSTANTS.ICON_EDIT_DOSSIER,
        supportTip: true,
        deps: [REVERSE + CONSTANTS.ICON_EDIT_DOSSIER],
        tipMsg: localizedStrings.DISABLE_EDIT_DOSSIER_TOOLTIP,
    },
    addLibrary: {
        displayText: t('addLibrary'),
        iconName: CONSTANTS.FONT_ADD_LIBRARY,
        key: CONSTANTS.ICON_ADD_LIBRARY,
    },
    undoRedo: {
        displayText: t('undoRedo'),
        iconName: CONSTANTS.FONT_UNDO_REDO,
        key: CONSTANTS.ICON_UNDO_REDO,
    },
    redo: {
        displayText: t('undoRedo'),
        iconName: CONSTANTS.FONT_REDO,
        key: CONSTANTS.ICON_UNDO_REDO,
    },
    insights: {
        displayText: t('insights'),
        iconName: CONSTANTS.FONT_INSIGHT_LIST,
        key: CONSTANTS.ICON_INSIGHT_LIST,
    },
    //// for preview. Localization not needed.
    // home button
    home: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_HOME,
        key: CONSTANTS.ICON_HOME,
    },
    deskHome: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_DESK_HOME,
        key: CONSTANTS.ICON_HOME,
    },
    // stands for 'sidebar' in library
    previewSidebar: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    // stands for 'library' in dossier
    previewLibraryWeb: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR,
        key: CONSTANTS.ICON_HOME,
    },
    previewLibraryMobile: {
        displayText: t('home'),
        iconName: CONSTANTS.FONT_LIBRARY_MOBILE,
        key: CONSTANTS.ICON_HOME,
    },
    // phone sidebar
    previewSidebarMobile: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_MOBILE,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    // tablet sidebar
    previewSidebarTablet: {
        displayText: t('sidebar'),
        iconName: CONSTANTS.FONT_PREVIEWSIDEBAR_TABLET,
        key: CONSTANTS.ICON_SIDEBAR,
    },
    previewAccountMobile: {
        displayText: t('account'),
        iconName: CONSTANTS.FONT_PREVIEWOPTIONS,
        key: CONSTANTS.ICON_OPTIONS + '_mobile',
    },
    previewTocPhone: {
        displayText: t('toc'),
        iconName: CONSTANTS.FONT_PREVIEWTOC,
        key: CONSTANTS.ICON_TOCS,
    },
    previewFullScreen: {
        displayText: 'Full Screen',
        iconName: CONSTANTS.FONT_FULLSCREEN,
        key: CONSTANTS.ICON_FULL_SCREEN,
    },
    previewFullScreenTablet: {
        displayText: 'Full Screen',
        iconName: CONSTANTS.FONT_FULLSCREEN_TABLET,
        key: CONSTANTS.ICON_FULL_SCREEN,
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
    iconTypes.comment,
    iconTypes.share,
    iconTypes.editDossier,
];

// dossier icons when mode is dossier as home
export const dossierIconsDossierHome = [
    iconTypes.toc,
    iconTypes.undoRedo,
    iconTypes.filter,
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
    iconTypes.defaultGroup,
    iconTypes.myGroup,
    iconTypes.accountMobile,
];

// for accountMobile and accountWeb to remove suffix
export const iconValidKey = (iconKey: string) =>
    iconKey.split('__').length > 0 ? iconKey.split('__')[0] : iconKey;

export const dossierIconKeys = dossierIcons.map((element) => element.key);
export const libraryIconKeys = libraryIcons.map((element) => element.key);
export const sidebarIconKeys = childrenIcons.map((element) => element.key);
export const platformSpecificIconKeys = platformSpecificIcons.map(
    (element) => element.key
);
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
    iconTypes.insights
];
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
});

export const libraryCustomizedIconStartVersion = {
    [iconTypes.insights.key]: LIBRARY_SERVER_SUPPORT_INSIGHTS_CONTROL,
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