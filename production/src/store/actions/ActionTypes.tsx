import { GenerlSettingsType } from '../../types/redux-state/HomeScreenConfigEditorState'

export interface UpdateGeneralSettingsActionType {
    type: string,
    data: GenerlSettingsType,
}

export type ActionTypes = UpdateGeneralSettingsActionType