import { createSelector } from 'reselect'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
)

export const selectPreviewDeviceType = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.previewDeviceType
)

export const selectCurrentConfigContentBundleIds = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig.homeScreen.homeLibrary.contentBundleIds
)

export const selectConfigList = createSelector(
    selectConfigMainRoot,
  (configMainRoot) => configMainRoot.configList
)

export const selectContentBundleList = createSelector(
    selectConfigMainRoot,
  (configMainRoot) => configMainRoot.contentBundleList
)