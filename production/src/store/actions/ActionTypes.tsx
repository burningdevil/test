import { GeneralSettingsType, HomeScreenConfigType, HomeScreenEditConfigType, MainViewContentBundleType } from '../../types/data-model/HomeScreenConfigModels'

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
export interface UpdateGeneralSettingsActionType {
    type: string,
    data: GeneralSettingsType,
}

export type ActionTypes = UpdateGeneralSettingsActionType | SetCurrentConfigActionType | LoadConfigListSuccessActionType | LoadContentBundleListSuccessActionType