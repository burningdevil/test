import * as React from 'react'
import { default as VC, childrenIcons, iconDetail, iconTypes } from '../HomeScreenConfigConstant'
import { Layout, Radio } from 'antd'
import { PlusCircleOutlined, DownOutlined } from '@ant-design/icons'
import '../scss/HomeScreenPreviewer.scss'
import * as _ from 'lodash'

type HomeScreenPreviewerProps = {
    toolbarDisabled: boolean,
    toolbarHidden: boolean,
    icons: string[],
    deviceType: string,
    isDossierHome: boolean,
    handleDeviceTypeChange: Function,
}

const deviceTypeText = {
    tablet: 'Tablet',
    phone: 'Phone',
    web: 'Web',
    desktop: 'Desktop',
}

const sectionTitle = {
    preview: 'Preview',
    libraryHome: 'Libary Window (Home)',
    dossier: 'Dossier Window',
    dossierHome: 'Dossier Window (Home)',
    notificationPanel: 'Notification Panel',
}

const img1 = require('../images/dossier-window-vis.svg')
const img2 = require('../images/library-home-dossiers.svg')
export class HomeScreenPreviewer extends React.Component<HomeScreenPreviewerProps, any> {
    iconShouldShow(icon: iconDetail) {
        const {icons} = this.props
        return icons.includes(icon.key) || icon.key === iconTypes.home.key
    }

    // call back
    onDeviceTypeChange = (e: any) => {
        this.props.handleDeviceTypeChange(e.target.value)
    }

     // render device type radio buttons
    deviceTypesRender = (deviceType: string) => {
        return <div className="homeScreenPreviewer-radio">
            {sectionTitle.preview}
            <div>
                <Radio.Group
                    onChange={this.onDeviceTypeChange}
                    value={deviceType}
                    buttonStyle='solid'
                    size="small"
                >
                    <Radio.Button value={VC.REVIEW_MODE_TABLET}>{deviceTypeText.tablet}</Radio.Button>
                    <Radio.Button value={VC.REVIEW_MODE_PHONE}>{deviceTypeText.phone}</Radio.Button>
                    <Radio.Button value={VC.REVIEW_MODE_WEB}>{deviceTypeText.web}</Radio.Button>
                    <Radio.Button value={VC.REVIEW_MODE_DESKTOP}>{deviceTypeText.desktop}</Radio.Button> 
                </Radio.Group>
            </div>
        </div>
    }

    // render of titles
    titleRender = (title: string) => {
        return <div className="homeScreenPreviewer-title">{title}</div> 
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
        const sidebarIcons = iconsToRender.map( (element, index) => {
            const showAddButton = iconTypes.myGroup.key === element.key
            const showExpandIcon = iconTypes.myGroup.key === element.key || iconTypes.defaultGroup.key === element.key
            const showContent = iconTypes.defaultGroup.key === element.key
            return this.iconShouldShow(element) &&
                <div>
                    <div className="homeScreenPreviewer-pad-overview-left-text"> <span className={element.iconName} key={index}/> 
                        <span>{element.displayText}</span> 
                        {showAddButton && <PlusCircleOutlined/>}
                        {showExpandIcon && <DownOutlined style={{fontSize: '5px', marginLeft: 'auto', marginRight: '4px'}}/>}
                    </div>
                    {showContent && <div className="homeScreenPreviewer-pad-overview-left-blank">
                                        <div className="homeScreenPreviewer-pad-overview-left-blank-fill"/>
                                    </div>}
                    {showContent && <div className="homeScreenPreviewer-pad-overview-left-blank">
                                        <div className="homeScreenPreviewer-pad-overview-left-blank-fill"/>
                                    </div>}
                </div> 
        })
        // account for mobile
        const {deviceType} = this.props
        const accountShow = (deviceType === VC.REVIEW_MODE_PHONE || deviceType === VC.REVIEW_MODE_TABLET) && this.iconShouldShow(iconTypes.previewAccountMobile)
        const accountIcon = accountShow && <div className="homeScreenPreviewer-pad-overview-left-down"> {this.toolbarIconsRender([iconTypes.previewAccountMobile])}</div>
        return <div className={rootClassName}> {sidebarIcons} {accountIcon} </div>
    }

