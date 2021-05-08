import { Checkbox, Switch, Table, Layout, Icon } from 'antd'
import * as React from 'react'
import '../../../../src/assets/fonts/webfonts/css/dossier.css'
import '../scss/HomeScreenComponents.scss'
import { platformType } from './HomeScreenGeneral'
import { default as VC } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'

// constatns 
const localizedString = {
    ENABLE_FEATURE_TITLE: 'Enable Feature',
    ENABLE_FEATURE_DESC: 'Set toolbar behaviors and enable or disable the functions below',
    COLLAPSE_TOOLBAR: 'Collapse toolbar by default',
    LIBRARY_WINDOW: 'Library Window (HOME)',
    DOSSIER_WINDOW: 'DOSSIER WINDOW',
    PLATFORM_SPECIFIC: 'PLATFORM SPECIFIC',
}

// toolbar icon [display text, icon-name, key]
interface iconDetail{
    displayText: string,
    iconName: string,
    key: string,
}

const iconTypes = {
    sidebar: {displayText: 'Sidebar', iconName: 'icon-listview', key: VC.ICON_SIDEBAR},
    sortAndFilter: {displayText: 'Library Sort and Filter', iconName: 'icon-filter', key: VC.ICON_SORT_FILTER},
    multiSelect: {displayText: 'Multi-Select (Web and Desktop)', iconName: 'icon-tb_select_a', key: VC.ICON_MULTI_SELECT},
    search: {displayText: 'Search', iconName: 'icon-search', key: VC.ICON_SEARCH},
    notification: {displayText: 'Notification', iconName: 'icon-tb_notif_n', key: VC.ICON_NOTIFICATIONS},
    account: {displayText: 'Account', iconName: 'icon-account-resp', key: VC.ICON_OPTIONS},
    toc: {displayText: 'Table of Contents', iconName: 'icon-toc', key: VC.ICON_TOCS},
    bookmark: {displayText: 'Bookmark', iconName: 'icon-bookmark', key: VC.ICON_BOOKMARK},
    reset: {displayText: 'Reset Dossier', iconName: 'icon-resetfile', key: VC.ICON_RESET},
    filter: {displayText: 'Filter', iconName: 'icon-tb_filter_n', key: VC.ICON_FILTER},
    comment: {displayText: 'Comments', iconName: 'icon-lv_comments_i', key: VC.ICON_COMMENTS},
    share: {displayText: 'Share', iconName: 'icon-tb_share_n', key: VC.ICON_SHARE},
    // platform specified
    // TODOz: ?
    dataSearch: {displayText: 'Data Search (Desktop Only)', iconName: 'icon-searchfilter', key: VC.ICON_DATA_SEARCH},
    hyper: {displayText: 'Hyper Intelligence (Desktop Only)', iconName: 'icon-checkmark2', key: VC.ICON_HYPER},
    aaFont: {displayText: 'Font Size in Grid (Mobile Only)', iconName: 'icon-pnl_shared', key: VC.ICON_AA_FONT},
    // sidebar children
    all: {displayText: 'All', iconName: 'icon-group_all', key: VC.ICON_ALL},
    favorites: {displayText: 'Favorites', iconName: 'icon-home_favorite_i', key: VC.ICON_FAV},
    recents: {displayText: 'Recents', iconName: 'icon-group_recents', key: VC.ICON_RECENENT},
    defaultGroup: {displayText: 'Default Groups', iconName: 'icon-group_groups', key: VC.ICON_DEFAULT_GROUP},
    myGroup: {displayText: 'My Groups', iconName: 'icon-group_groups', key: VC.ICON_MY_GROUP}
}

// icons may appear in both library and dossier
const bothSideIcons = [iconTypes.notification, iconTypes.account]

// library icons when mode is Libary as home
const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.account]

// dossier icons when mode is Library as home
const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home, should append 
const dossierIconsDossierHome = dossierIcons.concat(bothSideIcons)

// extra icons for specified platforms
const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup]
const childrenKeyOffset = 1000

// helper
function iconExpandable(iconText: string) {
    return iconText === iconTypes.sidebar.displayText
}

function iconUpdateBothSide(iconKey: string) {
    let updateBothSide = false
    bothSideIcons.forEach(element => {
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

export default class HomeScreenComponents extends React.Component<any, any> {
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
                return (
                    < Switch  checked={selectedInfo[0]} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo[1])} />
                )
            }
        }
    ];

    state = {
        isDossierHome: false,
        toolbarHidden: false,
        selectedSidebarIcons: [],
        selectedToolbarIcons: [],
        selectedOtherModeToolbarIcons: [],
        extraIcons: [],
    }

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
                {expanded && <Icon type="minus"/>}
                {!expanded && <Icon type="plus"/>}
            </span>
        )
    }

    customExpandIcon = (props: any) => {
        const marginLeft = props.record.key >= childrenKeyOffset ? '20px' : '0px'
        if (props.expandable || props.record.expandable) {
            return <a style={{ color: 'black', marginLeft: marginLeft}} onClick={e => {
                props.onExpand(props.record, e);
            }}>{this.renderTableExpander(props.record.displayText, props.expanded)}</a>
        } else {
            return <a style={{marginLeft: marginLeft} }/>
        }
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
        
        return <Table className="home-screen-components-table" dataSource={data} columns={this.columns} pagination={false} showHeader={false} expandIcon={(props) => this.customExpandIcon(props)}/>
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
                            {localizedString.DOSSIER_WINDOW}
                            {
                                this.renderTable(dossierIconsDossierHome)
                            }
                        </div>
                    }

                    {
                        // library as home group
                        !this.state.isDossierHome && <div className="home-screen-components-icons">
                            {localizedString.LIBRARY_WINDOW}
                            {
                                this.renderTable(libraryIcons)
                            }
                            {localizedString.DOSSIER_WINDOW}
                            {
                                this.renderTable(dossierIcons)
                            }
                        </div>
                    }
                    
                    {
                        // conditional render platform specified icons
                        this.state.extraIcons.length > 0 && <div className="home-screen-components-icons">
                            {localizedString.PLATFORM_SPECIFIC}
                            {
                                this.renderTable(this.state.extraIcons)
                            }
                        </div>
                    }
                    </div>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className="home-screen-components-right">
                </Layout.Sider>
            </Layout>
        )
    }
}
