import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { createSelector } from 'reselect'

export const selectAppDesignEditorRoot = (state: RootState) => state.appDesignEditor

export const selectTheme = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.theme
)

export const selectThemeId = createSelector(
  selectTheme,
  (theme) => theme.id
)

export const selectThemeName = createSelector(
  selectTheme,
  (theme) => theme.name
)

export const selectThemeSettings = createSelector(
  selectTheme,
  (theme) => theme.settings
)
