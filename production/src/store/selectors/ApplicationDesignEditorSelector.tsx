import { RootState } from '../../types/redux-state/HomeScreenConfigState'
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

export const selectDesignStudioTheme = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.currentTheme
)
