import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { createSelector } from 'reselect'

export const selectAppDesignEditorRoot = (state: RootState) => state.appDesignEditor

export const selectAppearanceEditorTheme = createSelector(
  selectAppDesignEditorRoot,
  (appDesignEditorRoot) => appDesignEditorRoot.theme
)
