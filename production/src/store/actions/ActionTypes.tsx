import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem } from '../../types/data-model/HomeScreenConfigModels'

export interface LoadConfigListSuccessActionType {
    type: string,
    data: Array<HomeScreenConfigType>,
}

export interface LoadContentBundleListSuccessActionType {
    type: string,
    data: Array<MainViewContentBundleType>,
}

export interface SetCurrentConfigActionType {
    type: string,
    data: HomeScreenEditConfigType,
}

export interface UpdateCurrentConfigActionType {
    type: string,
    data: Partial<HomeScreenEditConfigType>,
}

export interface AppendBundleContentDossierActionType {
    type: string,
    data: HomeScreenBundleContentListItem[],
}

export interface AppendBundleContentDocumentActionType {
    type: string,
    data: HomeScreenBundleContentListItem[],
}

export interface StartLoadingBundleContentList {
    type: string
}

export interface FinishLoadingBundleContentList {
    type: string
}

export type ActionTypes = UpdateCurrentConfigActionType | SetCurrentConfigActionType | LoadConfigListSuccessActionType | LoadContentBundleListSuccessActionType | AppendBundleContentDocumentActionType | AppendBundleContentDossierActionType
| StartLoadingBundleContentList | FinishLoadingBundleContentList
