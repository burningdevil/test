import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import * as Actions from '../actions/ActionConstants'
import { createSelector } from 'reselect'

export const selectAppDesignEditorRoot = (state: RootState) => state.appDesignEditor

export const selectTheme = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.theme
)
