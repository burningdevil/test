import { GeneralSettingsType } from '../../types/redux-state/HomeScreenConfigEditorState'

export interface UpdateGeneralSettingsActionType {
    type: string,
    data: GeneralSettingsType,
}

export type ActionTypes = UpdateGeneralSettingsActionType