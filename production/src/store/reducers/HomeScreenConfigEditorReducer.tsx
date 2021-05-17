import { HomeScreenConfigEditorState, HomeScreenConfigState } from '../../types/redux-state/HomeScreenConfigEditorState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'

const initialState: HomeScreenConfigEditorState = {
}

const HomeScreenConfigReducer = (state: HomeScreenConfigEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.UPDATE_GENERAL_SETTINGS:
      return {...state, general: data}
    default:
      return state
  }
}

export default HomeScreenConfigReducer
