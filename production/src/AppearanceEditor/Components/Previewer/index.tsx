import * as React from 'react';
import {
    default as VC,
    localizedStrings,
    iconDetail,
    iconTypes,
    reviewType,
    dossierIcons,
    dossierIconsDossierHome,
    libraryIconKeys,
    sidebarIconKeys,
    libraryCustomizedIconKeys,
    iconValidKey,
    extraDesktopIcons,
    extraMobileIcons,
    libraryCustomizedIconDefaultValues,
    CONSTANTS,
} from '../../../modules/components/HomeScreenConfigConstant';
import { Layout, Radio, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './styles.scss';
import * as _ from 'lodash';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { connect } from 'react-redux';
import {
    selectCurrentConfig,
    selectPreviewDeviceType,
} from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { Tooltip } from '@mstr/rc';
import classnames from 'classnames';
import {
    isCustomColorTheme,
    prefinedColorSets,
} from '../../utils/appThemeColorHelper';

const classNamePrefix = 'Previewer';
const views = {
    DOSSIER: 'dossier',
    LIBRARY: 'web',
    MOBILE: 'mobile',
};

const applyThemeColorsToPreviewer = (formats: any) => {
    const {
        toolbarFill,
        toolbarColor,
        sidebarFill,
        sidebarColor,
        sidebarActiveFill,
        sidebarActiveColor,
        canvasFill,
        accentColor,
        buttonColor,
        notificationBadgeFill,
        panelColor,
        panelFill
    } = formats || {};
    const root = document.documentElement;

    if (root) {
        root.style.setProperty('--toolbar-fill', toolbarFill);
        root.style.setProperty('--toolbar-color', toolbarColor);
        root.style.setProperty('--sidebar-fill', sidebarFill);
        root.style.setProperty('--sidebar-color', sidebarColor);
        root.style.setProperty('--sidebar-active-fill', sidebarActiveFill);
        root.style.setProperty('--sidebar-active-color', sidebarActiveColor);
        root.style.setProperty('--canvas-fill', canvasFill);
        root.style.setProperty('--panel-color', panelColor);
        root.style.setProperty('--panel-fill', panelFill);
        root.style.setProperty('--accent-color', accentColor);
        root.style.setProperty('--button-color', buttonColor);
        root.style.setProperty(
            '--notification-badge-fill',
            notificationBadgeFill
        );
    }
};

const getBoxBackground = (hex: string) => {
    const whiteDominantBackground = 'rgba(255, 255, 255, 0.09)';
    const blackDominantBackground = 'rgba(0,0,0, 0.09)';

    if (!hex) {
        return blackDominantBackground;
    }

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };

    /*
     * The relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white
     * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     * https://stackoverflow.com/questions/9780632/how-do-i-determine-if-a-color-is-closer-to-white-or-black
     */
    const L = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

    // If relative luminance is < 128, the color is close to white else it is close to black
    return L < 128 ? whiteDominantBackground : blackDominantBackground;
};
class Previewer extends React.Component<any, any> {
    contentBundleEnable = false;

