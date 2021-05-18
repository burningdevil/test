import * as Actions from './ActionConstants'
import { GenerlSettingsType } from './ActionTypes'

/* ------------------------------ General Settings ---------------------------- */

export const updateGeneralSettings = (settings: GenerlSettingsType) => ({
  type: Actions.UPDATE_GENERAL_SETTINGS,
  data: settings,
})


