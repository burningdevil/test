import * as Actions from './ActionConstants'
import { GeneralSettingsType } from '../../types/redux-state/HomeScreenConfigEditorState'

/* ------------------------------ General Settings ---------------------------- */

export const updateGeneralSettings = (settings: GeneralSettingsType) => ({
  type: Actions.UPDATE_GENERAL_SETTINGS,
  data: settings,
})


