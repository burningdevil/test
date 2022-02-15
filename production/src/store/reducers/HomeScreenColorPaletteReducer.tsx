import { HomeScreenEditorColorPaletteState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'
import { HomeScreenBundleContentListItem } from '../../types/data-model/HomeScreenConfigModels'

const initialState: HomeScreenEditorColorPaletteState = {
  data: [],
  loadingColorPalette: false,
  loadingColorPaletteFinish: false
}

const HomeScreenColorPaletteReducer = (state: HomeScreenEditorColorPaletteState = initialState, action: ActionTypes) => {
    const { type, data } = action

    switch (type) {
      case Actions.START_LOADING_COLOR_PALETTE_LIST:
        return {...state, loadingColorPalette: true, loadingColorPaletteFinish: false}
      case Actions.LOAD_COLOR_PALETTE_LIST_SUCCESS:
        return {...state, data, loadingColorPalette: false, loadingContentBundleFinish: true}
      case Actions.LOAD_COLOR_PALETTE_LIST_FAIL:
        return {...state, data: [], loadingColorPalette: false, loadingContentBundleFinish: true}
      default:
        return state
    }
}

export default HomeScreenColorPaletteReducer
