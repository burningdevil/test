import * as React from 'react'
import { default as VC, localizedStrings, childrenIcons, iconDetail, iconTypes, platformType, reviewType, dossierIconKeys, libraryIconKeys, sidebarIconKeys, iconValidKey } from '../HomeScreenConfigConstant'
import { Layout, Radio } from 'antd'
import { PlusCircleOutlined, DownOutlined } from '@ant-design/icons'
import '../scss/HomeScreenPreviewer.scss'
import * as _ from 'lodash'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { connect } from 'react-redux'
import { selectCurrentConfig, selectIsDossierAsHome, selectPreviewDeviceType, selectIsToolbarHidden, selectIsToolbarCollapsed, selectSelectedSideBarIcons, selectSelectedLibraryIcons, selectSelectedDocumentIcons } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'

const classNamePrefix = 'homeScreenPreviewer';

class HomeScreenPreviewer extends React.Component<any, any> {
    iconShouldShow(icon: iconDetail) {
        const {libraryIcons, documentIcons, sidebarIcons} = this.props
        const validKey = iconValidKey(icon.key)
        if (sidebarIconKeys.includes(icon.key)) {
            return sidebarIcons.includes(validKey)
        } else {
            if (libraryIconKeys.includes(icon.key)) {
                return libraryIcons.includes(validKey)
            }
            if (dossierIconKeys.includes(icon.key)) {
                return documentIcons.includes(validKey)
            }
        }
        return icon.key === iconTypes.home.key
    }

    // call back
    onDeviceTypeChange = (e: any) => {
        this.props.handleDeviceTypeChange(e.target.value)
    }

     // render device type radio buttons
    deviceTypesRender = (deviceType: string) => {
        const { platforms } = this.props.config
        const mobileDisabled = !platforms.includes(platformType.mobile)
        const webDisabled = !platforms.includes(platformType.web)
        const desktopDisabled = !platforms.includes(platformType.desktop)
        
        return <div className={`${classNamePrefix}-radio`}>
            {localizedStrings.PREVIEW}
            <div>
                <Radio.Group
                    onChange={this.onDeviceTypeChange}
                    value={deviceType}
                    buttonStyle='solid'
                    size='small'
                >
                   {!mobileDisabled && <Radio.Button value={reviewType.TABLET}>{localizedStrings.TABLET}</Radio.Button>}
                   {!mobileDisabled && <Radio.Button value={reviewType.PHONE}>{localizedStrings.PHONE}</Radio.Button>}
                    <Radio.Button value={reviewType.WEB} disabled={webDisabled}>{localizedStrings.WEB}</Radio.Button>
                    <Radio.Button value={reviewType.DESKTOP} disabled={desktopDisabled}>{localizedStrings.DESKTOP}</Radio.Button>
                </Radio.Group>
            </div>
        </div>
    }

    // render of titles
    titleRender = (title: string) => {
        return <div className={`${classNamePrefix}-title`}>{title}</div> 
    }

    // render arry of icons
    toolbarIconsRender = (iconsToRender: iconDetail[]) => {
        return iconsToRender.map( (element, index) => {
            return this.iconShouldShow(element) && 
                <span className={element.iconName} key={index}> </span>
        }) 
    }

