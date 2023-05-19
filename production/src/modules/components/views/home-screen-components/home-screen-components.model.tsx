import {
    isLibraryServerVersionMatch,
    LIBRARY_SERVER_VERSION_THRESHOLD,
    LIBRARY_SUPPORT_GRANULAR_CONTROL,
} from 'src/utils';
import { IconEnum, iconTypes, IconType } from '../../HomeScreenConfigConstant';
import { ICON_KEY_ENUM } from './icon-key-enum';
import { t } from '../../../../i18n/i18next';
import * as React from 'react';
export interface IconContextInfo {
    selected: boolean;
    iconKey: string;
    configurable?: boolean;
    independentSetting?: boolean; // Represents whether the gear button is turned off as the value is turned off
    expandable?: boolean;
    tooltipStr?: string;
    dummy?: boolean;
}
export interface SpecialIconContextInfo {
    [props: string]: {
        configurable?: boolean;
        independentSetting?: boolean;
        expandable?: boolean;
        children?: IconType[];
        independentWithChild?: boolean;
        tooltipStr?: any;
        dummy?: boolean;
    };
}

export const HomeScreenSpecialIconPreviousMap: SpecialIconContextInfo = {
    [iconTypes.sidebar.key]: {
        expandable: true,
        children: [
            iconTypes.all,
            iconTypes.addLibrary,
            iconTypes.myContent,
            iconTypes.favorites,
            iconTypes.recents,
            iconTypes.insights,
            iconTypes.mySubscribe,
            iconTypes.contentDiscovery,
            iconTypes.defaultGroup,
            iconTypes.myGroup,
            iconTypes.accountMobile,
        ],
    },
};

const getTocTooltip = (gif: string, text: string) => (
    <div
        style={{ display: 'inline-flex', marginTop: '6px', marginLeft: '4px' }}
    >
        <div className={gif}></div>
        <div style={{ marginLeft: '14px', lineHeight: '18px' }}>{t(text)}</div>
    </div>
);

