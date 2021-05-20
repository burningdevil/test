import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'

const initialState: HomeScreenConfigEditorState = {
  currentConfig: {
    'name': '',
    'description': ''
  }
}

const HomeScreenConfigEditorReducer = (state: HomeScreenConfigEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.UPDATE_GENERAL_SETTINGS:
      return {...state, currentConfig: {...state.currentConfig, ...data}}
    case Actions.SET_CURRENT_CONFIG:
      return {...state, currentConfig: data}
    default:
      return state
  }
}

export default HomeScreenConfigEditorReducer
