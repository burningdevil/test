import { TAGS } from 'src/modules/components/HomeScreenConfigConstant'
import { HomeScreenConfigType, MainViewContentBundleType, HomeScreenBundleContentListItem, ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'

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
    data: HomeScreenConfigType,
}

export interface UpdateCurrentConfigActionType {
    type: string,
    data: Partial<HomeScreenConfigType>,
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
    type: string,
    data: string
}

export interface FinishLoadingBundleContentList {
    type: string,
    data: string
}

export interface AppearanceEditorActionType {
    type: string,
    data: any
}

export interface UpdateFeatureActionType {
    type: string,
    data: Array<TAGS>
}

export type ActionTypes = UpdateCurrentConfigActionType | SetCurrentConfigActionType | LoadConfigListSuccessActionType | LoadContentBundleListSuccessActionType | AppendBundleContentDocumentActionType | AppendBundleContentDossierActionType
| StartLoadingBundleContentList | FinishLoadingBundleContentList | AppearanceEditorActionType | UpdateFeatureActionType
