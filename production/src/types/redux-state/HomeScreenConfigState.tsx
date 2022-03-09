import { HomeScreenConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem, HomeScreenConfigInfo, ColorPaletteType } from '../data-model/HomeScreenConfigModels'

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenConfigType>
    configInfoList: Array<HomeScreenConfigInfo>
    colorPalettes: Array<ColorPaletteType>
    isDuplicateConfig: boolean
    isConfigNameError: boolean
    previewDeviceType: string,
    isStateChangeByManual: boolean
}

export interface HomeScreenMainViewState {
    configList: Array<Partial<HomeScreenConfigType>>
    configLoading: boolean
    contentBundleList: Array<MainViewContentBundleType>
}

export interface HomeScreenBundleContentState {
    dossiers: Array<HomeScreenBundleContentListItem>
    documents: Array<HomeScreenBundleContentListItem>
    loadingDossiers: boolean,
    loadingDossiersFinish: boolean,
    loadingDocuments: boolean,
    loadingDocumentsFinish: boolean
}
export interface HomeScreenEditorContentBundleState {
    data: Array<HomeScreenBundleContentListItem>
    loadingContentBundle: boolean,
    loadingContentBundleFinish: boolean,
}

export interface RootState {
    configEditor: HomeScreenConfigEditorState,
    configMain: HomeScreenMainViewState,
    bundleContent: HomeScreenBundleContentState,
    content: HomeScreenEditorContentBundleState
}