    // render array of side bar icons
    sidebarIconsRender = (iconsToRender: iconDetail[], rootClassName: string) => {
        const sidebarIcons = iconsToRender
            .filter ( (element) => element.key !== iconTypes.accountMobile.key )
            .map( (element, index) => {
            const showAddButton = iconTypes.myGroup.key === element.key
            const showExpandIcon = iconTypes.myGroup.key === element.key || iconTypes.defaultGroup.key === element.key
            const showContent = iconTypes.defaultGroup.key === element.key
            return this.iconShouldShow(element) &&
                <div>
                    <div className={`${classNamePrefix}-pad-overview-left-text`}> <span className={element.iconName} key={index}/> 
                        <span>{showContent ? this.props.config.homeScreen.homeLibrary.defaultGroupsName : element.displayText}</span> 
                        {showAddButton && <PlusCircleOutlined/>}
                        {showExpandIcon && <DownOutlined style={{fontSize: '5px', marginLeft: 'auto', marginRight: '4px'}}/>}
                    </div>
                    {showContent && <div className={`${classNamePrefix}-pad-overview-left-blank`}>
                                        <div className={`${classNamePrefix}-pad-overview-left-blank-fill`}/>
                                    </div>}
                    {showContent && <div className={`${classNamePrefix}-pad-overview-left-blank`}>
                                        <div className={`${classNamePrefix}-pad-overview-left-blank-fill`}/>
                                    </div>}
                </div> 
        })
        // account for mobile
        const {deviceType} = this.props
        const accountShow = (deviceType === reviewType.PHONE || deviceType === reviewType.TABLET)
        const accountIcon = accountShow && <div className={`${classNamePrefix}-pad-overview-left-down`}> {this.toolbarIconsRender([iconTypes.previewAccountMobile])}</div>
        return <div className={rootClassName}> {sidebarIcons} {accountIcon} </div>
    }

    // overlay of header toolbar
    overlayRender = (centered: boolean) => {
        const style = {top: '0px', right:  centered ? '86px' : '16px'}
        return <div> 
            <div className={`${classNamePrefix}-overlay`} style={style}> </div>
            <div className={`${classNamePrefix}-overlay-icon`} style={style}> <span className={iconTypes.previewFullScreen.iconName}> </span> </div> 
            </div>
    }

    placeHolderRender = (left: string, renderExpander: boolean) => {
        const width = renderExpander ? '40px' : '30px'
        return <div style={{left: left, top: '8px', width: width, height: '5px', display: 'flex', alignItems: 'center', position: 'absolute'}}>
                <span style={{backgroundColor: 'rgb(224, 224, 224)', width: '100%', height: '5px'}} />
                {renderExpander && <DownOutlined style={{fontSize: '5px', marginLeft: '5px'}}/>}
             </div>
    }