const HomeScreenSpecialIconMap: SpecialIconContextInfo = {
    [iconTypes.sidebar.key]: {
        expandable: true,
        children: [
            iconTypes.all,
            iconTypes.myContent,
            iconTypes.favorites,
            iconTypes.recents,
            iconTypes.insights,
            iconTypes.mySubscribe,
            iconTypes.contentDiscovery,
            iconTypes.sidebarDownloads,
            iconTypes.defaultGroup,
            iconTypes.myGroup,
            iconTypes.accountMobile,
            iconTypes.addLibrary,
            iconTypes.switch_library,
        ],
    },

    [iconTypes.accountMobile.key]: {
        expandable: true,
        children: [
            iconTypes.mobile_userName,
            iconTypes.mobile_preferences,
            iconTypes.mobile_advancedSettings,
            iconTypes.mobile_helpAndLegal,
            iconTypes.mobile_logOut,
        ],
    },
    [iconTypes.mobile_preferences.key]: {
        expandable: true,
        children: [
            iconTypes.mobile_preferences_myLanguage,
            iconTypes.mobile_preferences_myTimeZone,
            iconTypes.mobile_preferences_myCalendar,
            iconTypes.mobile_preferences_faceIDLogin,
            iconTypes.mobile_preferences_takeATour,
            iconTypes.mobile_preferences_refreshViewAutomatically,
            iconTypes.mobile_preferences_smartDownload,
            iconTypes.mobile_preferences_automaticallyAddToLibrary,
        ],
    },
    [iconTypes.mobile_advancedSettings.key]: {
        expandable: true,
        children: [
            iconTypes.mobile_advancedSettings_appSettings,
            iconTypes.mobile_advancedSettings_securitySettings,
            iconTypes.mobile_advancedSettings_logging,
        ],
    },
    [iconTypes.mobile_helpAndLegal.key]: {
        expandable: true,
        children: [
            iconTypes.mobile_helpAndLegal_help,
            iconTypes.mobile_helpAndLegal_legal,
            iconTypes.mobile_helpAndLegal_reportProblem,
        ],
    },
    [iconTypes.accountWeb.key]: {
        expandable: true,
        independentWithChild: false,
        children: [
            iconTypes.web_userName,
            iconTypes.web_myLibraries,
            iconTypes.web_manageLibrary,
            iconTypes.web_preferences,
            iconTypes.web_switchWorkspace,
            iconTypes.web_takeATour,
            iconTypes.web_help,
            iconTypes.web_logOut,
        ],
    },
    [iconTypes.web_preferences.key]: {
        expandable: true,
        children: [
            iconTypes.web_preferences_myCalendar,
            iconTypes.web_preferences_myLanguage,
            iconTypes.web_preferences_myTimeZone,
        ],
    },
    [iconTypes.mobile_helpAndLegal_help.key]: {
        configurable: true,
    },
    [iconTypes.web_help.key]: {
        configurable: true,
    },
    [iconTypes.mobile_helpAndLegal_legal.key]: {
        configurable: true,
    },
    [iconTypes.mobile_advancedSettings_appSettings.key]: {
        tooltipStr: t('appSettingMsg'),
    },
    [iconTypes.mobile_advancedSettings_securitySettings.key]: {
        tooltipStr: t('securitySettingMsg'),
    },
    [iconTypes.mobile_advancedSettings_logging.key]: {
        tooltipStr: t('loggingSettingMsg'),
    },
    [iconTypes.filter_summary.key]: {
        configurable: true,
        independentSetting: true,
    },
    [iconTypes.share.key]: {
        expandable: true,
        children: [
            iconTypes.share_share,
            iconTypes.share_exportToExcel,
            iconTypes.share_exportToPDF,
            iconTypes.share_download,
            iconTypes.share_subscribe,
            iconTypes.share_annotate,
        ],
    },
    [iconTypes.account.key]: {
        expandable: true,
        children: [iconTypes.accountWebDossier, iconTypes.accountMobileDossier],
    },
    [iconTypes.accountWebDossier.key]: {
        dummy: true,
        expandable: true,
        children: [
            iconTypes.web_userName,
            iconTypes.web_myLibraries,
            iconTypes.web_manageLibrary,
            iconTypes.web_preferences,
            iconTypes.web_switchWorkspace,
            iconTypes.web_takeATour,
            iconTypes.web_help,
            iconTypes.web_logOut,
        ],
    },
    [iconTypes.accountMobileDossier.key]: {
        dummy: true,
        expandable: true,
        children: [
            iconTypes.mobile_userName,
            iconTypes.mobile_preferences,
            iconTypes.mobile_advancedSettings,
            iconTypes.mobile_helpAndLegal,
            iconTypes.mobile_logOut,
        ],
    },
    [iconTypes.modifiedDate.key]: {
        tooltipStr: t('timestampTip'),
    },
    [iconTypes.toc.key]: {
        expandable: true,
        children: [
            iconTypes.toc_header,
            iconTypes.toc_contentinfo,
            iconTypes.toc_chapter,
        ],
    },
    [iconTypes.toc_header.key]: {
        tooltipStr: getTocTooltip('toc_header_bg', 'toc_header_tip'),
    },
    [iconTypes.toc_contentinfo.key]: {
        tooltipStr: getTocTooltip('toc_content_bg', 'toc_content_tip'),
    },
};

export const getHomeScreenSpecialIconMap = (
    webVersion: string = LIBRARY_SERVER_VERSION_THRESHOLD
) => {
    if (
        webVersion &&
        isLibraryServerVersionMatch(
            webVersion,
            LIBRARY_SUPPORT_GRANULAR_CONTROL
        )
    ) {
        return HomeScreenSpecialIconMap;
    }
    return HomeScreenSpecialIconPreviousMap;
};

export const SpecialIconKeyMap = {
    [iconTypes.mobile_preferences.key]: ICON_KEY_ENUM.mobile_preferences,
    [iconTypes.mobile_advancedSettings.key]:
        ICON_KEY_ENUM.mobile_advancedSettings,
};
