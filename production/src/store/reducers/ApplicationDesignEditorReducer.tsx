import { ApplicationDesignEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'

const initialState: ApplicationDesignEditorState = {
  theme: {
    id: '',
    name: '',
    settings: {}
  }
}

const ApplicationDesignEditorReducer = (state: ApplicationDesignEditorState = initialState, action: ActionTypes) => {
  const { type, data } = action
  switch(type) {
    case Actions.SET_THEME:
      return {
        ...state,
        theme: { ...data }
      }
    default:
  }
  return state
}

export default ApplicationDesignEditorReducer


