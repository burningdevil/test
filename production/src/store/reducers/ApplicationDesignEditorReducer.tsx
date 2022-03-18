import { ApplicationDesignEditorState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: ApplicationDesignEditorState = {
  
}

const ApplicationDesignEditorReducer = (state: ApplicationDesignEditorState = initialState, action: ActionTypes) => {
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
    default:
  }
  return state
}

export default ApplicationDesignEditorReducer


