import { Checkbox, Switch, Table, Layout } from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import * as React from 'react'
import '../../../../src/assets/fonts/webfonts/css/dossier.css'
import '../scss/HomeScreenComponents.scss'
import { default as VC, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import { HomeScreenPreviewer } from './HomeScreenPreviewer'

// constatns 
const localizedString = {
    ENABLE_FEATURE_TITLE: 'Enable Features',
    ENABLE_FEATURE_DESC: 'Set toolbar behaviors and enable or disable the functions below',
    DISABLE_TOOLBAR: 'Disable toolbar',
    COLLAPSE_TOOLBAR: 'Collapse toolbar by default',

    LIBRARY_WINDOW: 'LIBRARY WINDOW (HOME)',
    DOSSIER_WINDOW: 'DOSSIER WINDOW',
    DOSSIER_WINDOW_HOME: 'DOSSIER WINDOW (HOME)',
    PLATFORM_SPECIFIC: 'PLATFORM SPECIFIC',
}

const dossierIconKeys = dossierIconsDossierHome.map((element) => element.key)
const libraryIconKeys = libraryIcons.map((element) => element.key)
const sidebarIconKeys = childrenIcons.map((element) => element.key)
const childrenKeyOffset = 1000

// helper
function iconExpandable(iconText: string) {
    return iconText === iconTypes.sidebar.displayText
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
    toolbarDisabled: boolean,
    selectedSidebarIcons: [string],
    selectedLibraryIcons: [string],
    selectedDocumentIcons: [string],
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
                        <span className="table-text">  {icon[1]}  </span> 
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
                const disabled = sidebarIconKeys.includes(selectedInfo[1]) && !(this.iconSelectedInfo(iconTypes.sidebar.key)[0])
                return (
                    < Switch checked={selectedInfo[0]} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo[1])} disabled={disabled} size={'small'} />
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
            const { icons, toolbarMode, toolbarDisabled } = homeDocument
            selectedDocumentIcons = icons
            if (isDossierHome) {
                state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
                state.toolbarDisabled = toolbarDisabled === VC.COLLAPSE_TOOLBAR
            }
        }  
        {
            const { icons, sidebars, toolbarMode, toolbarDisabled } = homeLibrary
            if (!isDossierHome) {
                selectedSideBarIcons = sidebars
                selectedLibraryIcons = icons
                state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
                state.toolbarDisabled = toolbarDisabled === VC.COLLAPSE_TOOLBAR
            }
        }
   
        state.isDossierHome = isDossierHome
        state.selectedSidebarIcons = selectedSideBarIcons
        state.selectedDocumentIcons = selectedDocumentIcons
        state.selectedLibraryIcons = selectedLibraryIcons

        const extraIcons = _.concat(platform.includes(platformType.desktop) ? extraDesktopIcons : [], platform.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    iconSelectedInfo = (iconKey: string) => {
        let selected = this.state.selectedSidebarIcons.includes(iconKey) || this.state.selectedDocumentIcons.includes(iconKey)
        if (!this.state.isDossierHome) {
            selected = selected || this.state.selectedLibraryIcons.includes(iconKey)
        }
        return [selected, iconKey]
    }

    // components
    renderTableExpander = (icon: [string, string], expanded: boolean) => {
        return (
            iconExpandable(icon[1]) &&
            <span>
                <span className={icon[0]}/>
                <span className="table-text">  {icon[1]}  </span> 
                {expanded && <DownOutlined />}
                {!expanded && <RightOutlined />}
            </span>
        )
    }

    customExpandIcon = (props: any) => {
        const marginLeft = props.record.key >= childrenKeyOffset ? '27px' : '0px'
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

    renderOptions = (checked: boolean, value: string, text: string) => {
        return <div className = "home-screen-components-toolbar">
            <Checkbox 
                checked={checked}
                value={value}
                onChange = {(e) => this.onToolbarStateChange(e.target.value, e.target.checked)}>
                {text}
            </Checkbox>
        </div>
    }

    // call backs
    onToolbarStateChange = (type: string, value: boolean) => {
        let update = {}
        switch (type) { 
            case VC.TOOLBAR_MODE:
            case VC.TOOLBAR_DISABLED:
                update = {[type]: value ? VC.COLLAPSE_TOOLBAR : VC.SHOW_TOOLBAR}
                // update on both library and dossier
                update = {[VC.HOME_DOCUMENT]: update, [VC.HOME_LIBRARY]: update}
                update = {[VC.HOME_SCREEN]: update}
                break;
            default:
                break;
        }
        this.props.handleChange(update)
    }

    onIconStateChange = (value: boolean, iconKey: string) => {
        let update = {}
        // check side bar icons
        const allSideIconsKey = childrenIcons.map( (icon) => icon.key )
        if (allSideIconsKey.includes(iconKey)) {
            const icons = value ? _.concat(this.state.selectedSidebarIcons, iconKey) : _.pull(this.state.selectedSidebarIcons, iconKey)
            update = {[VC.ICON_SIDEBAR]: icons}
            update = {[VC.HOME_LIBRARY]: update}
        } else {
            let updateDocument = {}
            let updateLibrary = {}
            if (dossierIconKeys.includes(iconKey)) {
                const icons = value ? _.concat(this.state.selectedDocumentIcons, iconKey) : _.pull(this.state.selectedDocumentIcons, iconKey)
                update = {[VC.ICONS]: icons}
                updateDocument = {[VC.HOME_DOCUMENT]: update} 
            }
            if (libraryIconKeys.includes(iconKey)) {
                const icons = value ? _.concat(this.state.selectedLibraryIcons, iconKey) : _.pull(this.state.selectedLibraryIcons, iconKey)
                update = {[VC.ICONS] : icons}
                updateLibrary = {[VC.HOME_LIBRARY]: update}
            }
            update = _.merge(updateDocument, updateLibrary)
        }
        update = {[VC.HOME_SCREEN]: update}
        this.props.handleChange(update) 
    }

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = this.getNewState()
    }

    componentDidUpdate() {
        const newState = this.getNewState()
        if (newState.isDossierHome !== this.state.isDossierHome || newState.toolbarHidden !== this.state.toolbarHidden || newState.toolbarDisabled !== this.state.toolbarDisabled ||
            !_.isEqual(newState.extraIcons, this.state.extraIcons) || newState.selectedSidebarIcons.length !== this.state.selectedSidebarIcons.length || 
            newState.selectedDocumentIcons.length !== this.state.selectedDocumentIcons.length || newState.selectedLibraryIcons.length != this.state.selectedLibraryIcons.length) {
            this.setState(newState)
        }
    }

    render() {
        const allSelectedIcons = _.concat(this.state.selectedDocumentIcons, this.state.selectedLibraryIcons, this.state.selectedSidebarIcons)
        return (
            <Layout className="home-screen-components">
                <Layout.Content className="home-screen-components-left"> 
                    <div className = "home-screen-components-enable-feature">
                        {localizedString.ENABLE_FEATURE_TITLE}
                        <div className="home-screen-components-enable-feature-description">
                            {localizedString.ENABLE_FEATURE_DESC}
                        </div>
                    </div>

                    {this.renderOptions(this.state.toolbarDisabled, VC.TOOLBAR_DISABLED, localizedString.DISABLE_TOOLBAR)}
                    {this.renderOptions(this.state.toolbarHidden, VC.TOOLBAR_MODE, localizedString.COLLAPSE_TOOLBAR)}

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
                <Layout.Sider className="home-screen-components-right" width='274px'>
                    <HomeScreenPreviewer deviceType={this.props.deviceType} toolbarDisabled={this.state.toolbarDisabled} toolbarHidden={this.state.toolbarHidden} icons={allSelectedIcons} isDossierHome={this.state.isDossierHome} handleDeviceTypeChange={this.props.handleDeviceTypeChange}/>
                </Layout.Sider>
            </Layout>
        )
    }
}
