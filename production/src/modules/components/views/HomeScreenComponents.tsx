import { Checkbox, Switch, Table, Layout, Icon } from 'antd'
import * as React from 'react'
import '../../../../src/assets/fonts/webfonts/css/dossier.css'
import '../scss/HomeScreenComponents.scss'
import { default as VC, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import { HomeScreenPreviewer } from './HomeScreenPreviewer'

// constatns 
const localizedString = {
    ENABLE_FEATURE_TITLE: 'Enable Feature',
    ENABLE_FEATURE_DESC: 'Set toolbar behaviors and enable or disable the functions below',
    COLLAPSE_TOOLBAR: 'Collapse toolbar by default',
    LIBRARY_WINDOW: 'LIBRARY WINDOW (HOME)',
    DOSSIER_WINDOW: 'DOSSIER WINDOW',
    DOSSIER_WINDOW_HOME: 'DOSSIER WINDOW (HOME)',
    PLATFORM_SPECIFIC: 'PLATFORM SPECIFIC',
}

const childrenKeyOffset = 1000

// helper
function iconExpandable(iconText: string) {
    return iconText === iconTypes.sidebar.displayText
}

function iconUpdateBothSide(iconKey: string) {
    // for icons appear in library and dossier mode, update their value in both modes
    const dossierModeIcons = _.concat(dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons)
    const libraryModeIcons = _.concat(dossierIcons, libraryIcons, extraDesktopIcons, extraMobileIcons)
    const updateBothSideIcons = _.intersection(dossierModeIcons, libraryModeIcons)
    let updateBothSide = false
    updateBothSideIcons.forEach(element => {
        if(element.key === iconKey) {
            updateBothSide = true
        }
    }); 
    return updateBothSide
}

interface RowData {
    key: number;
    icon: string;
    text: string;
    selected: [boolean, string];
}

interface HomeScreenComponentsState {
    isDossierHome: boolean,
    toolbarHidden: boolean,
    selectedSidebarIcons: [string],
    selectedToolbarIcons: [string],
    selectedOtherModeToolbarIcons: [string],
    extraIcons: iconDetail[],
}

export default class HomeScreenComponents extends React.Component<any, HomeScreenComponentsState> {
    columns = [
        {
            title: "",
            key: "displayText",
            dataIndex: "displayText",
            align: "left",
            render: (icon: [string, string]) => {
                return (
                    !iconExpandable(icon[1]) &&
                    <span>
                        <span className={icon[0]}/>
                        <span>  {icon[1]}  </span> 
                    </span>
                )
            }
        },
        {
            title: "",
            key: "selected",
            dataIndex: "selected",
            align: "right",
            render: (selectedInfo: [boolean, string]) => {
                const disabled = childrenIcons.map((element) => element.key).includes(selectedInfo[1]) && 
                    !this.state.selectedToolbarIcons.includes(iconTypes.sidebar.key)
                return (
                    < Switch checked={selectedInfo[0]} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo[1])} disabled={disabled} />
                )
            }
        }
    ];

    getNewState = () => {
        let state = {...this.state}
        const { homeScreen, platform } = this.props
        const { mode, homeLibrary, homeDocument } = homeScreen
        const isDossierHome = mode === VC.MODE_USE_DOSSIER_AS_HOME_SCREEN
        let selectedSideBarIcons = []
        let selectedLibraryIcons = []
        let selectedDocumentIcons = []
        
        {
            const { icons, toolbarMode } = homeDocument
            selectedDocumentIcons = icons
            if (isDossierHome) {
                state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
            }
        }
        
        {
            const { icons, sidebars, toolbarMode } = homeLibrary
            selectedSideBarIcons = sidebars
            selectedLibraryIcons = icons
            if (!isDossierHome) {
                state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
            }
        }
   
        state.isDossierHome = isDossierHome
        state.selectedSidebarIcons = isDossierHome ? [] : selectedSideBarIcons
        state.selectedToolbarIcons = isDossierHome ? selectedDocumentIcons : selectedLibraryIcons
        state.selectedOtherModeToolbarIcons = isDossierHome ? selectedLibraryIcons : selectedDocumentIcons

        const extraIcons = _.concat(platform.includes(platformType.desktop) ? extraDesktopIcons : [], platform.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    iconSelectedInfo = (iconKey: string) => {
        const selected = this.state.selectedSidebarIcons.includes(iconKey) || this.state.selectedToolbarIcons.includes(iconKey)
        return [selected, iconKey]
    }

    // components
    renderTableExpander = (icon: [string, string], expanded: boolean) => {
        return (
            iconExpandable(icon[1]) &&
            <span>
                <span className={icon[0]}/>
                <span>  {icon[1]}  </span> 
                {expanded && <Icon type="down" />}
                {!expanded && <Icon type="right" />}
            </span>
        )
    }

    customExpandIcon = (props: any) => {
        const marginLeft = props.record.key >= childrenKeyOffset ? '20px' : '0px'
        if (props.expandable || props.record.expandable) {
            return <span style={{marginLeft: marginLeft}} onClick={e => {
                props.onExpand(props.record, e);
            }}>{this.renderTableExpander(props.record.displayText, props.expanded)}</span>
        } else {
            return <a style={{marginLeft: marginLeft} }/>
        }
    }

    renderTableTitle = (title: string) => {
        return <div className="home-screen-components-icons-title">{title}</div> 
    }

    renderTable = (icons: Array<iconDetail>) => {
        const expandChildren = childrenIcons.map( (icon, index) =>     
            ({key: childrenKeyOffset+index, displayText: [icon.iconName, icon.displayText], selected: this.iconSelectedInfo(icon.key)})
        )

        const data = icons.map( (icon, index) => 
            {
                const hasChildren = iconExpandable(icon.displayText)
                const selectedInfo = this.iconSelectedInfo(icon.key)
                return (
                    hasChildren ? {key: index, displayText: [icon.iconName, icon.displayText], selected: selectedInfo, children: expandChildren, expandable: true} : {key: index, displayText: [icon.iconName, icon.displayText], selected: selectedInfo, expandable: false}
                )
            }
        )
        
        return <Table className="home-screen-components-table" dataSource={data} columns={this.columns} pagination={false} showHeader={false} expandIcon={(props) => this.customExpandIcon(props)} />
    }

    // call backs
    onToolbarStateChange = (value: boolean) => {
        let update = {}
        update = {[VC.TOOLBAR_MODE]: value ? VC.COLLAPSE_TOOLBAR : VC.SHOW_TOOLBAR}
        update = this.state.isDossierHome ? {[VC.HOME_DOCUMENT]: update} : {[VC.HOME_LIBRARY]: update}
        update = {[VC.HOME_SCREEN]: update}
        this.props.handleChange(update)
    }

    onIconStateChange = (value: boolean, iconKey: string) => {
        let update = {}
        // check side bar icons
        const allSideIconsKey = childrenIcons.map( (icon) => icon.key )
        if (allSideIconsKey.includes(iconKey)) {
            const icons = value ? _.concat(this.state.selectedSidebarIcons, iconKey) : _.pull(this.state.selectedSidebarIcons, iconKey)
            update = {[VC.ICON_SIDEBAR]: icons}
        } else {
            const icons = value ? _.concat(this.state.selectedToolbarIcons, iconKey) : _.pull(this.state.selectedToolbarIcons, iconKey)
            update = {[VC.ICONS] : icons}
        }

        // put options and notification back in both library and dossier home
        if (iconUpdateBothSide(iconKey)) {
            const otherModeIcons = value ? _.concat(this.state.selectedOtherModeToolbarIcons, iconKey) : _.pull(this.state.selectedOtherModeToolbarIcons, iconKey)
            const otherUpdate = {[VC.ICONS] : otherModeIcons}
            const updateDocument = this.state.isDossierHome ? {[VC.HOME_DOCUMENT]: update} : {[VC.HOME_DOCUMENT]: otherUpdate}
            const updateLibrary = !this.state.isDossierHome ? {[VC.HOME_LIBRARY]: update} : {[VC.HOME_LIBRARY]: otherUpdate}
            update = {[VC.HOME_SCREEN]: _.merge(updateDocument, updateLibrary)}
        } else {
            update = this.state.isDossierHome ? {[VC.HOME_DOCUMENT] : update} : {[VC.HOME_LIBRARY] : update}
            update = {[VC.HOME_SCREEN]: update}
        }
        
        this.props.handleChange(update) 
    }

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = this.getNewState()
    }

    componentDidUpdate() {
        const newState = this.getNewState()
        if (newState.isDossierHome !== this.state.isDossierHome || newState.toolbarHidden !== this.state.toolbarHidden ||
            !_.isEqual(newState.extraIcons, this.state.extraIcons) || newState.selectedSidebarIcons.length !== this.state.selectedSidebarIcons.length || 
            newState.selectedToolbarIcons.length !== this.state.selectedToolbarIcons.length) {
            this.setState(newState)
        }
    }

    render() {
        const allSelectedIcons = _.concat(this.state.selectedToolbarIcons, this.state.selectedSidebarIcons)
        return (
            <Layout className="home-screen-components">
                <Layout.Content className="home-screen-components-left"> 
                    <div className = "home-screen-components-enable-feature">
                        {localizedString.ENABLE_FEATURE_TITLE}
                        <div className="home-screen-components-enable-feature-description">
                            {localizedString.ENABLE_FEATURE_DESC}
                        </div>
                    </div>

                    <div className = "home-screen-components-toolbar">
                        <Checkbox 
                            checked={this.state.toolbarHidden}
                            onChange = {(e) => this.onToolbarStateChange(e.target.checked)}>
                            {localizedString.COLLAPSE_TOOLBAR}
                        </Checkbox>
                    </div>

                    <div className="home-screen-components-scrollcontainer">
                    {
                        // dossier as home group
                        this.state.isDossierHome && <div className="home-screen-components-icons">
                            { this.renderTableTitle(localizedString.DOSSIER_WINDOW_HOME) }
                            { this.renderTable(dossierIconsDossierHome) }
                        </div>
                    }

                    {
                        // library as home group
                        !this.state.isDossierHome && <div className="home-screen-components-icons">
                            { this.renderTableTitle(localizedString.LIBRARY_WINDOW) }
                            { this.renderTable(libraryIcons) }
                            { this.renderTableTitle(localizedString.DOSSIER_WINDOW) }
                            { this.renderTable(dossierIcons) }
                        </div>
                    }
                    
                    {/* {
                        // conditional render platform specified icons
                        this.state.extraIcons.length > 0 && <div className="home-screen-components-icons">
                            {localizedString.PLATFORM_SPECIFIC}
                            {
                                this.renderTable(this.state.extraIcons)
                            }
                        </div>
                    } */}
                    </div>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className="home-screen-components-right" width='307px'>
                    <HomeScreenPreviewer deviceType={this.props.deviceType} toolbarHidden={this.state.toolbarHidden} icons={allSelectedIcons} isDossierHome={this.state.isDossierHome} handleDeviceTypeChange={this.props.handleDeviceTypeChange}/>
                </Layout.Sider>
            </Layout>
        )
    }
}
