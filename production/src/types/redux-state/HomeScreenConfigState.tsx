import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType } from '../data-model/HomeScreenConfigModels'

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenEditConfigType>
}

export interface HomeScreenMainViewState {
    configList: Array<HomeScreenConfigType>
    contentBundleList: Array<MainViewContentBundleType>
}
export interface RootState {
    configEditor: HomeScreenConfigEditorState,
    configMain: HomeScreenMainViewState
}
