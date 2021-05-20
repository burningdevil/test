import * as Actions from './ActionConstants'
import { GeneralSettingsType, HomeScreenConfigType } from '../../types/data-model/HomeScreenConfigModels'

/* ---------------------------- Editor Config Main ---------------------------- */
export const setCurrentConfig = (config: HomeScreenConfigType) => ({
  type: Actions.SET_CURRENT_CONFIG,
  data: config,
})

/* ------------------------------ General Settings ---------------------------- */

export const updateGeneralSettings = (settings: GeneralSettingsType) => ({
  type: Actions.UPDATE_GENERAL_SETTINGS,
  data: settings,
})


