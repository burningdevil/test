import * as React from 'react'
import { default as VC, libraryIcons, childrenIcons, iconDetail, iconTypes, toolbarDossierHomeIcons, toolbarDossierIcons, toolbarLibraryIcons } from '../HomeScreenConfigConstant'
import { Layout, Radio } from 'antd'
import '../scss/HomeScreenPreviewer.scss'
import * as _ from 'lodash'

type HomeScreenPreviewerProps = {
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
    preview: 'preview',
    libraryHome: 'Libary Window (Home)',
    dossierHome: 'Dossier Window',
    notificationPanel: 'Notification Panel',
}

const deviceTypeOptions = [
    { label: deviceTypeText.tablet, value: VC.REVIEW_MODE_TABLET },
    { label: deviceTypeText.phone, value: VC.REVIEW_MODE_PHONE },
    { label: deviceTypeText.web, value: VC.REVIEW_MODE_WEB },
    { label: deviceTypeText.desktop, value: VC.REVIEW_MODE_DESKTOP },
];

export class HomeScreenPreviewer extends React.Component<HomeScreenPreviewerProps, any> {
    constructor(props: any) {
        super(props)
    }

    onDeviceTypeChange = (e: any) => {
        this.props.handleDeviceTypeChange(e.target.value)
    }

     // render device type radio buttons
    deviceTypesRender = (deviceType: string) => {
        return <div className="homeScreenPreviewer-radio">
            {sectionTitle.preview}
            <Radio.Group
                options = {deviceTypeOptions}
                onChange={this.onDeviceTypeChange}
                value={deviceType}
                buttonStyle="solid"
            ></Radio.Group>
        </div>
    }

    titleRender = (title: string) => {
        return <div className="homeScreenPreviewer-title">{title}</div> 
    }

    // render arry of icons
    toolbarIconsRender = (iconsToRender: iconDetail[]) => {
        return iconsToRender.map( (element, index) => {
            const show = this.props.icons.includes(element.key) || element.key === iconTypes.home.key
            return show && <span className={element.iconName} key={index}> </span>
        }) 
    }

    // render array of side bar icons
    sidebarIconsRender = (iconsToRender: iconDetail[]) => {
        return iconsToRender.map( (element, index) => {
            return this.props.icons.includes(element.key) && 
                <div key={index}> <span className={element.iconName} key={index}/>  {element.key} </div>  
        })
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
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                headerIcons = isDossierHome ? [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment, iconTypes.notification] : [iconTypes.home, iconTypes.toc, iconTypes.bookmark, iconTypes.reset, iconTypes.account, iconTypes.share, iconTypes.filter, iconTypes.comment]
                break
            case VC.REVIEW_MODE_PHONE:
                headerIcons = [iconTypes.home, iconTypes.share, iconTypes.aaFont]
                footerIcons = isDossierHome ? [iconTypes.filter, iconTypes.comment, iconTypes.notification, iconTypes.account] : [iconTypes.filter, iconTypes.comment]
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
            case VC.REVIEW_MODE_WEB:
            case VC.REVIEW_MODE_DESKTOP:
                headerIcons = [iconTypes.home, iconTypes.sidebar, iconTypes.account, iconTypes.multiSelect, iconTypes.search, iconTypes.notification]
                break
            case VC.REVIEW_MODE_PHONE:
                headerIcons = [iconTypes.home, iconTypes.sortAndFilter]
                footerIcons = [iconTypes.search, iconTypes.filter, iconTypes.notification]
                break
            default:
                break
        }
        return {libraryHeaderIcons: headerIcons, libraryFooterIcons: footerIcons}
    }

    render() {
        const {deviceType, isDossierHome} = this.props
        const {libraryHeaderIcons, libraryFooterIcons} = this.libraryIconsToRender()
        const {dossierHeaderIcons, dossierFooterIcons} = this.dossierIconsToRender()

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
                                <Layout.Header>
                                    {this.toolbarIconsRender(libraryHeaderIcons)}
                                </Layout.Header>
                                <Layout>
                                    <Layout.Content className="homeScreenPreviewer-pad-content">
                                        <Layout className="homeScreenPreviewer-pad-container">
                                            <div className="homeScreenPreviewer-pad-overview">
                                                <div className="homeScreenPreviewer-pad-overview-left">
                                                    {this.sidebarIconsRender(childrenIcons)}
                                                </div>
                                                <div className="homeScreenPreviewer-pad-overview-right">
                                                    <div className="homeScreenPreviewer-pad-overview-right-sub"/>
                                                    <div/>
                                                </div>
                                            </div>
                                        </Layout>
                                    </Layout.Content>
                                </Layout>
                            </Layout>
                        </div>
                        }

                        {/* dossier toolbars */}
                        {this.titleRender(sectionTitle.dossierHome)}
                        <div>
                            <Layout className="homeScreenPreviewer-pad">
                                <Layout.Header>
                                    {this.toolbarIconsRender(dossierHeaderIcons)}
                                </Layout.Header>
                                <Layout.Content className="homeScreenPreviewer-pad-content">
                                    <Layout className="homeScreenPreviewer-pad-container">
                                        <div className="homeScreenPreviewer-pad-overview">
                                            <div className="homeScreenPreviewer-pad-overview-left"/>
                                            <div className="homeScreenPreviewer-pad-overview-right">
                                                <div className="homeScreenPreviewer-pad-overview-right-sub"/>
                                                <div/>
                                            </div>
                                        </div>
                                    </Layout>
                                </Layout.Content>
                            </Layout>
                        </div>

                        {/* notification panel */}
                        {this.titleRender(sectionTitle.notificationPanel)}
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
                            <Layout.Header>
                                {this.toolbarIconsRender(libraryHeaderIcons)}
                                <span className="icon-tb_undoarrow"/>
                            </Layout.Header>
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
                            <footer className="homeScreenPreviewer-phone-footer">
                                <span/>
                                {this.toolbarIconsRender(libraryFooterIcons)}
                                <span/>
                            </footer>
                        </Layout>
                        }
                        

                        {/* dossier toolbars */}
                        {this.titleRender(sectionTitle.dossierHome)}
                        <Layout className="homeScreenPreviewer-phone">
                            <Layout.Header>
                                {this.toolbarIconsRender(libraryHeaderIcons)}
                                <span className="icon-tb_undoarrow"/>
                            </Layout.Header>
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
                            <footer className="homeScreenPreviewer-phone-footer">
                                <span/>
                                {this.toolbarIconsRender(libraryFooterIcons)}
                                <span/>
                            </footer>
                        </Layout>
                        {/* notification panel */}
                        {this.titleRender(sectionTitle.notificationPanel)}
                    </div>
                )
            default:
                break
        }
    }
}