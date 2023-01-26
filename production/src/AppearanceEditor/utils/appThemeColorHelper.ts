import { t } from '../../i18n/i18next';

// all the available Theme Color
// useSystemSetting, light, dark, darkBlue, blue, red, green, yellow, custom

export const EnumThemeTypes = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    DARK_BLUE: 'DARK_BLUE',
    BLUE: 'BLUE',
    RED: 'RED',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW',
    CUSTOM: 'CUSTOM',
};

export const EnumSelectedThemes = {
    [EnumThemeTypes.LIGHT]: 'light',
    [EnumThemeTypes.DARK]: 'dark',
    [EnumThemeTypes.DARK_BLUE]: 'darkBlue',
    [EnumThemeTypes.BLUE]: 'blue',
    [EnumThemeTypes.RED]: 'red',
    [EnumThemeTypes.GREEN]: 'green',
    [EnumThemeTypes.YELLOW]: 'yellow',
    [EnumThemeTypes.CUSTOM]: 'custom',
};

// color option labels in the settings panel
export const EnumSelectedThemeLabels = {
    [EnumThemeTypes.LIGHT]: t('Light'),
    [EnumThemeTypes.DARK]: t('Dark'),
    [EnumThemeTypes.DARK_BLUE]: t('Dark Blue'),
    [EnumThemeTypes.BLUE]: t('Blue'),
    [EnumThemeTypes.RED]: t('Red'),
    [EnumThemeTypes.GREEN]: t('Green'),
    [EnumThemeTypes.YELLOW]: t('Yellow'),
    [EnumThemeTypes.CUSTOM]: t('Custom color'),
};

// theme color formatting properties of an application object (stored inside Metadata)
export const EnumFormattingPropNames = {
    toolbarFill: 'toolbarFill',
    toolbarColor: 'toolbarColor',

    sidebarFill: 'sidebarFill',
    sidebarColor: 'sidebarColor',

    sidebarActiveFill: 'sidebarActiveFill',
    sidebarActiveColor: 'sidebarActiveColor',

    panelFill: 'panelFill',
    panelColor: 'panelColor',

    canvasFill: 'canvasFill',

    accentFill: 'accentFill',

    buttonColor: 'buttonColor',

    notificationBadgeFill: 'notificationBadgeFill',
};

// color set for library predefined themes, coming from UX
export const prefinedColorSets = {
    [EnumSelectedThemes.RED]: {
        [EnumFormattingPropNames.toolbarFill]: '#C90E24',
        [EnumFormattingPropNames.toolbarColor]: '#FFEAEA',

        [EnumFormattingPropNames.sidebarFill]: '#FFF0F0',
        [EnumFormattingPropNames.sidebarColor]: '#27191F',

        [EnumFormattingPropNames.sidebarActiveFill]: '#E14B59',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#FFFFFF',
        [EnumFormattingPropNames.panelColor]: '#3A2F2F',

        [EnumFormattingPropNames.canvasFill]: '#F3F1F1',

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

        [EnumFormattingPropNames.panelFill]: '#FFFFFF',
        [EnumFormattingPropNames.panelColor]: '#4B3423',

        [EnumFormattingPropNames.canvasFill]: '#F4F4F3',

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

        [EnumFormattingPropNames.panelFill]: '#FFFFFF',
        [EnumFormattingPropNames.panelColor]: '#192627',

        [EnumFormattingPropNames.canvasFill]: '#F1F2F2',

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

        [EnumFormattingPropNames.panelFill]: '#FFFFFF',
        [EnumFormattingPropNames.panelColor]: '#4E4545',

        [EnumFormattingPropNames.canvasFill]: '#F3F4F4',

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

        [EnumFormattingPropNames.panelFill]: '#FFFFFF',
        [EnumFormattingPropNames.panelColor]: '#0C1C35',

        [EnumFormattingPropNames.canvasFill]: '#F0F2F3',

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

        [EnumFormattingPropNames.canvasFill]: '#000000',

        [EnumFormattingPropNames.accentFill]: '#529AFE',

        [EnumFormattingPropNames.buttonColor]: '#29313B',

        [EnumFormattingPropNames.notificationBadgeFill]: '#F56B6B',
    },
    [EnumSelectedThemes.LIGHT]: {
        [EnumFormattingPropNames.toolbarFill]: '#FFFFFF',
        [EnumFormattingPropNames.toolbarColor]: '#29313B',

        [EnumFormattingPropNames.sidebarFill]: '#FFFFFF',
        [EnumFormattingPropNames.sidebarColor]: '#29313B',

        [EnumFormattingPropNames.sidebarActiveFill]: '#334A6A',
        [EnumFormattingPropNames.sidebarActiveColor]: '#FFFFFF',

        [EnumFormattingPropNames.panelFill]: '#23262A',
        [EnumFormattingPropNames.panelColor]: '#FFFFFF',

        [EnumFormattingPropNames.canvasFill]: '#F7F8FA', 

        [EnumFormattingPropNames.accentFill]: '#529AFE',

        [EnumFormattingPropNames.buttonColor]: '#29313B',

        [EnumFormattingPropNames.notificationBadgeFill]: '#F56B6B',
    }
};

const EnumColorPropTitleCategoryLabel = {
      toolbar: t('toolbar'),
      sidebar: t('sidebar'),
      panel: t('panel'),
      misc: t('misc'),
}

export const colorPropTitles = [
    [EnumColorPropTitleCategoryLabel.toolbar],
    [EnumFormattingPropNames.toolbarFill, t('background')],
    [EnumFormattingPropNames.toolbarColor, t('icon')],

    [EnumColorPropTitleCategoryLabel.sidebar],
    [EnumFormattingPropNames.sidebarFill, t('background')],
    [EnumFormattingPropNames.sidebarColor, t('text')],

    [EnumFormattingPropNames.sidebarActiveFill, t('active')],
    [EnumFormattingPropNames.sidebarActiveColor, t('activeText')],

    [EnumColorPropTitleCategoryLabel.panel],
    [EnumFormattingPropNames.panelFill, t('background')],
    [EnumFormattingPropNames.panelColor, t('text')],

    [EnumColorPropTitleCategoryLabel.misc],
    [EnumFormattingPropNames.canvasFill, t('canvasBackground')],

    [EnumFormattingPropNames.accentFill, t('accentColor')],

    [EnumFormattingPropNames.buttonColor, t('buttonText')],

    [EnumFormattingPropNames.notificationBadgeFill, t('notificationBadge')],
];

export const isCustomColorTheme = (theme: string) => theme === EnumSelectedThemes.CUSTOM;

export const isColorCodeValid = (hexCode: string) => {
    const sixHexPattern = new RegExp('#[A-Fa-f0-9]{6}$');
    return sixHexPattern.test(hexCode);
};
