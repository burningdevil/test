import * as _ from 'lodash'
import { createSelector } from 'reselect'
import CONSTANTS, { CONTENT_BUNDLE_DEFAULT_GROUP_NAME, default as VC, dossierIcons, iconTypes, libraryCustomizedIconKeys, libraryIcons, localizedStrings } from '../../modules/components/HomeScreenConfigConstant'

import { RootState } from '../../types/redux-state/HomeScreenConfigState'

export const selectConfigEditorRoot = (state: RootState) => state.configEditor
export const selectConfigMainRoot = (state: RootState) => state.configMain
export const selectBundleContentRoot = (state: RootState) => state.bundleContent
export const selectContentRoot = (state: RootState) => state.content
export const selectColorPaletteRoot = (state: RootState) => state.colorPalette
export const selectFeatures = (state: RootState) => state.features
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

export const selectIsConfigChanged = createSelector(
  selectConfigEditorRoot,
  (configMainRoot) => configMainRoot.isStateChangeByManual
)

export const selectContentBundleList = createSelector(
    selectConfigMainRoot,
  (configMainRoot) => configMainRoot.contentBundleList
)

export const selectContentLoadingFinish = createSelector(
  selectContentRoot,
  (configMainRoot) => configMainRoot.loadingContentBundleFinish
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

export const selectIsLoadingDocuments = createSelector(
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.loadingDocuments
);

export const selectLoadingDocumentsFinish = createSelector(
  selectBundleContentRoot,
  (bundleContentRoot) => bundleContentRoot.loadingDocumentsFinish
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

export const selectSelectedLibrarycustomizedItemProperties = createSelector(
  selectCurrentConfig,
  (config) => _.get(config, 'homeScreen.homeLibrary.customizedItemProperties', {})
)

export const selectSelectedLibraryIcons = createSelector(
  selectCurrentConfig,
  (config) => {
    return config.homeScreen.homeLibrary.icons;
  }
)

export const selectSelectedDocumentIcons = createSelector(
  selectCurrentConfig,
  (config) => {
    return config.homeScreen.homeDocument.icons;
  }
)

export const selectDefaultGroupsName = createSelector(
  selectCurrentConfig,
  (config) =>  {
    // special handling when encounter with default groups.
    return config.homeScreen.homeLibrary.defaultGroupsName === localizedStrings.DEFAULT_GROUPS ? CONTENT_BUNDLE_DEFAULT_GROUP_NAME : config.homeScreen.homeLibrary.defaultGroupsName
  }
)

export const selectCurrentConfigTheme = createSelector(
  selectCurrentConfig,
  (currentConfig) => currentConfig.homeScreen.theme
)

export const selectAllColorPalettes = createSelector(
  selectColorPaletteRoot,
  (config) =>  {
    return config.data
  }
)

export const selectApplicationPalettes = createSelector(
  selectCurrentConfig,
  (config) =>  {
    return config.applicationPalettes
  }
)

export const selectApplicationDefaultPalette = createSelector(
  selectCurrentConfig,
  (config) =>  {
    return config.applicationDefaultPalette
  }
)

export const selectUseConfigPalettes = createSelector(
  selectCurrentConfig,
  (config) =>  {
    return config.useConfigPalettes
  }
)
export const selectColorPalettesSelected = createSelector(
  selectCurrentConfig,
  (config) => {
    return !config.useConfigPalettes || config.useConfigPalettes && config.applicationPalettes?.length > 0
  }
)

export const selectCustomizeEmailSetting  = createSelector(
  selectCurrentConfig,
  (config) => {
    return config.emailSettings
  }
)

export const selectIsCustomEmailError = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.isCustomEmailError
)

export const selectShouldSendPreviewEmail = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.shouldSendPreviewEmail
)

export const selectCustomizeEmailLogo  = createSelector(
  selectCurrentConfig,
  (config) => {
    return config.emailSettings?.brandingImage?.imageUrl
  }
)
export const selectIsCustomAuthError = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.isCustomAuthError
)
export const selectAuthModes = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig?.authModes
)

export const selectDefaultAuthMode = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.currentConfig?.authModes?.defaultMode
)

export const selectAuthModesEnabled = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => {
    if(configEditorRoot.currentConfig?.authModes){
      return configEditorRoot.currentConfig?.authModes?.defaultMode !== 0
    }
    return false;
  }
)

export const selectApplicationConfigLoadingFinish = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => configEditorRoot.loadingAppConfigFinish
)

export const selectCurrEnvConnections = createSelector(
  selectCurrentConfig,
  (currentConfig) => currentConfig.environments || { current: '', other: [] } // in case application config has no `environments` property already established, add fallback object
)
export const selectUserViewAllContentEnabled = createSelector(
  selectConfigEditorRoot,
  (configEditorRoot) => {
    return configEditorRoot.currentConfig?.homeScreen?.homeLibrary?.showAllContents;
  }
)