    constructor(props: any) {
        super(props);
        this.state = {
            showToolTip: false, // boolean or the index number.
            //DE258921; ignore custom app setting, use default values for components in previewer
            isDossierHome: false,
            toolbarHidden: false,
            toolbarCollapsed: false,
            libraryCustomizedItems: {},
            sidebarIcons: ["all", "favorites", "recents",  "default_groups", "my_groups", "options"],
            libraryIcons: ["sidebars", "sort_and_filter", "search", "notifications", "multi_select", "options"],
            documentIcons: ["table_of_contents", "bookmarks", "reset", "filters", "comments", "share"],
            allowUserViewAllContents: false,
            hasContent: false,
        };
    }
    iconShouldShow(icon: iconDetail) {
        const { libraryIcons, documentIcons, sidebarIcons, isDossierHome } = this.state;

        const validKey = iconValidKey(icon.key);
        if (libraryCustomizedIconKeys.includes(icon.key)) {
            return _.get(
                this.state.libraryCustomizedItems,
                icon.key,
                libraryCustomizedIconDefaultValues[icon.key]
            );
        }
        if (sidebarIconKeys.includes(icon.key)) {
            return sidebarIcons.includes(validKey);
        } else {
            if (isDossierHome) {
                const dossierToolbarIcons = dossierIconsDossierHome
                    .concat(extraDesktopIcons)
                    .concat(extraMobileIcons)
                    .map((element) => element.key);
                if (dossierToolbarIcons.includes(icon.key)) {
                    return documentIcons.includes(validKey);
                }
            } else {
                // Library Icon
                const extraKeys = extraDesktopIcons
                    .concat(extraMobileIcons)
                    .map((v) => v.key);
                if (libraryIconKeys.concat(extraKeys).includes(icon.key)) {
                    return libraryIcons.includes(validKey);
                }
                // Dossier Icon
                const dossierToolbarIcons = dossierIcons
                    .concat(extraDesktopIcons)
                    .concat(extraMobileIcons)
                    .map((element) => element.key);
                if (dossierToolbarIcons.includes(icon.key)) {
                    return documentIcons.includes(validKey);
                }
            }
        }
        return icon.key === iconTypes.home.key;
    }

    shouldShowPreview = (icon: iconDetail) =>
        ![
            CONSTANTS.FONT_UNDO_REDO,
            CONSTANTS.FONT_REDO,
            CONSTANTS.FONT_EDIT_DOSSIER,
        ].includes(icon.iconName);

    // call back
    onDeviceTypeChange = (e: any) => {
        this.props.handleDeviceTypeChange(e.target.value);
    };
    handleTooltip = (event: any, index: number) => {
        if (event.target?.offsetWidth < event.target?.scrollWidth) {
            this.setState({
                showToolTip: index,
            });
        } else {
            this.setState({
                showToolTip: false,
            });
        }
    };
    hideTooltip = () => {
        this.setState({
            showToolTip: false,
        });
    };
    renderTabRadio = () => {
        const items = [
            {
                label: localizedStrings.TABLET,
                value: reviewType.TABLET,
                width: '25%',
            },
            {
                label: localizedStrings.PHONE,
                value: reviewType.PHONE,
                width: '25%',
            },
            {
                label: localizedStrings.WEB,
                value: reviewType.WEB,
                width: '24%',
            },
            {
                label: localizedStrings.DESKTOP,
                value: reviewType.DESKTOP,
                width: '26%',
            },
        ];
        return items.map((item, index) => {
            return (
                <Radio.Button style={{ width: item.width }} value={item.value}>
                    <Tooltip
                        placement="top"
                        title={item.label}
                        visible={this.state.showToolTip === index}
                    >
                        <div
                            className="ellipsis"
                            onMouseEnter={(e) => this.handleTooltip(e, index)}
                            onMouseLeave={this.hideTooltip}
                        >
                            {item.label}
                        </div>
                    </Tooltip>
                </Radio.Button>
            );
        });
    };
    // render device type radio buttons
    deviceTypesRender = (deviceType: string) => {
        return (
            <div className={`${classNamePrefix}-device-type-container`}>
                <Radio.Group
                    className={`${classNamePrefix}-device-type-group`}
                    onChange={this.onDeviceTypeChange}
                    value={deviceType}
                    style={{ display: 'flex' }}
                    buttonStyle="solid"
                    size="small"
                >
                    {this.renderTabRadio()}
                </Radio.Group>
            </div>
        );
    };

    // render of titles
    titleRender = (title: string) => {
        return <div className={`${classNamePrefix}-title`}>{title}</div>;
    };

