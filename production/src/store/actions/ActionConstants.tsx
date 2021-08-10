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

/* ------------------------------ Dossier/document fetch State ---------------------------- */

export const APPEND_CONTENT_DOSSIER_LIST = 'APPEND_CONTENT_DOSSIER_LIST'
export const APPEND_CONTENT_DOCUMENT_LIST = 'APPEND_CONTENT_DOCUMENT_LIST'
export const START_LOADING_DOSSIER_LIST = 'START_LOADING_DOSSIER_LIST'
export const FINISH_LOADING_DOSSIER_LIST_SUCCESS = 'FINISH_LOADING_DOSSIER_LIST_SUCCESS'
export const FINISH_LOADING_DOSSIER_LIST_FAILURE = 'FINISH_LOADING_DOSSIER_LIST_FAILURE'