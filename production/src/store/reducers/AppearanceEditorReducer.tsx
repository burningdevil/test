import { AppearanceEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { ApplicationLogos } from 'src/types/data-model/HomeScreenConfigModels'
import { ActionTypes } from '../actions/ActionTypes'
import { reviewType } from 'src/modules/components/HomeScreenConfigConstant'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: AppearanceEditorState = {
  theme: {
    schemaVersion: 1,
    logos: {},
    color: {}
  },
  appearancePreviewDeviceType: reviewType.WEB
}

const AppearanceEditorReducer = (state: AppearanceEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action
  switch(type) {
    case Actions.SET_THEME:
      return {
        ...state,
        theme: { ...data }
      }
    case Actions.UPDATE_THEME:
      return {
        ...state,
        theme: _.mergeWith({}, state.theme, data, (target, source) => {
          if (_.isArray(target)) {
            return source
          }
        })
      }
    case Actions.DELETE_THEME_LOGO:
      const currThemeLogos = state.theme.logos
      const updatedThemeLogos: ApplicationLogos = _.cloneDeep(currThemeLogos)
      delete updatedThemeLogos[data as keyof ApplicationLogos]
      return {
        ...state,
        theme: {
          ...state.theme,
          logos: updatedThemeLogos
        }
      }
    case Actions.UPDATE_APPEARANCE_PREVIEW_DEVICE_TYPE:
      return {
        ...state,
        appearancePreviewDeviceType: data
      }
    default:
  }
  return state
}

export default AppearanceEditorReducer


