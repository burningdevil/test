import { createSelector } from 'reselect'

import { HomeScreenConfigEditorState } from '../../types/redux-state/HomeScreenConfigEditorState'

export const selectConfigEditorRoot = (state: HomeScreenConfigEditorState) => state

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
)