    getRenderedIcon = (element: any, elementIndex: number, view: string, isNoTheme: boolean) => {
        const {
            web: webLogo = { type: 'URL', value: '' },
            mobile: mobileLogo = { type: 'URL', value: '' },
        } = (this.props.theme && this.props.theme.logos) || {};

        const { selectedTheme, formatting } =
            (this.props.theme && this.props.theme.color) || {};
        const isCustomColor = isCustomColorTheme(selectedTheme);
        const formats = !isCustomColor
            ? prefinedColorSets[selectedTheme]
            : formatting;

        const { toolbarFill } = formats || {};

        const isLibraryWebLogo = element.iconName === VC.FONT_PREVIEWSIDEBAR;
        const isLibraryMobileLogo = element.iconName === VC.FONT_LIBRARY_MOBILE;
        let renderedLogo = (
            <span className={element.iconName} key={elementIndex}>
                {' '}
            </span>
        );

        if (element.iconName === CONSTANTS.FONT_SEARCH) {
            renderedLogo = (
                <div className="icon_search_container">
                    <div
                        className={classnames('icon_search_box', {'no-theme': isNoTheme})}
                        style={{ background: getBoxBackground(toolbarFill) }}
                    >
                        <span className={element.iconName} key={elementIndex}>
                            {localizedStrings.SEARCH}
                        </span>
                    </div>
                </div>
            );
        } else if (element.iconName === CONSTANTS.FONT_SORT_FILTER) {
            renderedLogo =
                view === views.LIBRARY ? (
                    <div className="icon_sort_filter_container">
                        <div
                            className={classnames('icon_sort_filter_box', {'no-theme': isNoTheme})}
                            style={{
                                background: getBoxBackground(toolbarFill),
                            }}
                        >
                            <span className="icon_sort_filter_text">
                                {localizedStrings.SORT_BY}: ..
                            </span>
                        </div>
                        <span
                            className={element.iconName}
                            key={elementIndex}
                        ></span>
                    </div>
                ) : (
                    <span
                        className={element.iconName}
                        key={elementIndex}
                    ></span>
                );
        }

        if (isLibraryWebLogo && webLogo.type === 'URL' && webLogo.value) {
            renderedLogo = (
                <div className="replaced-logo-wrapper">
                    <img
                        className={classnames('replaced-logo web')}
                        src={webLogo.value}
                    />
                </div>
            );
        }
        if (
            isLibraryMobileLogo &&
            mobileLogo.type === 'URL' &&
            mobileLogo.value
        ) {
            renderedLogo = (
                <div className="replaced-logo-wrapper">
                    <img
                        className={classnames('replaced-logo mobile')}
                        src={mobileLogo.value}
                    />
                </div>
            );
        }
        return renderedLogo;
    };

    getRenderedIconArray = (iconsToRender: iconDetail[], view: string, isNoTheme: boolean) => {
        return iconsToRender.map((element: any, index: number) => {
            if (
                !this.iconShouldShow(element) ||
                !this.shouldShowPreview(element)
            ) {
                return;
            } else {
                return this.getRenderedIcon(element, index, view, isNoTheme);
            }
        });
    };

    // render array of icons
    toolbarIconsRender = (iconsToRender: iconDetail[], view: string, isNoTheme: boolean) => {
        const renderedIcons = this.getRenderedIconArray(iconsToRender, view, isNoTheme);

        const toolbarTitle = (
            <div
                className={classnames('toolbar-title-wrapper', {'no-theme': isNoTheme})}
            >
                <span className="title"></span>
            </div>
        );

        if (view === views.DOSSIER) {
            renderedIcons.push(toolbarTitle);
        }

        return renderedIcons;
    };

    // render array of side bar icons
    sidebarIconsRender = (rootClassName: string, isNoTheme: boolean) => {
        const sidebarIcons = [];

        for (let i = 1; i <= 6; i++) {
            sidebarIcons.push(
                <div
                    className={classnames(`${classNamePrefix}-pad-overview-left-text`, {'no-theme': isNoTheme})}
                >
                    <span
                        className={classnames(`sidebar-icon-${i}`, {'no-theme': isNoTheme})}
                    />
                    <span
                        className={classnames(`sidebar-text-${i}`, {'no-theme': isNoTheme})}
                    />
                </div>
            );
        }

        // account for mobile
        const { deviceType } = this.props;
        const accountShow =
            deviceType === reviewType.PHONE || deviceType === reviewType.TABLET;
        const accountIcon = accountShow && (
            <div className={`${classNamePrefix}-pad-overview-left-down`}>
                {' '}
                {this.toolbarIconsRender(
                    [iconTypes.accountMobile],
                    views.MOBILE,
                    isNoTheme
                )}
            </div>
        );
        return (
            <div
                className={classnames(rootClassName, {'no-theme': isNoTheme})}
            >
                {' '}
                {sidebarIcons} {accountIcon}{' '}
            </div>
        );
    };

