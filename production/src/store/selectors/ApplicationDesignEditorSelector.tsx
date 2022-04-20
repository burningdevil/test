import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import * as Actions from '../actions/ActionConstants'
import { createSelector } from 'reselect'

export const selectAppDesignEditorRoot = (state: RootState) => state.appDesignEditor

export const selectCurrentConfig = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.currentConfig
)

export const selectConfigTheme = createSelector(
  selectCurrentConfig,
  (currentConfig) => currentConfig.homeScreen.theme
)

export const selectCurrentTheme = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.currentTheme
)
