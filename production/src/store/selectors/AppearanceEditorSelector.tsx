import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { createSelector } from 'reselect'

export const selectAppearanceEditorRoot = (state: RootState) => state.appearanceEditor

export const selectAppearanceEditorTheme = createSelector(
  selectAppearanceEditorRoot,
  (appearanceEditorRoot) => appearanceEditorRoot.theme
)

export const selectAppearanceEditorUi = createSelector(
  selectAppearanceEditorRoot,
  (appearanceEditorRoot) => appearanceEditorRoot.ui
)

export const selectCurrentThemeLogos = createSelector(
  selectAppearanceEditorTheme,
  (theme) => theme.logos || {}
)

export const selectCurrentThemeColor = createSelector(
  selectAppearanceEditorTheme,
  (theme) => theme.color || {}
)

export const selectAppearancePreviewDeviceType = createSelector(
  selectAppearanceEditorUi,
  (ui) => ui.appearancePreviewDeviceType
)
