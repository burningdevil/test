import { createSelector } from 'reselect'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain
export const selectContentFetchRoot = (state: RootState) => state.bundleContentFetch

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
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

export const selectAllDossiers = createSelector(
  selectContentFetchRoot,
  (bundleFetchRoot) => bundleFetchRoot.dossiers
)

export const selectAllDocuments = createSelector(
  selectContentFetchRoot,
  (bundleFetchRoot) => bundleFetchRoot.documents
)

export const selectIsLoadingDossiers = createSelector(
  selectContentFetchRoot,
  (bundleFetchRoot) => bundleFetchRoot.loadingDossiers
);

export const selectLoadingDossiersFinish = createSelector(
  selectContentFetchRoot,
  (bundleFetchRoot) => bundleFetchRoot.loadingDossiersFinish
);