import { HomeScreenMainViewState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: HomeScreenMainViewState = {
  configList: [],
  contentBundleList: []
}

const HomeScreenConfigMainReducer = (state: HomeScreenMainViewState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.LOAD_CONFIG_LIST_SUCCESS:
      return {...state, configList: data}
    case Actions.LOAD_CONTENT_BUNDLE_LIST_SUCCESS:
      return {...state, contentBundleList: data}
    default:
      return state
  }
}

export default HomeScreenConfigMainReducer
