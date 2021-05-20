import { createSelector } from 'reselect'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
)