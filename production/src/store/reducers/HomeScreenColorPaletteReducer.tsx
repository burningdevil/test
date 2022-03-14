import { HomeScreenEditorColorPaletteState } from '../../types/redux-state/HomeScreenConfigState'
import { ActionTypes } from '../actions/ActionTypes'
import * as Actions from '../actions/ActionConstants'

const initialState: HomeScreenEditorColorPaletteState = {
  data: [],
  loadingColorPalette: false
}

const HomeScreenColorPaletteReducer = (state: HomeScreenEditorColorPaletteState = initialState, action: ActionTypes) => {
    const { type, data } = action

    switch (type) {
      case Actions.START_LOADING_COLOR_PALETTE_LIST:
        return {...state, loadingColorPalette: true}
      case Actions.LOAD_COLOR_PALETTE_LIST_SUCCESS:
        return {...state, data, loadingColorPalette: false}
      case Actions.LOAD_COLOR_PALETTE_LIST_FAIL:
        return {...state, data: [], loadingColorPalette: false}
      default:
        return state
    }
}

export default HomeScreenColorPaletteReducer
