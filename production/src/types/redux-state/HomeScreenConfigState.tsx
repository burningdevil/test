import {
    HomeScreenConfigType,
    MainViewContentBundleType,
    HomeScreenBundleContentListItem,
    HomeScreenConfigInfo,
    ColorPaletteType,
    ApplicationTheme
} from '../data-model/HomeScreenConfigModels';

export interface HomeScreenConfigEditorState {
    currentConfig: Partial<HomeScreenConfigType>;
    configInfoList: Array<HomeScreenConfigInfo>;
    isDuplicateConfig: boolean;
    isConfigNameError: boolean;
    isCustomEmailError: boolean;
    previewDeviceType: string;
    isStateChangeByManual: boolean;
}

export interface HomeScreenMainViewState {
    configList: Array<Partial<HomeScreenConfigType>>;
    configLoading: boolean;
    contentBundleList: Array<MainViewContentBundleType>;
}

export interface HomeScreenBundleContentState {
    dossiers: Array<HomeScreenBundleContentListItem>;
    documents: Array<HomeScreenBundleContentListItem>;
    loadingDossiers: boolean;
    loadingDossiersFinish: boolean;
    loadingDocuments: boolean;
    loadingDocumentsFinish: boolean;
}
export interface HomeScreenEditorContentBundleState {
    data: Array<HomeScreenBundleContentListItem>;
    loadingContentBundle: boolean;
    loadingContentBundleFinish: boolean;
}
export interface HomeScreenEditorColorPaletteState {
    data: Array<ColorPaletteType>;
    loadingColorPalette: boolean;
}

export interface ApplicationDesignEditorState {
    theme: ApplicationTheme;
}

export interface RootState {
    configEditor: HomeScreenConfigEditorState;
    configMain: HomeScreenMainViewState;
    bundleContent: HomeScreenBundleContentState;
    content: HomeScreenEditorContentBundleState;
    colorPalette?: HomeScreenEditorColorPaletteState;
    appDesignEditor: ApplicationDesignEditorState;
}
