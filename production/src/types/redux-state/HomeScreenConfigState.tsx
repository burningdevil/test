import { HomeScreenConfigType } from '../data-model/HomeScreenConfigModels'

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenConfigType>
}

export interface RootState {
    configEditor: HomeScreenConfigEditorState
}