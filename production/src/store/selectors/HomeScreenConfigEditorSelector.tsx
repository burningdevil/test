import * as _ from 'lodash'
import { createSelector } from 'reselect'
import { HomeScreenConfigType } from '../../../src/types/data-model/HomeScreenConfigModels'
import CONSTANTS, { default as VC, dossierIcons, libraryCustomizedIconKeys, libraryIcons } from '../../modules/components/HomeScreenConfigConstant'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain
export const selectBundleContentRoot = (state: RootState) => state.bundleContent

export const selectCurrentConfig = createSelector(
    selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig
)

export const selectIsDuplicateConfig = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.isDuplicateConfig
)

export const selectIsConfigNameError = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.isConfigNameError
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

export const selectIsConfigLoading = createSelector(
  selectConfigMainRoot,
  (configMainRoot) => configMainRoot.configLoading
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
  (isDossierHome, config) => isDossierHome ? !config.homeScreen.homeDocument.toolbarEnabled : !config.homeScreen.homeLibrary.toolbarEnabled
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

export const selectSelectedLibraryCustomizedItems = createSelector(
  selectCurrentConfig,
  (config) => _.get(config, 'homeScreen.homeLibrary.customizedItems', {})
)

export const selectSelectedLibraryIcons = createSelector(
  selectCurrentConfig,
  (config) => {
    // concat the customized icons into the icons.
    let customIcons = Object.keys(config.homeScreen.homeLibrary.customizedItems).filter(key => config.homeScreen.homeLibrary.customizedItems?.[key] && libraryIcons.map(icon => icon.key).includes(key) && !config.homeScreen.homeLibrary?.icons?.includes(key));
    return config.homeScreen.homeLibrary.icons.concat(customIcons);
  }
)

export const selectSelectedDocumentIcons = createSelector(
  selectCurrentConfig,
  (config) => {
    let customIcons = Object.keys(config.homeScreen.homeLibrary.customizedItems).filter(key => config.homeScreen.homeLibrary.customizedItems?.[key] && dossierIcons.map(icon => icon.key).includes(key)&& !config.homeScreen.homeDocument?.icons?.includes(key));
    return config.homeScreen.homeDocument.icons.concat(customIcons);
  }
)
export const removeCustomisedIcons = createSelector(
  selectCurrentConfig,
  (config) => {
    // extra handle to the customized icons.
    const libraryIcons: string[] = config.homeScreen?.homeLibrary?.icons ?? [];
    const dossierIcons: string[] = config.homeScreen?.homeDocument?.icons ?? [];
    config.homeScreen.homeLibrary.icons = libraryIcons.filter(icon => !libraryCustomizedIconKeys.includes(icon));
    config.homeScreen.homeDocument.icons = dossierIcons.filter(icon => !libraryCustomizedIconKeys.includes(icon));
    return config;
  }
)

export const selectDefaultGroupsName = createSelector(
  selectCurrentConfig,
  (config) =>  config.homeScreen.homeLibrary.defaultGroupsName
)
