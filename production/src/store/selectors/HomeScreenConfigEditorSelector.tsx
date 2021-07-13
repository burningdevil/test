import * as _ from 'lodash'
import { createSelector } from 'reselect'
import CONSTANTS from '../../modules/components/HomeScreenConfigConstant'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain
export const selectBundleContentRoot = (state: RootState) => state.bundleContent

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
)

export const selectConfigInfoList = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.configInfoList
)

export const selectColorPalettes = createSelector(
  selectConfigEditorRoot,
(configEditorRoot) => configEditorRoot.colorPalettes
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
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.dossiers
)

export const selectAllDocuments = createSelector(
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.documents
)

export const selectIsLoadingDossiers = createSelector(
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.loadingDossiers
);

export const selectLoadingDossiersFinish = createSelector(
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.loadingDossiersFinish
);

// helper 
export const selectIsDossierAsHome = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.mode == CONSTANTS.MODE_USE_DOSSIER_AS_HOME_SCREEN
)

export const selectIsToolbarHidden = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => isDossierHome ? config.homeScreen.homeDocument.toolbarDisabled : config.homeScreen.homeLibrary.toolbarDisabled
)

export const selectIsToolbarCollapsed = createSelector(
  selectIsDossierAsHome,
  selectCurrentConfig,
  (isDossierHome, config) => (isDossierHome ? config.homeScreen.homeDocument.toolbarMode : config.homeScreen.homeLibrary.toolbarMode) === CONSTANTS.COLLAPSE_TOOLBAR
)

export const selectSelectedSideBarIcons = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.homeLibrary.sidebars
)

export const selectSelectedLibraryIcons = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.homeLibrary.icons
)

export const selectSelectedDocumentIcons = createSelector(
  selectCurrentConfig,
  (config) => config.homeScreen.homeDocument.icons
)

export const selectDefaultGroupsName = createSelector(
  selectCurrentConfig,
  (config) =>  config.homeScreen.homeLibrary.defaultGroupsName
)
