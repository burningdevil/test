import { HomeScreenEditorContentBundleState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import * as _ from 'lodash'

const initialState: HomeScreenEditorContentBundleState = {
  data: [],
  loadingContentBundle: false,
  loadingContentBundleFinish: false
}

const HomeScreenContentBundleReducer = (state: HomeScreenEditorContentBundleState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.START_LOADING_CONTENT_LIST:
      return {...state, loadingContentBundle: true, loadingContentBundleFinish: false}
    case Actions.LOAD_CONTENT_BUNDLE_LIST_SUCCESS:
      return {...state, data, loadingContentBundle: false, loadingContentBundleFinish: true}
    case Actions.LOAD_CONTENT_BUNDLE_LIST_FAIL:
      return {...state, data: [], loadingContentBundle: false, loadingContentBundleFinish: true}
    default:
      return state
  }
}

export default HomeScreenContentBundleReducer
