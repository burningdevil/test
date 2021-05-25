import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem } from '../data-model/HomeScreenConfigModels'

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenEditConfigType>
    previewDeviceType: string
}

export interface HomeScreenMainViewState {
    configList: Array<HomeScreenConfigType>
    contentBundleList: Array<MainViewContentBundleType>
}

export interface HomeScreenBundleContentFetchState {
    dossiers: Array<HomeScreenBundleContentListItem>
    documents: Array<HomeScreenBundleContentListItem>
    loadingDossiers: boolean,
    loadingDossiersFinish: boolean,
}

export interface RootState {
    configEditor: HomeScreenConfigEditorState,
    configMain: HomeScreenMainViewState,
    bundleContentFetch: HomeScreenBundleContentFetchState
}
