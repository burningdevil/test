import { HomeScreenConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem, HomeScreenConfigInfo } from '../data-model/HomeScreenConfigModels'

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenConfigType>
    configInfoList: Array<HomeScreenConfigInfo>
    previewDeviceType: string
}

export interface HomeScreenMainViewState {
    configList: Array<Partial<HomeScreenConfigType>>
    contentBundleList: Array<MainViewContentBundleType>
}

export interface HomeScreenBundleContentState {
    dossiers: Array<HomeScreenBundleContentListItem>
    documents: Array<HomeScreenBundleContentListItem>
    loadingDossiers: boolean,
    loadingDossiersFinish: boolean,
}

export interface RootState {
    configEditor: HomeScreenConfigEditorState,
    configMain: HomeScreenMainViewState,
    bundleContent: HomeScreenBundleContentState
}
