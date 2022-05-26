import * as Actions from './ActionConstants'
import { HomeScreenConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem, HomeScreenConfigInfo, ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'

export const loadConfigListSuccess = (configList: Array<HomeScreenConfigType>) => ({
  type: Actions.LOAD_CONFIG_LIST_SUCCESS,
  data: configList,
})

export const loadConfigListFail = () => ({
  type: Actions.LOAD_CONFIG_LIST_FAIL
})

export const loadConfigList = () => ({
  type: Actions.LOAD_CONFIG_LIST
})


/* ---------------------------- Editor Config Main ---------------------------- */
export const setCurrentConfig = (config: HomeScreenConfigType) => ({
  type: Actions.SET_CURRENT_CONFIG,
  data: config,
})


export const updateCurrentConfig = (settings: Partial<HomeScreenConfigType>) => ({
  type: Actions.UPDATE_CURRENT_CONFIG,
  data: settings,
})

export const updateThemeInCurrentConfig = (theme: ApplicationTheme) => ({
  type: Actions.UPDATE_HOMESCREEN_THEME,
  data: theme
})

export const deleteThemeInCurrentConfig = () => ({
  type: Actions.DELETE_HOMESCREEN_THEME
})

export const updatePreviewDeviceType = (type: string) => ({
  type: Actions.UPDATE_REVIEW_TYPE,
  data: type,
})

export const setConfigInfoList = (configList: Array<HomeScreenConfigInfo>) => ({
  type: Actions.SET_CONFIG_INFO_LIST,
  data: configList,
})
export const setDuplicateConfig = (isDuplicateConfig: boolean) => ({
  type: Actions.SET_DUPLICATE_CONFIG,
  data: isDuplicateConfig,
})
export const setConfigNameError = (isNameError: boolean) => ({
  type: Actions.SET_CONFIG_NAME_ERROR,
  data: isNameError,
})
/* ------------------------------ Bundle content objects list ---------------------------- */

export const appendContentDossiers = (list: HomeScreenBundleContentListItem[]) => ({
  type: Actions.APPEND_CONTENT_DOSSIER_LIST,
  data: list,
})

export const appendContentDocuments = (list: HomeScreenBundleContentListItem[]) => ({
  type: Actions.APPEND_CONTENT_DOCUMENT_LIST,
  data: list,
})

export const startLoadingDossierList = () => ({
  type: Actions.START_LOADING_DOSSIER_LIST
})
export const startLoadingDocumentList = () => ({
  type: Actions.START_LOADING_DOCUMENT_LIST
})

export const finishLoadingDossierListSuccess = () => ({
  type: Actions.FINISH_LOADING_DOSSIER_LIST_SUCCESS
})

export const finishLoadingDocumentListSuccess = () => ({
  type: Actions.FINISH_LOADING_DOCUMENT_LIST_SUCCESS
})
export const finishLoadingDocumentListFail = () => ({
  type: Actions.FINISH_LOADING_DOCUMENT_LIST_FAILURE
})



export const finishLoadingDossierListFail = () => ({
  type: Actions.FINISH_LOADING_DOSSIER_LIST_FAILURE
})
/* ------------------------------ content bundle list ----------------------------*/
export const startLoadingContentBundleList = () => ({
  type: Actions.START_LOADING_CONTENT_LIST
})

export const finishLoadingContentBundleList = () => ({
  type: Actions.FINISH_LOADING_CONTENT_LIST
})

export const loadContentBundleListSuccess = (contentBundleList: Array<MainViewContentBundleType>) => ({
  type: Actions.LOAD_CONTENT_BUNDLE_LIST_SUCCESS,
  data: contentBundleList,
})

export const loadContentBundleListFail = () => ({
  type: Actions.LOAD_CONTENT_BUNDLE_LIST_FAIL,
})
 
/* ------------------------------ color palette list ----------------------------*/
export const startLoadingColorPaletteList = () => ({
  type: Actions.START_LOADING_COLOR_PALETTE_LIST
})

export const finishLoadingColorPaletteList = () => ({
  type: Actions.FINISH_LOADING_COLOR_PALETTE_LIST
})

export const loadColorPaletteSuccess = (colorPaletteList: Array<any>) => ({
  type: Actions.LOAD_COLOR_PALETTE_LIST_SUCCESS,
  data: colorPaletteList,
})

export const loadColorPaletteFail = () => ({
  type: Actions.LOAD_COLOR_PALETTE_LIST_FAIL,
})

/* ------------------------------ application design editor ----------------------------*/
export const asyncInitAppDesignEditor = () => ({ 
  type: Actions.ASYNC_INIT_APP_DESIGN_EDITOR 
})

export const setTheme = (theme: ApplicationTheme) => ({
  type: Actions.SET_THEME,
  data: theme
})

export const updateTheme = (data: any) => ({
  type: Actions.UPDATE_THEME,
  data
})

export const deleteThemeLogo = (logoCategory: string) => ({
  type: Actions.DELETE_THEME_LOGO,
  data: logoCategory
})

