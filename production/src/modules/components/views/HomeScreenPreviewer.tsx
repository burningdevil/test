import * as React from 'react';
import {
    default as VC,
    localizedStrings,
    childrenIcons,
    iconDetail,
    iconTypes,
    platformType,
    reviewType,
    dossierIcons,
    dossierIconsDossierHome,
    libraryIconKeys,
    sidebarIconKeys,
    libraryCustomizedIconKeys,
    iconValidKey,
    extraDesktopIcons,
    extraMobileIcons,
    platformSpecificIconKeys,
    libraryCustomizedIconDefaultValues,
    CONTENT_BUNDLE_DEFAULT_GROUP_NAME,
} from '../HomeScreenConfigConstant';
import { Layout, Radio } from 'antd';
import { PlusCircleOutlined, DownOutlined } from '@ant-design/icons';
import '../scss/HomeScreenPreviewer.scss';
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
    selectUserViewAllContentEnabled,
} from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { Tooltip } from '@mstr/rc';
import { filterNonsupportIcons, getNonsupportIconKeys } from './HomeScreenUtils';
import { WebVersionContext } from './HomeScreenConfigEditor';
import { isLibraryServerVersionMatch, LIBRARY_SERVER_VERSION_THRESHOLD, LIBRARY_SUPPORT_DOSSIER_AS_HOME_BOOKMARK, LIBRARY_SUPPORT_GRANULAR_CONTROL, LIBRARY_SUPPORT_MOBILE_INSIGHTS } from '../../../../src/utils';

const classNamePrefix = 'homeScreenPreviewer';

