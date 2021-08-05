import { HomeScreenBundleContentState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import { HomeScreenBundleContentListItem } from '../../types/data-model/HomeScreenConfigModels'

const initialState: HomeScreenBundleContentState = {
  dossiers: [],
  documents: [],
  loadingDossiers: false,
  loadingDossiersFinish: false,
}

const HomeScreenBundleContentReducer = (state: HomeScreenBundleContentState = initialState, action: ActionTypes) => {
  const { type, data } = action

  switch (type) {
    case Actions.APPEND_CONTENT_DOCUMENT_LIST:
      return {...state, documents: state.documents.concat(data as HomeScreenBundleContentListItem[])}
    case Actions.APPEND_CONTENT_DOSSIER_LIST:
      return {...state, dossiers: state.dossiers.concat(data as HomeScreenBundleContentListItem[])}
    case Actions.START_LOADING_DOSSIER_LIST:
      return {...state, loadingDossiers: true}
    case Actions.FINISH_LOADING_DOSSIER_LIST_SUCCESS:
    case Actions.FINISH_LOADING_DOSSIER_LIST_FAILURE:
      return {...state, loadingDossiersFinish: true, loadingDossiers: false}
    default:
      return state
  }
}

export default HomeScreenBundleContentReducer
