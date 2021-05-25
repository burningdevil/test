import * as _ from 'lodash'
import { createSelector } from 'reselect'
import CONSTANTS from '../../modules/components/HomeScreenConfigConstant'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain
export const selectContentFetchRoot = (state: RootState) => state.bundleContentFetch

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

// helper 
export const selectIsDossierAsHome = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.mode == CONSTANTS.MODE_USE_DOSSIER_AS_HOME_SCREEN
)

export const selectIsToolbarHidden = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => ((isDossierHome ? config.homeScreen.homeDocument.toolbarMode : config.homeScreen.homeLibrary.toolbarMode) & CONSTANTS.HIDE_TOOLBAR) > 0
)

export const selectIsToolbarCollapsed = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => ((isDossierHome ? config.homeScreen.homeDocument.toolbarMode : config.homeScreen.homeLibrary.toolbarMode) & CONSTANTS.COLLAPSE_TOOLBAR) > 0
)

export const selectSelectedSideBarIcons = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => isDossierHome ? [] : config.homeScreen.homeLibrary.sidebars
)

export const selectSelectedLibraryIcons = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => isDossierHome ? [] : config.homeScreen.homeLibrary.icons
)

export const selectSelectedDocumentIcons = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.homeDocument.icons
)
