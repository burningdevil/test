import * as Actions from './ActionConstants'
import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem } from '../../types/data-model/HomeScreenConfigModels'

export const loadConfigListSuccess = (configList: Array<HomeScreenConfigType>) => ({
  type: Actions.LOAD_CONFIG_LIST_SUCCESS,
  data: configList,
})

export const loadContentBundleListSuccess = (contentBundleList: Array<MainViewContentBundleType>) => ({
  type: Actions.LOAD_CONTENT_BUNDLE_LIST_SUCCESS,
  data: contentBundleList,
})

/* ---------------------------- Editor Config Main ---------------------------- */
export const setCurrentConfig = (config: HomeScreenEditConfigType) => ({
  type: Actions.SET_CURRENT_CONFIG,
  data: config,
})

export const updateCurrentConfig = (settings: Partial<HomeScreenEditConfigType>) => ({
  type: Actions.UPDATE_CURRENT_CONFIG,
  data: settings,
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

export const finishLoadingDossierList = () => ({
  type: Actions.LOADING_DOSSIER_LIST_FINISHED
})




