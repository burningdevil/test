import * as React from 'react'
import { default as VC, childrenIcons, iconDetail, iconTypes } from '../HomeScreenConfigConstant'
import { Layout, Radio } from 'antd'
import '../scss/HomeScreenPreviewer.scss'
import * as _ from 'lodash'

type HomeScreenPreviewerProps = {
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
    sidebarIconsRender = (iconsToRender: iconDetail[]) => {
        return iconsToRender.map( (element, index) => {
            return this.iconShouldShow(element) && 
                <div> <span className={element.iconName} key={index}/> {element.displayText} </div>  
        })
    }

    // overlay of header toolbar
    overlayRender = () => {
        // return <div className="a123"> <span className={'icon-filter'}> </span> </div>
    }

    /// for previewer
    // dossier preview icons to render
    // split in header icons and footer icons
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
                headerIcons = [iconTypes.home, iconTypes.sidebar, iconTypes.notification, iconTypes.sortAndFilter, iconTypes.search]
                break
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                headerIcons = [iconTypes.home, iconTypes.previewSidebar, iconTypes.account, iconTypes.multiSelect, iconTypes.notification, iconTypes.search]
                break
            case VC.REVIEW_MODE_PHONE:
                headerIcons = [iconTypes.home, iconTypes.sidebar]
                footerIcons = [iconTypes.search, iconTypes.sortAndFilter, iconTypes.notification]
                break
            default:
                break
        }
        return {libraryHeaderIcons: headerIcons, libraryFooterIcons: footerIcons}
    }

    render() {
        const {deviceType, isDossierHome, toolbarHidden} = this.props
        const {libraryHeaderIcons, libraryFooterIcons} = this.libraryIconsToRender()
        const {dossierHeaderIcons, dossierFooterIcons} = this.dossierIconsToRender()
        const showSideBar = this.iconShouldShow(iconTypes.sidebar) 
        const showSortAndFilter = this.iconShouldShow(iconTypes.sortAndFilter) && (deviceType === VC.REVIEW_MODE_WEB || deviceType === VC.REVIEW_MODE_DESKTOP)
        const showToc = this.iconShouldShow(iconTypes.toc) && deviceType === VC.REVIEW_MODE_PHONE

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
                        <div>
                            <Layout className="homeScreenPreviewer-pad">
                                { !toolbarHidden &&
                                    <Layout.Header>
                                        <div className="homeScreenPreviewer-pad-header">
                                            {this.toolbarIconsRender(libraryHeaderIcons)}
                                        </div>
                                    </Layout.Header>
                                }
                                <Layout>
                                    <Layout.Content className="homeScreenPreviewer-pad-content">
                                        <Layout className="homeScreenPreviewer-pad-container">
                                            <div className="homeScreenPreviewer-pad-overview">
                                                { showSideBar && 
                                                    <div className="homeScreenPreviewer-pad-overview-left">
                                                        {this.sidebarIconsRender(childrenIcons)}
                                                    </div>
                                                }
                                                {
                                                    showSortAndFilter && this.toolbarIconsRender([iconTypes.sortAndFilter])
                                                }
                                                <div/>
                                                <div className={"homeScreenPreviewer-pad-overview-right"}>
                                                </div>
                                            </div>
                                        </Layout>
                                    </Layout.Content>
                                </Layout>
                            </Layout>
                            {toolbarHidden && this.overlayRender()}
                        </div>
                        }

                        {/* dossier toolbars */}
                        {this.titleRender( isDossierHome ? sectionTitle.dossierHome : sectionTitle.dossier )}
                        <div>
                            <Layout className="homeScreenPreviewer-pad">
                                { !toolbarHidden &&
                                    <Layout.Header>
                                        {this.toolbarIconsRender(dossierHeaderIcons)}
                                    </Layout.Header>
                                }
                                <Layout.Content className="homeScreenPreviewer-pad-content">
                                    <Layout className="homeScreenPreviewer-pad-container">
                                        <div className="homeScreenPreviewer-pad-overview">
                                            <div className="homeScreenPreviewer-pad-overview-right">
                                            </div>
                                        </div>
                                    </Layout>
                                </Layout.Content>
                            </Layout>
                            {toolbarHidden && this.overlayRender()}
                        </div>

                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                )
            case VC.REVIEW_MODE_PHONE:
                return (
                    <div>
                        {this.deviceTypesRender(deviceType)}

                        {/* library toolbars */}
                        {!isDossierHome && this.titleRender(sectionTitle.libraryHome)}
                        {!isDossierHome && 
                        <Layout className="homeScreenPreviewer-phone">
                            { !toolbarHidden &&
                                <Layout.Header>
                                    {this.toolbarIconsRender(libraryHeaderIcons)}
                                    {showToc && <span className={iconTypes.previewTocPhone.iconName}/>}
                                </Layout.Header>
                            }

                            <Layout.Content className="homeScreenPreviewer-phone-content">
                                <Layout className="homeScreenPreviewer-phone-container">
                                    <div className="homeScreenPreviewer-phone-container-top">
                                        <div className="homeScreenPreviewer-phone-container-top-first"/>
                                        <div className="homeScreenPreviewer-phone-container-top-second"/>
                                    </div>
                                    <div className="homeScreenPreviewer-phone-container-bottom first"/>
                                    <div className="homeScreenPreviewer-phone-container-bottom second"/>
                                </Layout>
                            </Layout.Content>
                            { !toolbarHidden &&
                                <footer className="homeScreenPreviewer-phone-footer">
                                    <span/>
                                    {this.toolbarIconsRender(libraryFooterIcons)}
                                    <span/>
                                </footer>
                            }
                        </Layout>
                        }
                        {toolbarHidden && this.overlayRender()}
                        
                        {/* dossier toolbars */}
                        {this.titleRender( isDossierHome ? sectionTitle.dossierHome : sectionTitle.dossier )}
                        <Layout className="homeScreenPreviewer-phone">
                            { !toolbarHidden &&
                                <Layout.Header>
                                    {this.toolbarIconsRender(dossierHeaderIcons)}
                                    {showToc && <span className={iconTypes.previewTocPhone.iconName}/>}
                                </Layout.Header>
                            }
                            <Layout.Content className="homeScreenPreviewer-phone-content">
                                <Layout className="homeScreenPreviewer-phone-container">
                                    <div className="homeScreenPreviewer-phone-container-top">
                                        <div className="homeScreenPreviewer-phone-container-top-first"/>
                                        <div className="homeScreenPreviewer-phone-container-top-second"/>
                                    </div>
                                    <div className="homeScreenPreviewer-phone-container-bottom first"/>
                                    <div className="homeScreenPreviewer-phone-container-bottom second"/>
                                </Layout>
                            </Layout.Content>
                            { !toolbarHidden &&
                                <footer className="homeScreenPreviewer-phone-footer">
                                    <span/>
                                    {this.toolbarIconsRender(dossierFooterIcons)}
                                    <span/>
                                </footer>
                            }
                        </Layout>
                        {toolbarHidden && this.overlayRender()}
                        {/* notification panel */}
                        {/* {this.titleRender(sectionTitle.notificationPanel)} */}
                    </div>
                )
            default:
                break
        }
    }
}