    // overlay of header toolbar
    overlayRender = (centered: boolean, customFullScreen?: boolean) => {
        const style = { top: '0px', right: centered ? '86px' : '16px' };
        const overlayClassName = customFullScreen
            ? `${classNamePrefix}-overlay-custom`
            : `${classNamePrefix}-overlay`;
        const overlayClassIconName = customFullScreen
            ? `${classNamePrefix}-overlay-icon-custom`
            : `${classNamePrefix}-overlay-icon`;
        return (
            <div>
                <div className={overlayClassName} style={style}>
                    {' '}
                </div>
                <div className={overlayClassIconName} style={style}>
                    {' '}
                    <span
                        className={
                            customFullScreen
                                ? iconTypes.previewFullScreenTablet.iconName
                                : iconTypes.previewFullScreen.iconName
                        }
                    >
                        {' '}
                    </span>{' '}
                </div>
            </div>
        );
    };

    placeHolderRender = (
        left: string,
        renderExpander: boolean,
        top?: string
    ) => {
        const width = renderExpander ? '40px' : '30px';
        return (
            <div
                style={{
                    left: left,
                    top: top ? top : '8px',
                    width: width,
                    height: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'absolute',
                }}
            >
                <span
                    style={{
                        backgroundColor: 'rgb(224, 224, 224)',
                        width: '100%',
                        height: '5px',
                    }}
                />
                {renderExpander && (
                    <DownOutlined
                        style={{ fontSize: '5px', marginLeft: '5px' }}
                    />
                )}
            </div>
        );
    };

