import * as Actions from './ActionConstants'
import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType } from '../../types/data-model/HomeScreenConfigModels'

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




