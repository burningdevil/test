export interface GeneralSettingsType {
    name: string,
    description: string,
    platform: string
}

export interface HomeScreenType {
}

export interface ComponentsType {
}

export interface ContentBundlesType {
}

export interface AdvancedSettingsType {
}

export interface HomeScreenConfigState {
    general: GeneralSettingsType,
    homeScreen: HomeScreenType,
    components: ComponentsType,
    contentBundles: ContentBundlesType,
    advanceSettings: AdvancedSettingsType
}

export interface HomeScreenConfigEditorState {
    currentConfig: HomeScreenConfigState
}