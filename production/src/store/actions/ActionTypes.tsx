import { HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType } from '../../types/data-model/HomeScreenConfigModels'

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

export type ActionTypes = UpdateCurrentConfigActionType | SetCurrentConfigActionType | LoadConfigListSuccessActionType | LoadContentBundleListSuccessActionType