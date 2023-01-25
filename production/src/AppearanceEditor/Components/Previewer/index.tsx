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
import { Layout, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './styles.scss';
import * as _ from 'lodash';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { connect } from 'react-redux';
import {
    selectCurrentConfig,
    selectIsDossierAsHome,
    selectPreviewDeviceType,
    selectIsToolbarHidden,
    selectIsToolbarCollapsed,
    selectSelectedSideBarIcons,
    selectSelectedLibraryCustomizedItems,
    selectSelectedLibraryIcons,
    selectSelectedDocumentIcons,
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

class Previewer extends React.Component<any, any> {
    contentBundleEnable = false;
    hasContent = false;
    constructor(props: any) {
        super(props);
        this.state = {
            showToolTip: false, // boolean or the index number.
        };
    }
    iconShouldShow(icon: iconDetail) {
        const { libraryIcons, documentIcons, sidebarIcons, isDossierHome } =
            this.props;
        const validKey = iconValidKey(icon.key);
        if (libraryCustomizedIconKeys.includes(icon.key)) {
            return _.get(
                this.props.libraryCustomizedItems,
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

    // render array of icons
    toolbarIconsRender = (iconsToRender: iconDetail[], view: string) => {
        const {
            web: webLogo = { type: 'URL', value: '' },
            mobile: mobileLogo = { type: 'URL', value: '' },
        } = (this.props.theme && this.props.theme.logos) || {};

        let { selectedTheme, formatting } =
            (this.props.theme && this.props.theme.color) || {};
        const isCustomColor = isCustomColorTheme(selectedTheme);
        formatting = !isCustomColor
            ? prefinedColorSets[selectedTheme]
            : formatting;


        const renderedIcons = iconsToRender.map((element, index) => {
            if (
                !this.iconShouldShow(element) ||
                !this.shouldShowPreview(element)
            ) {
                return;
            } else {
                const isLibraryWebLogo =
                    element.iconName === VC.FONT_PREVIEWSIDEBAR;
                const isLibraryMobileLogo =
                    element.iconName === VC.FONT_LIBRARY_MOBILE;
                let renderedLogo = (
                    <span className={element.iconName} key={index}>
                        {' '}
                    </span>
                );

                if (element.iconName === CONSTANTS.FONT_SEARCH) {
                    renderedLogo = (
                        <div className="icon_search_container">
                            <div
                                className={classnames('icon_search_box', {
                                    'no-theme': !selectedTheme,
                                })}
                            >
                                <span className={element.iconName} key={index}>
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
                                    className={classnames(
                                        'icon_sort_filter_box',
                                        { 'no-theme': !selectedTheme }
                                    )}
                                >
                                    <span className="icon_sort_filter_text">
                                        {localizedStrings.SORT_BY}: ..
                                    </span>
                                </div>
                                <span
                                    className={element.iconName}
                                    key={index}
                                ></span>
                            </div>
                        ) : (
                            <span
                                className={element.iconName}
                                key={index}
                            ></span>
                        );
                }

                if (
                    isLibraryWebLogo &&
                    webLogo.type === 'URL' &&
                    webLogo.value
                ) {
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
            }
        });

        const toolbarTitle = (
            <div
                className={classnames('toolbar-title-wrapper', {
                    'no-theme': !selectedTheme,
                })}
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
    sidebarIconsRender = (rootClassName: string) => {
        let { selectedTheme, formatting } =
            (this.props.theme && this.props.theme.color) || {};
        const isCustomColor = isCustomColorTheme(selectedTheme);
        formatting = !isCustomColor
            ? prefinedColorSets[selectedTheme]
            : formatting;

        const sidebarIcons = [];

        for (let i = 1; i <= 6; i++) {
            sidebarIcons.push(
                <div
                    className={classnames(
                        `${classNamePrefix}-pad-overview-left-text`,
                        { 'no-theme': !selectedTheme }
                    )}
                >
                    <span
                        className={classnames(`sidebar-icon-${i}`, {
                            'no-theme': !selectedTheme,
                        })}
                    />
                    <span
                        className={classnames(`sidebar-text-${i}`, {
                            'no-theme': !selectedTheme,
                        })}
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
                    views.MOBILE
                )}
            </div>
        );
        return (
            <div
                className={classnames(rootClassName, {
                    'no-theme': !selectedTheme,
                })}
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
        const { deviceType, isDossierHome } = this.props;
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
        if (this.hasContent) {
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
    componentWillReceiveProps(nextProps: any) {
        this.contentBundleEnable = nextProps.contentBundleFeatureEnable;
        this.hasContent = nextProps.hasContent;
    }
    render() {
        const {
            theme,
            deviceType,
            isDossierHome,
            toolbarHidden,
            toolbarCollapsed,
        } = this.props;
        const { libraryHeaderIcons, libraryFooterIcons } =
            this.libraryIconsToRender();
        const { dossierHeaderIcons, dossierFooterIcons } =
            this.dossierIconsToRender();
        const { sidebarHeaderIcons } = this.sidebarHeaderIconsToRender();

        const {
            web: webLogo = { type: 'URL', value: '' },
            favicon: faviconLogo = { type: 'URL', value: '' },
            mobile: mobileLogo = { type: 'URL', value: '' },
        } = theme?.logos || {};

        let { selectedTheme, formatting } = theme?.color || {};
        const isCustomColor = isCustomColorTheme(selectedTheme);
        formatting = !isCustomColor
            ? prefinedColorSets[selectedTheme]
            : formatting;
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
        } = formatting || {};

        const previewerRef = (el: any) => {
            if (el) {
                el.style.setProperty('--toolbar-fill', toolbarFill);
                el.style.setProperty('--toolbar-color', toolbarColor);
                el.style.setProperty('--sidebar-fill', sidebarFill);
                el.style.setProperty('--sidebar-color', sidebarColor);
                el.style.setProperty(
                    '--sidebar-active-fill',
                    sidebarActiveFill
                );
                el.style.setProperty(
                    '--sidebar-active-color',
                    sidebarActiveColor
                );
                el.style.setProperty('--canvas-fill', canvasFill);
                el.style.setProperty('--panel-color', panelColor);
                el.style.setProperty('--accent-color', accentColor);
                el.style.setProperty('--button-color', buttonColor);
                el.style.setProperty(
                    '--notification-badge-fill',
                    notificationBadgeFill
                );
            }
        };


        const showSideBar =
            this.iconShouldShow(iconTypes.sidebar) && !toolbarHidden; // when toolbar disabled, sidebar will hide as well
        const showTocOnPhone =
            this.iconShouldShow(iconTypes.toc) &&
            deviceType === reviewType.PHONE;
        const showExpanderOverlay = toolbarCollapsed && !toolbarHidden;
        const hideHeader = toolbarHidden || toolbarCollapsed;

        const padLeftClassName = this.previewerClassName(
            deviceType,
            '-overview-left'
        );
        const padRightClassName = showSideBar
            ? this.previewerClassName(deviceType, '-overview-right-library')
            : this.previewerClassName(
                  deviceType,
                  '-overview-right-library-nosidebar'
              );
        return (
            <div className={classNamePrefix} ref={previewerRef}>
                {/* library toolbars */}
                {!isDossierHome &&
                    this.titleRender(localizedStrings.LIBRARY_WINDOW)}
                {!isDossierHome && (
                    <div style={{ position: 'relative' }}>
                        <Layout
                            className={this.previewerClassName(deviceType, '')}
                        >
                            {!hideHeader && (
                                <Layout.Header
                                    className={classnames('library-header', {
                                        'no-theme': !selectedTheme,
                                    })}
                                >
                                    {this.toolbarIconsRender(
                                        libraryHeaderIcons,
                                        views.LIBRARY
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
                                            {this.sidebarIconsRender(
                                                padLeftClassName,
                                                deviceType
                                            )}
                                            <div
                                                className={this.previewerClassName(
                                                    deviceType,
                                                    '-overview-right'
                                                )}
                                            >
                                                <div className="library-content-filter">
                                                    <div className="title-wrapper">
                                                        <span
                                                            className={classnames(
                                                                'title',
                                                                {
                                                                    'no-theme':
                                                                        !selectedTheme,
                                                                }
                                                            )}
                                                        ></span>
                                                        <span
                                                            className={classnames(
                                                                'arrow',
                                                                {
                                                                    'no-theme':
                                                                        !selectedTheme,
                                                                }
                                                            )}
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
                    <Layout className={this.previewerClassName(deviceType, '')}>
                        {!hideHeader && (
                            <Layout.Header
                                className={classnames('dossier-header', {
                                    'no-theme': !selectedTheme,
                                })}
                            >
                                {this.toolbarIconsRender(
                                    dossierHeaderIcons,
                                    views.DOSSIER
                                )}
                            </Layout.Header>
                        )}
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
                    {showExpanderOverlay && this.overlayRender(false, true)}
                </div>

                {/* notification panel */}
                {/* {this.titleRender(sectionTitle.notificationPanel)} */}
            </div>
        );
    }
}

const mapState = (state: RootState) => ({
    deviceType: selectPreviewDeviceType(state),
    config: selectCurrentConfig(state),
    isDossierHome: selectIsDossierAsHome(state),
    toolbarHidden: selectIsToolbarHidden(state),
    toolbarCollapsed: selectIsToolbarCollapsed(state),
    libraryCustomizedItems: selectSelectedLibraryCustomizedItems(state),
    sidebarIcons: selectSelectedSideBarIcons(state),
    libraryIcons: selectSelectedLibraryIcons(state),
    documentIcons: selectSelectedDocumentIcons(state),
});

const connector = connect(mapState, {
    handleDeviceTypeChange: Actions.updatePreviewDeviceType,
});

export default connector(Previewer);