    /// for previewer
    // dossier preview icons to render
    // split in header icons and footer icons
    // order : left most 1 -> ... -> left most n -> right most 1 -> right most n
    dossierIconsToRender = () => {
        const {deviceType, isDossierHome} = this.props
        let headerIcons: iconDetail[] = []
        let footerIcons: iconDetail[] = []
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.toc, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment, iconTypes.notification] : [iconTypes.previewLibraryMobile, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.share, iconTypes.filter, iconTypes.comment]
                break
            case reviewType.PHONE:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.share] : [iconTypes.previewLibraryMobile, iconTypes.share]
                footerIcons = isDossierHome ? [iconTypes.comment, iconTypes.filter, iconTypes.notification, iconTypes.account] : [iconTypes.comment, iconTypes.bookmark, iconTypes.reset, iconTypes.filter]
                break
            case reviewType.WEB:
            case reviewType.DESKTOP:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.toc, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment, iconTypes.notification] : [iconTypes.previewLibraryWeb, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.accountWeb, iconTypes.share, iconTypes.filter, iconTypes.comment]
                break
            default:
                break
        }
        return {dossierHeaderIcons: headerIcons, dossierFooterIcons: footerIcons}
    }

    libraryIconsToRender = () => {
        const {deviceType} = this.props
        let headerIcons: iconDetail[] = []
        let footerIcons: iconDetail[] = []
        switch (deviceType) {
            case reviewType.TABLET:
                headerIcons = [iconTypes.previewSidebarMobile, iconTypes.notification, iconTypes.sortAndFilter, iconTypes.search]
                break
            case reviewType.WEB:
            case reviewType.DESKTOP:
                headerIcons = [iconTypes.previewSidebar, iconTypes.accountWeb, iconTypes.multiSelect, iconTypes.notification, iconTypes.sortAndFilter, iconTypes.search]
                break
            case reviewType.PHONE:
                headerIcons = [iconTypes.previewSidebarMobile]
                footerIcons = [iconTypes.search, iconTypes.sortAndFilter, iconTypes.notification]
                break
            default:
                break
        }
        return {libraryHeaderIcons: headerIcons, libraryFooterIcons: footerIcons}
    }

    previewerClassName = (deviceType: string, appender: string) => {
        switch (deviceType) {
            case reviewType.TABLET:
                return `${classNamePrefix}-pad` + appender 
            case reviewType.WEB:
            case reviewType.DESKTOP:
                return `${classNamePrefix}-web` + appender
            default:
                return ''
        }
    }

    render() {
        const {deviceType, isDossierHome, toolbarHidden, toolbarCollapsed} = this.props
        const {libraryHeaderIcons, libraryFooterIcons} = this.libraryIconsToRender()
        const {dossierHeaderIcons, dossierFooterIcons} = this.dossierIconsToRender()

        const showSideBar = this.iconShouldShow(iconTypes.sidebar) && !toolbarHidden // when toolbar disabled, sidebar will hide as well
        const showTocOnPhone = this.iconShouldShow(iconTypes.toc) && deviceType === reviewType.PHONE
        const showExpanderOverlay = toolbarCollapsed && !toolbarHidden
        const hideHeader = toolbarHidden || toolbarCollapsed

        const padLeftClassName = this.previewerClassName(deviceType, '-overview-left')
        const padRightClassName = showSideBar ?  this.previewerClassName(deviceType, '-overview-right-library') : this.previewerClassName(deviceType, '-overview-right-library-nosidebar')

        switch (deviceType) {
            case reviewType.TABLET:
            case reviewType.WEB:
            case reviewType.DESKTOP:
                return (
                    <div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library toolbars */}
                        {!isDossierHome && this.titleRender(localizedStrings.LIBRARYHOME)}
                        {!isDossierHome &&
                        <div style={{position: 'relative'}}>
                            <Layout className={this.previewerClassName(deviceType, '')}>
                                { !hideHeader &&
                                    <Layout.Header>
                                        {this.toolbarIconsRender(libraryHeaderIcons)}
                                    </Layout.Header>
                                }
                                <Layout>
                                    <Layout.Content className={this.previewerClassName(deviceType, '-content')}>
                                        <Layout className={this.previewerClassName(deviceType, '-container')}>
                                            <div className={this.previewerClassName(deviceType, '-overview')}>
                                                { showSideBar && this.sidebarIconsRender(childrenIcons, padLeftClassName) }
                                                <div className={this.previewerClassName(deviceType, '-overview-right')}>
                                                    { <div className={padRightClassName}> </div> }
                                                    { <div className={padRightClassName}> </div> }
                                                    { !showSideBar && <div className={padRightClassName}> </div>}
                                                </div>
                                            </div>
                                        </Layout>
                                    </Layout.Content>
                                </Layout>
                            </Layout>
                            {showExpanderOverlay && this.overlayRender(false)}
                        </div>
                        }

                        {/* dossier toolbars */}
                        {this.titleRender( isDossierHome ? localizedStrings.DOSSIERHOME : localizedStrings.DOSSIER_WINDOW_LOWERCASE )}
                        <div style={{position: 'relative'}}>
                            <Layout className={this.previewerClassName(deviceType, '')}>
                                { !hideHeader &&
                                    <Layout.Header>
                                        {this.toolbarIconsRender(dossierHeaderIcons)}
                                    </Layout.Header>
                                }
                                <Layout.Content className={this.previewerClassName(deviceType, '-content')}>
                                    <Layout className={this.previewerClassName(deviceType, '-container')}>
                                        <div className={this.previewerClassName(deviceType, '-overview')}>
                                            <div className={this.previewerClassName(deviceType, '-overview-right')}>
                                                {!hideHeader && <div className={this.previewerClassName(deviceType, '-overview-right-dossier')} />}
                                                {hideHeader && <div className={this.previewerClassName(deviceType, '-overview-right-dossier-nobar')} />}
                                            </div>
                                        </div>
                                    </Layout>
                                </Layout.Content>
                            </Layout>
                            {showExpanderOverlay && this.overlayRender(false)}
                        </div>

                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                )
            case reviewType.PHONE:
                return (
                    <div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library */}
                        {!isDossierHome && this.titleRender(localizedStrings.LIBRARYHOME)}

                        <div style={{position: 'relative'}}>
                            <div className={`${classNamePrefix}-horcontainer`}>
                                {/* library sidebar */}
                                {!isDossierHome && showSideBar &&
                                    <Layout className={`${classNamePrefix}-phone`}>
                                        {!hideHeader &&
                                        <Layout.Header >
                                            {this.placeHolderRender('auto', true)}
                                        </Layout.Header>
                                        }
                                        <Layout.Content className={`${classNamePrefix}-phone-content`}>{this.sidebarIconsRender(childrenIcons, `${classNamePrefix}-phone-sidebar`)}</Layout.Content>
                                    </Layout>
                                }

                                {/* library toolbar */}
                                {!isDossierHome && 
                                    <Layout className={`${classNamePrefix}-phone`}>
                                        { !hideHeader &&
                                            <Layout.Header>
                                                {this.toolbarIconsRender(libraryHeaderIcons)}
                                                {this.placeHolderRender(showSideBar ? '190px' : '123px', false)}
                                            </Layout.Header>
                                        }
                                        <Layout.Content className={`${classNamePrefix}-phone-content`}>
                                            <Layout className={`${classNamePrefix}-phone-container`}>
                                                <div className={`${classNamePrefix}-phone-container-library`}/>
                                            </Layout>
                                        </Layout.Content>
                                        { !hideHeader &&
                                            <footer className={`${classNamePrefix}-phone-footer`}>
                                                <span/>
                                                {this.toolbarIconsRender(libraryFooterIcons)}
                                                <span/>
                                            </footer>
                                        }
                                    </Layout>
                                }
                                { !isDossierHome && showExpanderOverlay && this.overlayRender(!showSideBar) }
                            </div>
                        </div>
                        
                        {/* dossier toolbars */}
                        {this.titleRender( isDossierHome ? localizedStrings.DOSSIERHOME : localizedStrings.DOSSIER_WINDOW_LOWERCASE )}
                        <div style={{position: 'relative'}} >
                            <Layout className={`${classNamePrefix}-phone`}>
                                { !hideHeader &&
                                    <Layout.Header>
                                        {this.toolbarIconsRender(dossierHeaderIcons)}
                                        {showTocOnPhone && <span className={iconTypes.previewTocPhone.iconName}/>}
                                    </Layout.Header>
                                }
                                <Layout.Content className={`${classNamePrefix}-phone-content`}>
                                    <Layout className={`${classNamePrefix}-phone-container`}>
                                        {!hideHeader && <div className={`${classNamePrefix}-phone-container-dossier`} />}
                                        {hideHeader && <div className={`${classNamePrefix}-phone-container-dossier-nobar`} />}
                                    </Layout>
                                </Layout.Content>
                                { !hideHeader &&
                                    <footer className={`${classNamePrefix}-phone-footer`}>
                                        <span/>
                                        {this.toolbarIconsRender(dossierFooterIcons)}
                                        <span/>
                                    </footer>
                                }
                            </Layout>
                            {showExpanderOverlay && this.overlayRender(true)}
                        </div>
                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                )
            default:
                break
        }
    }
}

const mapState = (state: RootState) => ({
    deviceType: selectPreviewDeviceType(state),
    config: selectCurrentConfig(state),
    isDossierHome: selectIsDossierAsHome(state),
    toolbarHidden: selectIsToolbarHidden(state),
    toolbarCollapsed: selectIsToolbarCollapsed(state),
    sidebarIcons: selectSelectedSideBarIcons(state),
    libraryIcons: selectSelectedLibraryIcons(state),
    documentIcons: selectSelectedDocumentIcons(state), 
})

const connector = connect(mapState, {
    handleDeviceTypeChange: Actions.updatePreviewDeviceType
})

export default connector(HomeScreenPreviewer)