    // overlay of header toolbar
    overlayRender = (centered: boolean) => {
        const style = {top: '0px', right:  centered ? '86px' : '16px'}
        return <div> 
            <div className={'homeScreenPreviewer-overlay'} style={style}> </div>
            <div className={'homeScreenPreviewer-overlay-Icon'} style={style}> <span className={iconTypes.previewFullScreen.iconName}> </span> </div> 
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
            case VC.REVIEW_MODE_TABLET:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment, iconTypes.notification] : [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.share, iconTypes.filter, iconTypes.comment]
                break
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment, iconTypes.notification] : [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment]
                break
            case VC.REVIEW_MODE_PHONE:
                headerIcons = [iconTypes.home, iconTypes.share]
                footerIcons = isDossierHome ? [iconTypes.comment, iconTypes.bookmark, iconTypes.reset, iconTypes.filter, iconTypes.notification, iconTypes.account] : [iconTypes.comment, iconTypes.bookmark, iconTypes.reset, iconTypes.filter]
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
            case VC.REVIEW_MODE_TABLET:
                // account in sidebar?
                headerIcons = [iconTypes.previewSidebarMobile, iconTypes.notification, iconTypes.sortAndFilter, iconTypes.search]
                break
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                headerIcons = [iconTypes.previewSidebar, iconTypes.account, iconTypes.multiSelect, iconTypes.notification, iconTypes.sortAndFilter, iconTypes.search]
                break
            case VC.REVIEW_MODE_PHONE:
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
            case VC.REVIEW_MODE_TABLET:
                return 'homeScreenPreviewer-pad' + appender 
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                return 'homeScreenPreviewer-web' + appender
            default:
                return ''
        }
    }

    render() {
        const {deviceType, isDossierHome, toolbarHidden, toolbarDisabled} = this.props
        const {libraryHeaderIcons, libraryFooterIcons} = this.libraryIconsToRender()
        const {dossierHeaderIcons, dossierFooterIcons} = this.dossierIconsToRender()

        const showSideBar = this.iconShouldShow(iconTypes.sidebar) && !toolbarDisabled // when toolbar disabled, sidebar will hide as well
        const showTocOnPhone = this.iconShouldShow(iconTypes.toc) && deviceType === VC.REVIEW_MODE_PHONE
        const showExpanderOverlay = toolbarHidden && !toolbarDisabled
        const hideHeader = toolbarHidden || toolbarDisabled

        const padLeftClassName = this.previewerClassName(deviceType, '-overview-left')
        const padRightClassName = showSideBar ?  this.previewerClassName(deviceType, '-overview-right-library') : this.previewerClassName(deviceType, '-overview-right-library-nosidebar')

        switch (deviceType) {
            case VC.REVIEW_MODE_TABLET:
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                return (
                    <div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library toolbars */}
                        {!isDossierHome && this.titleRender(sectionTitle.libraryHome)}
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
                        {this.titleRender( isDossierHome ? sectionTitle.dossierHome : sectionTitle.dossier )}
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
            case VC.REVIEW_MODE_PHONE:
                return (
                    <div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library */}
                        {!isDossierHome && this.titleRender(sectionTitle.libraryHome)}

                        {/* library sidebar */}
                        <div style={{position: 'relative'}}>
                            <div className="homeScreenPreviewer-horcontainer">
                                {showSideBar && 
                                <Layout className="homeScreenPreviewer-phone">
                                    {this.sidebarIconsRender(childrenIcons, 'homeScreenPreviewer-phone-sidebar')}
                                </Layout>
                                }

                                { /* library toolbar */}
                                {!isDossierHome && 
                                    <Layout className="homeScreenPreviewer-phone">
                                        { !hideHeader &&
                                            <Layout.Header>
                                                {this.toolbarIconsRender(libraryHeaderIcons)}
                                            </Layout.Header>
                                        }
                                        <Layout.Content className="homeScreenPreviewer-phone-content">
                                            <Layout className="homeScreenPreviewer-phone-container">
                                                <div className="homeScreenPreviewer-phone-container-library" />
                                            </Layout>
                                        </Layout.Content>
                                        { !hideHeader &&
                                            <footer className="homeScreenPreviewer-phone-footer">
                                                <span/>
                                                {this.toolbarIconsRender(libraryFooterIcons)}
                                                <span/>
                                            </footer>
                                        }
                                    </Layout>
                                }
                                { !isDossierHome && showExpanderOverlay && this.overlayRender(false) }
                            </div>
                        </div>
                        
                        {/* dossier toolbars */}
                        {this.titleRender( isDossierHome ? sectionTitle.dossierHome : sectionTitle.dossier )}
                        <div style={{position: 'relative'}} >
                            <Layout className="homeScreenPreviewer-phone">
                                { !hideHeader &&
                                    <Layout.Header>
                                        {this.toolbarIconsRender(dossierHeaderIcons)}
                                        {showTocOnPhone && <span className={iconTypes.previewTocPhone.iconName}/>}
                                    </Layout.Header>
                                }
                                <Layout.Content className="homeScreenPreviewer-phone-content">
                                    <Layout className="homeScreenPreviewer-phone-container">
                                        {!hideHeader && <div className="homeScreenPreviewer-phone-container-dossier" />}
                                        {hideHeader && <div className="homeScreenPreviewer-phone-container-dossier-nobar" />}
                                    </Layout>
                                </Layout.Content>
                                { !hideHeader &&
                                    <footer className="homeScreenPreviewer-phone-footer">
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