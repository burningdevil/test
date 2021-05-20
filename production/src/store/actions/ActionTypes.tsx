import { GeneralSettingsType, HomeScreenConfigType } from '../../types/data-model/HomeScreenConfigModels'

export interface SetCurrentConfigActionType {
    type: string,
    data: HomeScreenConfigType,
}
export interface UpdateGeneralSettingsActionType {
    type: string,
    data: GeneralSettingsType,
}

export type ActionTypes = UpdateGeneralSettingsActionType | SetCurrentConfigActionType