    /// for previewer
    // dossier preview icons to render
    // split in header icons and footer icons
    // order : left most 1 -> ... -> left most n -> right most 1 -> right most n
    dossierIconsToRender = () => {
        const { deviceType } = this.props;
        const { isDossierHome } = this.state;
        let headerIcons: iconDetail[] = [];
        let footerIcons: iconDetail[] = [];
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = isDossierHome
                    ? [
                          iconTypes.toc,
                          iconTypes.account,
                          iconTypes.notification,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.filter,
                          iconTypes.aaFont,
                      ]
                    : [
                          iconTypes.previewLibraryMobile,
                          iconTypes.toc,
                          iconTypes.bookmark,
                          iconTypes.reset,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.filter,
                          iconTypes.aaFont,
                      ];
                break;
            case reviewType.PHONE:
                headerIcons = isDossierHome
                    ? [iconTypes.share, iconTypes.aaFont]
                    : [
                          iconTypes.previewLibraryMobile,
                          iconTypes.share,
                          iconTypes.aaFont,
                      ];
                footerIcons = isDossierHome
                    ? [
                          iconTypes.filter,
                          iconTypes.comment,
                          iconTypes.notification,
                          iconTypes.account,
                      ]
                    : [
                          iconTypes.bookmark,
                          iconTypes.reset,
                          iconTypes.filter,
                          iconTypes.comment,
                      ];
                break;
            case reviewType.WEB:
                headerIcons = isDossierHome
                    ? [
                          iconTypes.toc,
                          iconTypes.undoRedo,
                          iconTypes.redo,
                          iconTypes.editDossier,
                          iconTypes.account,
                          iconTypes.notification,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.filter,
                      ]
                    : [
                          iconTypes.previewLibraryWeb,
                          iconTypes.toc,
                          iconTypes.bookmark,
                          iconTypes.reset,
                          iconTypes.undoRedo,
                          iconTypes.redo,
                          iconTypes.editDossier,
                          iconTypes.accountWeb,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.filter,
                      ];
                break;
            case reviewType.DESKTOP:
                headerIcons = isDossierHome
                    ? [
                          iconTypes.toc,
                          iconTypes.undoRedo,
                          iconTypes.redo,
                          iconTypes.editDossier,
                          iconTypes.account,
                          iconTypes.notification,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.hyper,
                          iconTypes.filter,
                          iconTypes.dataSearch,
                      ]
                    : [
                          iconTypes.toc,
                          iconTypes.bookmark,
                          iconTypes.reset,
                          iconTypes.undoRedo,
                          iconTypes.redo,
                          iconTypes.editDossier,
                          iconTypes.share,
                          iconTypes.comment,
                          iconTypes.hyper,
                          iconTypes.filter,
                          iconTypes.dataSearch,
                      ];
                break;
            default:
                break;
        }
        return {
            dossierHeaderIcons: headerIcons,
            dossierFooterIcons: footerIcons,
        };
    };

    libraryIconsToRender = () => {
        const { deviceType } = this.props;
        let headerIcons: iconDetail[] = [];
        let footerIcons: iconDetail[] = [];
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = [
                    iconTypes.notification,
                    iconTypes.sortAndFilter,
                    iconTypes.search,
                ];
                break;
            case reviewType.WEB:
                headerIcons = [
                    iconTypes.previewSidebar,
                    iconTypes.accountWeb,
                    iconTypes.multiSelect,
                    iconTypes.notification,
                    iconTypes.sortAndFilter,
                    iconTypes.newDossier,
                    iconTypes.search,
                ];
                break;
            case reviewType.DESKTOP:
                headerIcons = [
                    iconTypes.deskHome,
                    iconTypes.accountWeb,
                    iconTypes.multiSelect,
                    iconTypes.notification,
                    iconTypes.sortAndFilter,
                    iconTypes.newDossier,
                    iconTypes.search,
                ];
                break;
            case reviewType.PHONE:
                headerIcons = [iconTypes.previewSidebarMobile];
                footerIcons = [
                    iconTypes.search,
                    iconTypes.sortAndFilter,
                    iconTypes.notification,
                ];
                break;
            default:
                break;
        }
        // special case: the new dossier button should be moved out when the content bundle is not empty.
        if (this.state.hasContent && !this.state.allowUserViewAllContents) {
            headerIcons = headerIcons.filter(
                (icon) => icon.key !== iconTypes.newDossier.key
            );
        }
        return {
            libraryHeaderIcons: headerIcons,
            libraryFooterIcons: footerIcons,
        };
    };
    sidebarHeaderIconsToRender = () => {
        const { deviceType } = this.props;
        let headerIcons: iconDetail[] = [];
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = [
                    iconTypes.previewSidebarTablet,
                    iconTypes.addLibrary,
                ];
                break;
            case reviewType.PHONE:
                headerIcons = [iconTypes.addLibrary];
                break;
            default:
                break;
        }
        return { sidebarHeaderIcons: headerIcons };
    };

    previewerClassName = (deviceType: string, appender: string) => {
        switch (deviceType) {
            case reviewType.TABLET:
                return `${classNamePrefix}-pad` + appender;
            case reviewType.WEB:
            case reviewType.DESKTOP:
                return `${classNamePrefix}-web` + appender;
            default:
                return '';
        }
    };

    getLibraryViewLayout = (
        deviceType: string,
        hideHeader: boolean,
        libraryHeaderIcons: iconDetail[],
        padLeftClassName: string,
        isNoTheme: boolean
    ) => {
        return (
            <Layout className={this.previewerClassName(deviceType, '')}>
                {!hideHeader && (
                    <Layout.Header
                        className={classnames(
                            'library-header',
                            {
                                'no-theme': isNoTheme
                            }
                        )}
                    >
                        {this.toolbarIconsRender(
                            libraryHeaderIcons,
                            views.LIBRARY,
                            isNoTheme
                        )}
                    </Layout.Header>
                )}
                <Layout>
                    <Layout.Content
                        className={this.previewerClassName(
                            deviceType,
                            '-content'
                        )}
                    >
                        <Layout
                            className={this.previewerClassName(
                                deviceType,
                                '-container'
                            )}
                        >
                            <div
                                className={this.previewerClassName(
                                    deviceType,
                                    '-overview'
                                )}
                            >
                                {this.sidebarIconsRender(padLeftClassName, isNoTheme)}
                                <div
                                    className={classnames(
                                        this.previewerClassName(
                                            deviceType,
                                            '-overview-right'
                                        ),
                                        'library-content',
                                        {'no-theme': isNoTheme}
                                    )}
                                >
                                    <div className="library-content-filter">
                                        <div className="title-wrapper">
                                            <span
                                                className={classnames('title', {'no-theme': isNoTheme})}
                                            ></span>
                                            <span
                                                className={classnames('arrow', {'no-theme': isNoTheme})}
                                            >
                                                {'\u2304'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="library-content-list">
                                        {
                                            <div className="library-item-col">
                                                {' '}
                                            </div>
                                        }
                                        {
                                            <div className="library-item-col">
                                                {' '}
                                            </div>
                                        }
                                        {
                                            <div className="library-item-col">
                                                {' '}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Layout>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    };

    getDossierViewLayout = (
        deviceType: string,
        hideHeader: boolean,
        dossierHeaderIcons: iconDetail[],
        isNoTheme: boolean
    ) => {
        return (
            <Layout className={this.previewerClassName(deviceType, '')}>
                {!hideHeader && (
                    <Layout.Header
                        className={classnames(
                            'dossier-header',
                            {
                                'no-theme': isNoTheme,
                            }
                        )}
                    >
                        {this.toolbarIconsRender(
                            dossierHeaderIcons,
                            views.DOSSIER,
                            isNoTheme
                        )}
                    </Layout.Header>
                )}
                <Layout.Content
                    className={this.previewerClassName(deviceType, '-content')}
                >
                    <Layout
                        className={this.previewerClassName(
                            deviceType,
                            '-container'
                        )}
                    >
                        <div
                            className={this.previewerClassName(
                                deviceType,
                                '-overview'
                            )}
                        >
                            <div
                                className={this.previewerClassName(
                                    deviceType,
                                    '-overview-right'
                                )}
                            >
                                <div className="library-content-list">
                                    {!hideHeader && (
                                        <div className="dossier-item-col" />
                                    )}
                                    {hideHeader && (
                                        <div
                                            className={this.previewerClassName(
                                                deviceType,
                                                '-overview-right-dossier-nobar'
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Layout>
                </Layout.Content>
            </Layout>
        );
    };

    getNotificationPanelViewLayout = (
        deviceType: string,
        isNoTheme: boolean
    ) => {
        const popoverContent = <React.Fragment>
            <div className='notification-list'>
                <div className='notification-wrapper'>
                    <div className={classnames('notification', 'n1', { 'no-theme': isNoTheme })}>
                        <div className={classnames('notification-icn', 'n1')} />
                        <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                            <div className='header'>
                                You have 1 new message in a discussion in <span>ITS</span>.
                            </div>
                            <div className='date'>08/24/2021</div>
                        </div>
                    </div>
                </div>
                <div className='notification-wrapper'>
                    <div className={classnames('notification', 'n2', { 'no-theme': isNoTheme })}>
                        <div className={classnames('notification-icn', 'n2')} />
                            <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                                <div className='header'>
                                    <span>Xiao, Qing</span> shared <span>TEC.PD</span> with you.
                                </div>
                                <div className='subheader'>
                                    Hi, here is the information I mentioned in our discussion earlier today. Thanks!
                                </div>
                            <div className='date'>08/24/2021</div>
                        </div>
                    </div>
                </div>
                <div className='notification-wrapper'>
                    <div className={classnames('notification', 'n3', { 'no-theme': isNoTheme })}>
                        <div className={classnames('notification-icn', 'n3')} />
                            <div className={classnames('notification-content', { 'no-theme': isNoTheme })}>
                                <div className='header'>
                                    <span>Kelley, Alan</span> shared <span>TEC.PD</span> with you.
                                </div>
                                <div className='subheader'>
                                    Here's the bookmark to find our features.
                                </div>
                                <div className='btn-row'>
                                    <div className={classnames('accept-btn', { 'no-theme': isNoTheme })}>Accept</div>
                                    <div className={classnames('ignore-btn', { 'no-theme': isNoTheme })}>Ignore</div>
                                </div>
                            <div className='date'>08/24/2021</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classnames('clear-btn', { 'no-theme': isNoTheme })}>Clear All</div>
        </React.Fragment>

        return (
            <Popover
                className={this.previewerClassName(deviceType, '-notification-panel')}
                overlayClassName={classnames(this.previewerClassName(deviceType, '-notification-panel-overlay'), { 'no-theme': isNoTheme })}
                content={popoverContent}
                title='Notifications'
                placement='bottom'
                transitionName='none'
                open
            >
                <div />
            </Popover>
        )
    };

    componentWillReceiveProps(nextProps: any) {
        this.contentBundleEnable = nextProps.contentBundleFeatureEnable;
    }
    render() {
        const { theme, deviceType } = this.props;

        const { isDossierHome, toolbarHidden, toolbarCollapsed } = this.state;

        const { libraryHeaderIcons } = this.libraryIconsToRender();
        const { dossierHeaderIcons } = this.dossierIconsToRender();

        const { selectedTheme, formatting } = theme?.color || {};
        const isCustomColor = isCustomColorTheme(selectedTheme);
        const formats = !isCustomColor ? prefinedColorSets[selectedTheme] : formatting;
        applyThemeColorsToPreviewer(formats);

        const showExpanderOverlay = toolbarCollapsed && !toolbarHidden;
        const hideHeader = toolbarHidden || toolbarCollapsed;

        const padLeftClassName = this.previewerClassName(
            deviceType,
            '-overview-left'
        );

        //Don't use theme color when no theme defined or light theme
        const isNoTheme = !selectedTheme || selectedTheme === 'light';

        return (
            <div className={classNamePrefix}>
                <div className={classNamePrefix + '-left'}>
                    {/* library toolbars */}
                    {!isDossierHome &&
                        this.titleRender(localizedStrings.LIBRARY_WINDOW)}
                    {!isDossierHome && (
                        <div style={{ position: 'relative' }}>
                            {this.getLibraryViewLayout(
                                deviceType,
                                hideHeader,
                                libraryHeaderIcons,
                                padLeftClassName,
                                isNoTheme
                            )}
                            {showExpanderOverlay && this.overlayRender(false, true)}
                        </div>
                    )}

                    {/* dossier toolbars */}
                    {this.titleRender(
                        isDossierHome
                            ? localizedStrings.DOSSIER_WINDOW_HOME
                            : localizedStrings.DOSSIER_WINDOW
                    )}
                    <div style={{ position: 'relative' }}>
                        {this.getDossierViewLayout(
                            deviceType,
                            hideHeader,
                            dossierHeaderIcons,
                            isNoTheme
                        )}
                        {showExpanderOverlay && this.overlayRender(false, true)}
                    </div>
                </div>
                <div className={classNamePrefix + '-right'}>
                    {/* notification panel */}
                    {this.titleRender('Notification Panel')}
                    <div style={{ position: 'relative' }}>
                        {this.getNotificationPanelViewLayout(
                            deviceType,
                            isNoTheme
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapState = (state: RootState) => ({
    deviceType: selectPreviewDeviceType(state),
    config: selectCurrentConfig(state),
});

const connector = connect(mapState, {
    handleDeviceTypeChange: Actions.updatePreviewDeviceType,
});

export default connector(Previewer);