class HomeScreenPreviewer extends React.Component<any, any> {
    contentBundleEnable = false;
    contentDiscoveryFeatureEnable = false;
    hasContent = false;
    constructor(props: any) {
        super(props);
        this.state = {
            showToolTip: false, // boolean or the index number.
        };
    }
    iconShouldShow(icon: iconDetail) {
        const { libraryIcons, documentIcons, sidebarIcons, isDossierHome, webVersion } =
            this.props;
        const nonsupportIconKeys = getNonsupportIconKeys(webVersion);
        if(nonsupportIconKeys.includes(icon.key)){
            return false;
        }
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
    toolbarIconsRender = (iconsToRender: iconDetail[]) => {
        return iconsToRender.map((element, index) => {
            return (
                this.iconShouldShow(element) && (
                    <span className={element.iconName} key={index}>
                        {' '}
                    </span>
                )
            );
        });
    };

    // render array of side bar icons
    sidebarIconsRender = (
        iconsToRender: iconDetail[],
        rootClassName: string,
        previewType: any,
        webVersion?: string
    ) => {
        iconsToRender = filterNonsupportIcons(iconsToRender, webVersion);
        if (!this.contentBundleEnable) {
            iconsToRender = iconsToRender.filter(
                (v) => v.key !== iconTypes.defaultGroup.key
            );
        }
        if (!this.contentDiscoveryFeatureEnable) {
            iconsToRender = iconsToRender.filter(
              (v) => v.key !== iconTypes.contentDiscovery.key
          );
        }
        if(previewType !== reviewType.WEB && !isLibraryServerVersionMatch(webVersion, LIBRARY_SUPPORT_MOBILE_INSIGHTS) ){
            iconsToRender = iconsToRender.filter(
                (v) => v.key !== iconTypes.insights.key
            );
        }
        if(previewType === reviewType.WEB ||  previewType === reviewType.DESKTOP){
            iconsToRender = iconsToRender.filter(
                (v) => ![iconTypes.sidebarDownloads.key, iconTypes.switch_library.key].includes(v.key)
            );
        }
        iconsToRender = iconsToRender.filter(
            (v) =>
                ![
                    iconTypes.addLibrary.key,
                    iconTypes.accountMobile.key,
                ].includes(v.key)
        );
        const sidebarIcons = iconsToRender.map((element, index) => {
            const showAddButton = iconTypes.myGroup.key === element.key;
            const showContent = iconTypes.defaultGroup.key === element.key;
            let defaultGroupName = localizedStrings.DEFAULT_GROUPS;
            if (
                this.props.config.homeScreen?.homeLibrary?.defaultGroupsName &&
                this.props.config.homeScreen?.homeLibrary?.defaultGroupsName !==
                    CONTENT_BUNDLE_DEFAULT_GROUP_NAME
            ) {
                defaultGroupName =
                    this.props.config.homeScreen?.homeLibrary?.defaultGroupsName;
            }
            return (
                this.iconShouldShow(element) && (
                    <div>
                        <div
                            className={`${classNamePrefix}-pad-overview-left-text`}
                        >
                            <span className={element.iconName} key={index} />
                            <span className="overflow">
                                {
                                    showContent
                                        ? defaultGroupName
                                        : element.displayText.replace(
                                              /\(.*?\)/g,   // NOSONAR
                                              ''
                                          ) // replace the (Mobile only) => ''
                                }
                            </span>
                            {showAddButton && (
                                <span
                                    className="icon-pnl_add-new"
                                    style={{
                                        fontSize: '5px',
                                        marginLeft: 'auto',
                                        marginRight: '4px',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )
            );
        });
        // account for mobile
        const { deviceType } = this.props;
        const accountShow =
            deviceType === reviewType.PHONE || deviceType === reviewType.TABLET;
        const accountIcon = accountShow && (
            <div className={`${classNamePrefix}-pad-overview-left-down`}>
                {' '}
                {this.toolbarIconsRender([iconTypes.accountMobile])}
            </div>
        );
        return (
            <div className={rootClassName}>
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
    dossierIconsToRender = (contextVersion: string) => {
        const { deviceType, isDossierHome } = this.props;
        let headerIcons: iconDetail[] = [];
        let footerIcons: iconDetail[] = [];
        const isSupportDosAsHomeShowBookmark = isLibraryServerVersionMatch(contextVersion, LIBRARY_SUPPORT_DOSSIER_AS_HOME_BOOKMARK)
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = isDossierHome
                    ? [
                          iconTypes.toc,
                          iconTypes.bookmark,
                          iconTypes.undoRedo,
                          iconTypes.redo,
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
                          iconTypes.undoRedo,
                          iconTypes.redo,
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
                          iconTypes.undoRedo,
                          iconTypes.redo,
                          iconTypes.bookmark,
                          iconTypes.filter,
                          iconTypes.comment,
                          iconTypes.notification,
                          iconTypes.account,
                      ]
                    : [
                          iconTypes.undoRedo,
                          iconTypes.redo,
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
                          iconTypes.bookmark,
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
                          iconTypes.bookmark,
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
        // if the version not support bookmark when isDocAsHome, should filter the bookmark
        if(!isSupportDosAsHomeShowBookmark && isDossierHome){
            headerIcons = headerIcons.filter(v => v.key !== iconTypes.bookmark.key);
            footerIcons = footerIcons.filter(v => v.key !== iconTypes.bookmark.key)
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
        // special case: the new dossier button should be moved out when the content bundle is not empty and the checkbox of allow user view all contents is not checked.
        if (this.hasContent && !this.props.allowUserViewAllContents) {
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
        this.contentDiscoveryFeatureEnable = nextProps.contentDiscoveryFeatureEnable;
        this.hasContent = nextProps.hasContent;
    }
    renderPreviews(contextVersion?: string) {
        const { deviceType, isDossierHome, toolbarHidden, toolbarCollapsed } =
            this.props;
        const { libraryHeaderIcons, libraryFooterIcons } =
            this.libraryIconsToRender();
        const { dossierHeaderIcons, dossierFooterIcons } =
            this.dossierIconsToRender(contextVersion);
        const { sidebarHeaderIcons } = this.sidebarHeaderIconsToRender();

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
        switch (deviceType) {
            case reviewType.TABLET:
                return (
                    <div>
                        <div className={`${classNamePrefix}-preview-title`}>
                            {localizedStrings.PREVIEW}
                        </div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library */}
                        {!isDossierHome &&
                            this.titleRender(localizedStrings.LIBRARY_WINDOW)}

                        <div style={{ position: 'relative' }}>
                            <div
                                className={`${classNamePrefix}-tablet-horcontainer`}
                            >
                                {/* library sidebar */}
                                {!isDossierHome && showSideBar && (
                                    <Layout
                                        className={`${classNamePrefix}-tablet-sidebar`}
                                    >
                                        {
                                            // Should always show header for phone sidebar even when toolbar collapse
                                            <Layout.Header
                                                style={{ height: '40px' }}
                                            >
                                                {this.toolbarIconsRender(
                                                    sidebarHeaderIcons
                                                )}
                                                {this.placeHolderRender(
                                                    'auto',
                                                    true,
                                                    '22px'
                                                )}
                                            </Layout.Header>
                                        }
                                        <Layout.Content
                                            className={`${classNamePrefix}-tablet-sidebar-content`}
                                        >
                                            {this.sidebarIconsRender(
                                                childrenIcons,
                                                `${classNamePrefix}-tablet-sidebar-sidebar`,
                                                deviceType,
                                                contextVersion
                                            )}
                                        </Layout.Content>
                                    </Layout>
                                )}

                                {/* library toolbar */}
                                {!isDossierHome && (
                                    <Layout
                                        className={`${classNamePrefix}-tablet-content`}
                                    >
                                        {!hideHeader && (
                                            <Layout.Header>
                                                {this.toolbarIconsRender(
                                                    libraryHeaderIcons
                                                )}
                                            </Layout.Header>
                                        )}
                                        <Layout.Content
                                            className={`${classNamePrefix}-tablet-content-content`}
                                        >
                                            <Layout
                                                className={`${classNamePrefix}-tablet-content-container`}
                                            >
                                                <div
                                                    className={this.previewerClassName(
                                                        deviceType,
                                                        '-overview-right'
                                                    )}
                                                >
                                                    {
                                                        <div
                                                            className={
                                                                padRightClassName
                                                            }
                                                        >
                                                            {' '}
                                                        </div>
                                                    }
                                                    {
                                                        <div
                                                            className={
                                                                padRightClassName
                                                            }
                                                        >
                                                            {' '}
                                                        </div>
                                                    }
                                                    {!showSideBar && (
                                                        <div
                                                            className={
                                                                padRightClassName
                                                            }
                                                        >
                                                            {' '}
                                                        </div>
                                                    )}
                                                </div>
                                            </Layout>
                                        </Layout.Content>
                                    </Layout>
                                )}
                                {!isDossierHome &&
                                    showExpanderOverlay &&
                                    this.overlayRender(false, true)}
                            </div>
                        </div>
                        {/* dossier toolbars */}
                        {this.titleRender(
                            isDossierHome
                                ? localizedStrings.DOSSIER_WINDOW_HOME
                                : localizedStrings.DOSSIER_WINDOW
                        )}
                        <div style={{ position: 'relative' }}>
                            <Layout
                                className={this.previewerClassName(
                                    deviceType,
                                    ''
                                )}
                            >
                                {!hideHeader && (
                                    <Layout.Header className="dossier-header">
                                        {this.toolbarIconsRender(
                                            dossierHeaderIcons
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
                                                {!hideHeader && (
                                                    <div
                                                        className={this.previewerClassName(
                                                            deviceType,
                                                            '-overview-right-dossier'
                                                        )}
                                                    />
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
                                    </Layout>
                                </Layout.Content>
                            </Layout>
                            {showExpanderOverlay &&
                                this.overlayRender(false, true)}
                        </div>

                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                );
            case reviewType.WEB:
            case reviewType.DESKTOP:
                return (

                    <div>
                        <div className={`${classNamePrefix}-preview-title`}>
                            {localizedStrings.PREVIEW}
                        </div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library toolbars */}
                        {!isDossierHome &&
                            this.titleRender(localizedStrings.LIBRARY_WINDOW)}
                        {!isDossierHome && (
                            <div style={{ position: 'relative' }}>
                                <Layout
                                    className={this.previewerClassName(
                                        deviceType,
                                        ''
                                    )}
                                >
                                    {!hideHeader && (
                                        <Layout.Header className="library-header">
                                            {this.toolbarIconsRender(
                                                libraryHeaderIcons
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
                                                    {showSideBar &&
                                                        this.sidebarIconsRender(
                                                            childrenIcons,
                                                            padLeftClassName,
                                                            deviceType,
                                                            contextVersion
                                                        )}
                                                    <div
                                                        className={this.previewerClassName(
                                                            deviceType,
                                                            '-overview-right'
                                                        )}
                                                    >
                                                        {
                                                            <div
                                                                className={
                                                                    padRightClassName
                                                                }
                                                            >
                                                                {' '}
                                                            </div>
                                                        }
                                                        {
                                                            <div
                                                                className={
                                                                    padRightClassName
                                                                }
                                                            >
                                                                {' '}
                                                            </div>
                                                        }
                                                        {!showSideBar && (
                                                            <div
                                                                className={
                                                                    padRightClassName
                                                                }
                                                            >
                                                                {' '}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Layout>
                                        </Layout.Content>
                                    </Layout>
                                </Layout>
                                {showExpanderOverlay &&
                                    this.overlayRender(false, true)}
                            </div>
                        )}

                        {/* dossier toolbars */}
                        {this.titleRender(
                            isDossierHome
                                ? localizedStrings.DOSSIER_WINDOW_HOME
                                : localizedStrings.DOSSIER_WINDOW
                        )}
                        <div style={{ position: 'relative' }}>
                            <Layout
                                className={this.previewerClassName(
                                    deviceType,
                                    ''
                                )}
                            >
                                {!hideHeader && (
                                    <Layout.Header className="dossier-header">
                                        {this.toolbarIconsRender(
                                            dossierHeaderIcons
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
                                                {!hideHeader && (
                                                    <div
                                                        className={this.previewerClassName(
                                                            deviceType,
                                                            '-overview-right-dossier'
                                                        )}
                                                    />
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
                                    </Layout>
                                </Layout.Content>
                            </Layout>
                            {showExpanderOverlay &&
                                this.overlayRender(false, true)}
                        </div>

                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                );
            case reviewType.PHONE:
                return (
                    <div>
                        <div className={`${classNamePrefix}-preview-title`}>
                            {localizedStrings.PREVIEW}
                        </div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library */}
                        {!isDossierHome &&
                            this.titleRender(localizedStrings.LIBRARY_WINDOW)}

                        <div style={{ position: 'relative' }}>
                            <div className={`${classNamePrefix}-horcontainer`}>
                                {/* library sidebar */}
                                {!isDossierHome && showSideBar && (
                                    <Layout
                                        className={`${classNamePrefix}-phone`}
                                    >
                                        {
                                            // Should always show header for phone sidebar even when toolbar collapse
                                            <Layout.Header>
                                                {this.toolbarIconsRender(
                                                    sidebarHeaderIcons
                                                )}
                                                {this.placeHolderRender(
                                                    'auto',
                                                    true
                                                )}
                                            </Layout.Header>
                                        }
                                        <Layout.Content
                                            className={`${classNamePrefix}-phone-content`}
                                        >
                                            {this.sidebarIconsRender(
                                                childrenIcons,
                                                `${classNamePrefix}-phone-sidebar`,
                                                deviceType,
                                                contextVersion
                                            )}
                                        </Layout.Content>
                                    </Layout>
                                )}

                                {/* library toolbar */}
                                {!isDossierHome && (
                                    <Layout
                                        className={`${classNamePrefix}-phone`}
                                    >
                                        {!hideHeader && (
                                            <Layout.Header>
                                                {this.toolbarIconsRender(
                                                    libraryHeaderIcons
                                                )}
                                                {this.placeHolderRender(
                                                    showSideBar
                                                        ? '190px'
                                                        : '123px',
                                                    false
                                                )}
                                            </Layout.Header>
                                        )}
                                        <Layout.Content
                                            className={`${classNamePrefix}-phone-content`}
                                        >
                                            <Layout
                                                className={`${classNamePrefix}-phone-container`}
                                            >
                                                <div
                                                    className={`${classNamePrefix}-phone-container-library`}
                                                />
                                            </Layout>
                                        </Layout.Content>
                                        {!hideHeader && (
                                            <footer
                                                className={`${classNamePrefix}-phone-footer`}
                                            >
                                                <span />
                                                {this.toolbarIconsRender(
                                                    libraryFooterIcons
                                                )}
                                                <span />
                                            </footer>
                                        )}
                                    </Layout>
                                )}
                                {!isDossierHome &&
                                    showExpanderOverlay &&
                                    this.overlayRender(!showSideBar, true)}
                            </div>
                        </div>

                        {/* dossier toolbars */}
                        {this.titleRender(
                            isDossierHome
                                ? localizedStrings.DOSSIER_WINDOW_HOME
                                : localizedStrings.DOSSIER_WINDOW
                        )}
                        <div style={{ position: 'relative' }}>
                            <Layout className={`${classNamePrefix}-phone`}>
                                {!hideHeader && (
                                    <Layout.Header>
                                        {this.toolbarIconsRender(
                                            dossierHeaderIcons
                                        )}
                                        {/* {showTocOnPhone && <span className={iconTypes.previewTocPhone.iconName}/>} */}
                                        {showTocOnPhone &&
                                            this.placeHolderRender(
                                                '123px',
                                                false,
                                                '10px'
                                            )}
                                    </Layout.Header>
                                )}
                                <Layout.Content
                                    className={`${classNamePrefix}-phone-content`}
                                >
                                    <Layout
                                        className={`${classNamePrefix}-phone-container`}
                                    >
                                        {!hideHeader && (
                                            <div
                                                className={`${classNamePrefix}-phone-container-dossier`}
                                            />
                                        )}
                                        {hideHeader && (
                                            <div
                                                className={`${classNamePrefix}-phone-container-dossier-nobar`}
                                            />
                                        )}
                                    </Layout>
                                </Layout.Content>
                                {!hideHeader && (
                                    <footer
                                        className={`${classNamePrefix}-phone-footer`}
                                    >
                                        <span />
                                        {this.toolbarIconsRender(
                                            dossierFooterIcons
                                        )}
                                        <span />
                                    </footer>
                                )}
                            </Layout>
                            {showExpanderOverlay &&
                                this.overlayRender(true, true)}
                        </div>
                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                );
            default:
                break;
        }
    }
    render() {
        return (
            <WebVersionContext.Consumer>
            {(value) => {
                return (
                    this.renderPreviews(value.webVersion ?? LIBRARY_SERVER_VERSION_THRESHOLD)
                );
            }}
            </WebVersionContext.Consumer>
        )


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
    allowUserViewAllContents: selectUserViewAllContentEnabled(state)
});

const connector = connect(mapState, {
    handleDeviceTypeChange: Actions.updatePreviewDeviceType
});

export default connector(HomeScreenPreviewer);
