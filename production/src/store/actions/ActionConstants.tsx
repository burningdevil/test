const EDITOR_PREFIX = 'HOME_SCREEN_CONFIG_EDITOR'
const MAIN_VIEW_PREFIX = 'HOME_SCREEN_CONFIG_MAIN'

export const LOAD_CONFIG_LIST = `${MAIN_VIEW_PREFIX}_LOAD_CONFIG_LIST`
export const LOAD_CONFIG_LIST_SUCCESS = `${MAIN_VIEW_PREFIX}_LOAD_CONFIG_LIST_SUCCESS`
export const LOAD_CONFIG_LIST_FAIL = `${MAIN_VIEW_PREFIX}_LOAD_CONFIG_LIST_FAIL`
export const LOAD_CONTENT_BUNDLE_LIST_SUCCESS = `${MAIN_VIEW_PREFIX}_LOAD_CONTENT_BUNDLE_LIST_SUCCESS`
export const LOAD_CONTENT_BUNDLE_LIST_FAIL = `${MAIN_VIEW_PREFIX}_LOAD_CONTENT_BUNDLE_LIST_FAIL`

/* ------------------------------ Current Config State ---------------------------- */

export const SET_CURRENT_CONFIG = `${EDITOR_PREFIX}_SET_CURRENT_CONFIG`
export const UPDATE_CURRENT_CONFIG = `${EDITOR_PREFIX}_UPDATE_CURRENT_CONFIG`
export const UPDATE_REVIEW_TYPE = `${EDITOR_PREFIX}_UPDATE_REVIEW_TYPE`
export const SET_CONFIG_INFO_LIST = `${EDITOR_PREFIX}_SET_CONFIG_INFO_LIST`
export const SET_DUPLICATE_CONFIG = `${EDITOR_PREFIX}_SET_DUPLICATE_CONFIG`
export const SET_CONFIG_NAME_ERROR = `${EDITOR_PREFIX}_SET_CONFIG_NAME_ERROR`
export const UPDATE_HOMESCREEN_THEME = `${EDITOR_PREFIX}_UPDATE_HOMESCREEN_THEME`
export const DELETE_HOMESCREEN_THEME = `${EDITOR_PREFIX}_DELETE_HOMESCREEN_THEME`

/* ------------------------------ Dossier/document fetch State ---------------------------- */

export const APPEND_CONTENT_DOSSIER_LIST = 'APPEND_CONTENT_DOSSIER_LIST'
export const APPEND_CONTENT_DOCUMENT_LIST = 'APPEND_CONTENT_DOCUMENT_LIST'
export const START_LOADING_DOSSIER_LIST = 'START_LOADING_DOSSIER_LIST'
export const START_LOADING_DOCUMENT_LIST = 'START_LOADING_DOCUMENT_LIST'
export const FINISH_LOADING_DOSSIER_LIST_SUCCESS = 'FINISH_LOADING_DOSSIER_LIST_SUCCESS'
export const FINISH_LOADING_DOCUMENT_LIST_SUCCESS = 'FINISH_LOADING_DOCUMENT_LIST_SUCCESS'
export const FINISH_LOADING_DOSSIER_LIST_FAILURE = 'FINISH_LOADING_DOSSIER_LIST_FAILURE'
export const FINISH_LOADING_DOCUMENT_LIST_FAILURE = 'FINISH_LOADING_DOCUMENT_LIST_FAILURE';

/* ------------------------------ Content bundle fetch State ----------------------------*/
export const START_LOADING_CONTENT_LIST = 'START_LOADING_CONTENT_LIST'
export const FINISH_LOADING_CONTENT_LIST = 'FINISH_LOADING_CONTENT_LIST'

/* ------------------------------ Application Appearance Editor store ------------------------------ */
export const ASYNC_INIT_APPEARANCE_EDITOR = 'ASYNC_INIT_APPEARANCE_EDITOR'
export const SET_THEME = 'SET_THEME'
export const UPDATE_THEME = 'UPDATE_THEME'
export const DELETE_THEME_LOGO = 'DELETE_THEME_LOGO'
export const UPDATE_APPEARANCE_PREVIEW_DEVICE_TYPE = 'UPDATE_APPEARANCE_PREVIEW_DEVICE_TYPE'

/* ------------------------------ Color palette fetch State ----------------------------*/
export const START_LOADING_COLOR_PALETTE_LIST = 'START_LOADING_COLOR_PALETTE_LIST'
export const FINISH_LOADING_COLOR_PALETTE_LIST = 'FINISH_LOADING_COLOR_PALETTE_LIST'
export const LOAD_COLOR_PALETTE_LIST_SUCCESS = `${EDITOR_PREFIX}_LOAD_COLOR_PALETTE_LIST_SUCCESS`
export const LOAD_COLOR_PALETTE_LIST_FAIL = `${EDITOR_PREFIX}_LOAD_COLOR_PALETTE_LIST_FAIL`

/* ------------------------------ Customize Email State ----------------------------*/
export const SET_CUSTOM_EMAIL_ERROR = `${EDITOR_PREFIX}_SET_CUSTOM_EMAIL_ERROR`
export const SET_SHOULD_SEND_PREVIEW_EMAIL = `${EDITOR_PREFIX}_SET_SHOULD_SEND_PREVIEW_EMAIL`

/* ------------------------------ Customize Auth Mode State ----------------------------*/
export const SET_CUSTOM_AUTH_ERROR = `${EDITOR_PREFIX}_SET_CUSTOM_AUTH_ERROR`

/* ------------------------------ Update tags --------------------------------------*/
export const SET_FEATURE_TAGS = `SET_FEATURE_TAGS`
