import { t } from '../../i18n/i18next';

// all the available Theme Color
// useSystemSetting, light, dark, darkBlue, blue, red, green, yellow, custom
export const EnumSelectedThemes = {
    USE_SYSTEM_SETTING: 'useSystemSetting',
    LIGHT: 'light',
    DARK: 'dark',
    DARK_BLUE: 'darkBlue',
    BLUE: 'blue',
    RED: 'red',
    GREEN: 'green',
    YELLOW: 'yellow',
    CUSTOM: 'custom',
};

// color option labels in the settings panel
export const EnumSelectedThemeLabels = {
    USE_SYSTEM_SETTING: t('Use System Setting (Desktop App and iOS only)'),
    LIGHT: t('Light'),
    DARK: t('Dark'),
    DARK_BLUE: t('Dark Blue'),
    BLUE: t('Blue'),
    RED: t('Red'),
    GREEN: t('Green'),
    YELLOW: t('Yellow'),
    CUSTOM: t('Custom color'),
};

// theme color formatting properties of an application object (stored inside Metadata)
const EnumFormattingPropNames = {
    toolbarFill: 'toolbarFill',
    toolbarColor: 'toolbarColor',

    sidebarFill: 'sidebarFill',
    sidebarColor: 'sidebarColor',

    sidebarActiveFill: 'sidebarActiveFill',
    sidebarActiveColor: 'sidebarActiveColor',

    panelFill: 'panelFill',
    panelColor: 'panelColor',

    accentFill: 'accentFill',

    buttonColor: 'buttonColor',

    notificationBadgeFill: 'notificationBadgeFill',
};

// color set for library predefined themes, coming from UX
const prefinedColorSets = {
    [EnumSelectedThemes.RED]: {
        [EnumFormattingPropNames.toolbarFill]: '#C90E24',
        [EnumFormattingPropNames.toolbarColor]: '#FFEAEA',

        [EnumFormattingPropNames.sidebarFill]: '#FFF0F0',
        [EnumFormattingPropNames.sidebarColor]: '#27191F',

        [EnumFormattingPropNames.sidebarActiveFill]: '#E14B59',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#FAF7F7',
        [EnumFormattingPropNames.panelColor]: '#3A2F2F',

        [EnumFormattingPropNames.accentFill]: '#D0192B',

        [EnumFormattingPropNames.buttonColor]: '#FFFFFF',

        [EnumFormattingPropNames.notificationBadgeFill]: '#FFDA18',
    },
    [EnumSelectedThemes.YELLOW]: {
        [EnumFormattingPropNames.toolbarFill]: '#FFBD30',
        [EnumFormattingPropNames.toolbarColor]: '#0E0D0C',

        [EnumFormattingPropNames.sidebarFill]: '#FFF8E9',
        [EnumFormattingPropNames.sidebarColor]: '#352719',

        [EnumFormattingPropNames.sidebarActiveFill]: '#FFD646',
        [EnumFormattingPropNames.sidebarActiveColor]: '#2C2724',

        [EnumFormattingPropNames.panelFill]: '#FAF9F7',
        [EnumFormattingPropNames.panelColor]: '#4B3423',

        [EnumFormattingPropNames.accentFill]: '#F7AE13',

        [EnumFormattingPropNames.buttonColor]: '#1E1A16',

        [EnumFormattingPropNames.notificationBadgeFill]: '#EB4858',
    },
    [EnumSelectedThemes.GREEN]: {
        [EnumFormattingPropNames.toolbarFill]: '#088851',
        [EnumFormattingPropNames.toolbarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarFill]: '#EEF8F0',
        [EnumFormattingPropNames.sidebarColor]: '#182625',

        [EnumFormattingPropNames.sidebarActiveFill]: '#13875C',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#EFF4F0',
        [EnumFormattingPropNames.panelColor]: '#192627',

        [EnumFormattingPropNames.accentFill]: '#00875F',

        [EnumFormattingPropNames.buttonColor]: '#FFFFFF',

        [EnumFormattingPropNames.notificationBadgeFill]: '#FFE03D',
    },
    [EnumSelectedThemes.BLUE]: {
        [EnumFormattingPropNames.toolbarFill]: '#0074E7',
        [EnumFormattingPropNames.toolbarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarFill]: '#EDF8FF',
        [EnumFormattingPropNames.sidebarColor]: '#244D81',

        [EnumFormattingPropNames.sidebarActiveFill]: '#307BEC',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#ECEFF0',
        [EnumFormattingPropNames.panelColor]: '#4E4545',

        [EnumFormattingPropNames.accentFill]: '#0077D7',

        [EnumFormattingPropNames.buttonColor]: '#FFFFFF',

        [EnumFormattingPropNames.notificationBadgeFill]: '#FF0000',
    },
    [EnumSelectedThemes.DARK_BLUE]: {
        [EnumFormattingPropNames.toolbarFill]: '#194992',
        [EnumFormattingPropNames.toolbarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarFill]: '#1E2F49',
        [EnumFormattingPropNames.sidebarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarActiveFill]: '#C4D5F5',
        [EnumFormattingPropNames.sidebarActiveColor]: '#08122D',

        [EnumFormattingPropNames.panelFill]: '#ECEFF0',
        [EnumFormattingPropNames.panelColor]: '#0C1C35',

        [EnumFormattingPropNames.accentFill]: '#3067BB',

        [EnumFormattingPropNames.buttonColor]: '#FFFFFF',

        [EnumFormattingPropNames.notificationBadgeFill]: '#FFA800',
    },
    [EnumSelectedThemes.DARK]: {
        [EnumFormattingPropNames.toolbarFill]: '#29313B',
        [EnumFormattingPropNames.toolbarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarFill]: '#29313B',
        [EnumFormattingPropNames.sidebarColor]: '#FFFFFF',

        [EnumFormattingPropNames.sidebarActiveFill]: '#334A6A',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#23262A',
        [EnumFormattingPropNames.panelColor]: '#FFFFFF',

        [EnumFormattingPropNames.accentFill]: '#529AFE',

        [EnumFormattingPropNames.buttonColor]: '#29313B',

        [EnumFormattingPropNames.notificationBadgeFill]: '#F56B6B',
    },
};

export const isCustomColorTheme = (theme: string) => theme === EnumSelectedThemes.CUSTOM
    