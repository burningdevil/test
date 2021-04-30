import { Checkbox, Switch, Table, Layout } from 'antd'
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
    text: string,
    name: string,
    key: string,
}

const iconTypes = {
    sidebar: {text: 'Sidebar', name: 'icon-listview', key: VC.ICON_SIDEBAR},
    sortAndFilter: {text: 'Library Sort and Filter', name: 'icon-filter', key: VC.ICON_SORT_FILTER},
    multiSelect: {text: 'Multi-Select (Web and Desktop)', name: 'icon-tb_select_a', key: VC.ICON_MULTI_SELECT},
    search: {text: 'Search', name: 'icon-search', key: VC.ICON_SEARCH},
    notification: {text: 'Notification', name: 'icon-tb_notif_n', key: VC.ICON_NOTIFICATIONS},
    account: {text: 'Account', name: 'icon-account-resp', key: VC.ICON_OPTIONS},
    toc: {text: 'Table of Contents', name: 'icon-toc', key: VC.ICON_TOCS},
    bookmark: {text: 'Bookmark', name: 'icon-bookmark', key: VC.ICON_BOOKMARK},
    reset: {text: 'Reset Dossier', name: 'icon-resetfile', key: VC.ICON_RESET},
    filter: {text: 'Filter', name: 'icon-tb_filter_n', key: VC.ICON_FILTER},
    comment: {text: 'Comments', name: 'icon-lv_comments_i', key: VC.ICON_COMMENTS},
    share: {text: 'Share', name: 'icon-tb_share_n', key: VC.ICON_SHARE},
    // platform specified
    // TODOz: ?
    dataSearch: {text: 'Data Search (Desktop Only)', name: 'icon-searchfilter', key: VC.ICON_DATA_SEARCH},
    hyper: {text: 'Hyper Intelligence (Desktop Only)', name: 'icon-checkmark2', key: VC.ICON_HYPER},
    aaFont: {text: 'Font Size in Grid (Mobile Only)', name: 'icon-pnl_shared', key: VC.ICON_AA_FONT},
    // sidebar children
    all: {text: 'All', name: 'icon-group_all', key: VC.ICON_ALL},
    favorites: {text: 'Favorites', name: 'icon-home_favorite_i', key: VC.ICON_FAV},
    recents: {text: 'Recents', name: 'icon-group_recents', key: VC.ICON_RECENENT},
    defaultGroup: {text: 'Default Groups', name: 'icon-group_groups', key: VC.ICON_DEFAULT_GROUP},
    myGroup: {text: 'My Groups', name: 'icon-group_groups', key: VC.ICON_MY_GROUP}
}

// library icons when mode is Libary as home
const libraryIcons = [iconTypes.sidebar, iconTypes.sortAndFilter, iconTypes.multiSelect, 
    iconTypes.search, iconTypes.notification, iconTypes.account]

// dossier icons when mode is Library as home
const dossierIcons = [iconTypes.toc, iconTypes.bookmark, iconTypes.reset, 
    iconTypes.filter, iconTypes.comment, iconTypes.share]

// dossier icons when mode is dossier as home
const dossierIconsDossierHome = dossierIcons.concat([iconTypes.notification, iconTypes.account])

// extra icons for specified platforms
const extraDesktopIcons = [iconTypes.dataSearch, iconTypes.hyper]
const extraMobileIcons = [iconTypes.aaFont]

// children icons for sidebar
const childrenIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup, iconTypes.myGroup]
interface RowData {
    key: number;
    name: string;
    text: string;
    selected: [boolean, string];
}

export default class HomeScreenComponents extends React.Component<any, any> {
    columns = [
        {
            title: "",
            key: "name",
            dataIndex: "name",
            // size: "small",
            render: (iconName: string) => (<div className={iconName}/>)
        },
        {
            title: "",
            key: "text",
            dataIndex: "text"
        },
        {
            title: "",
            key: "selected",
            dataIndex: "selected",
            align: "right",
            render: (selected: [boolean, string]) => (< Switch  defaultChecked={selected[0]} onChange={
                (e) => this.onIconStateChange(e, selected[1])} />)
        }
    ];

    state = {
        isDossierHome: false,
        toolbarHidden: false,
        selectedSidebarIcons: [],
        selectedToolbarIcons: [],
        extraIcons: [],
    }

    iconSelectedInfo(iconKey: string) {
        return [this.state.selectedSidebarIcons.includes(iconKey) || this.state.selectedToolbarIcons.includes(iconKey), iconKey]
    }

    renderTable(icons: Array<iconDetail>) {
        const expandChildren = childrenIcons.map( (icon, index) =>     
            ({key: 100+index, name: icon.name, text: icon.text, selected: this.iconSelectedInfo(icon.key)})
        )

        const data = icons.map( (icon, index) => 
            {
                const hasChildren = icon === iconTypes.sidebar
                const selected = this.iconSelectedInfo(icon.key)
                return (  
                    hasChildren ? {key: index, name: icon.name, text: icon.text, selected: selected, children: expandChildren} : {key: index, name: icon.name, text: icon.text, selected: selected}
                )
            }
        )
        
        return <Table className="home-screen-components-table" dataSource={data} columns={this.columns} pagination={false} showHeader={false} />
    }

    getNewState() {
        let state = {...this.state}
        const { homeScreen, platform } = this.props
        const { mode, homeLibrary, homeDocument } = homeScreen
        const isDossierHome = mode === VC.MODE_USE_DOSSIER_AS_HOME_SCREEN
        let selectedSideBarIcons = []
        let selectedLibraryIcons = []
        let selectedDocumentIcons = []
        if (isDossierHome) {
            const { icons, toolbarMode } = homeLibrary
            selectedDocumentIcons = icons
            state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
        } else {
            const { icons, sidebars, toolbarMode } = homeDocument
            selectedSideBarIcons = sidebars
            selectedLibraryIcons = icons
            state.toolbarHidden = toolbarMode === VC.COLLAPSE_TOOLBAR
        }
        state.isDossierHome = isDossierHome
        state.selectedSidebarIcons = selectedSideBarIcons
        state.selectedToolbarIcons = _.concat(selectedLibraryIcons, selectedDocumentIcons)

        const extraIcons = _.concat(platform.includes(platformType.desktop) ? extraDesktopIcons : [], platform.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    constructor(props: any) {
        super(props)
        this.state = this.getNewState()
    }

    // call backs
    onToolbarStateChange = (value: boolean) => {
        const toolbarHidden = value ? VC.COLLAPSE_TOOLBAR : VC.SHOW_TOOLBAR
        const updateInteral = {[VC.TOOLBAR_MODE]: value ? VC.COLLAPSE_TOOLBAR : VC.SHOW_TOOLBAR}
        const update = this.state.isDossierHome ? {homeDocument: updateInteral} : {homeLibrary: updateInteral}
        this.props.handleChange({homeScreen: update})
        this.state.toolbarHidden = value
    }

    onIconStateChange = (value: boolean, iconKey: string) => {
        let update = {}
        // check side bar icons
        const allSideIconsKey = childrenIcons.map( (icon) => icon.key )
        if (allSideIconsKey.includes(iconKey)) {
            const icons = value ? _.concat(this.state.selectedSidebarIcons, iconKey) : _.pull(this.state.selectedSidebarIcons, iconKey)
            update = {[VC.ICON_SIDEBAR]: icons}
            this.state.selectedSidebarIcons = icons
        } else {
            const icons = value ? _.concat(this.state.selectedToolbarIcons, iconKey) : _.pull(this.state.selectedToolbarIcons, iconKey)
            update = {[VC.ICONS] : icons}
            this.state.selectedToolbarIcons = icons       
        }
        update = this.state.isDossierHome ? {[VC.HOME_DOCUMENT]: update} : {[VC.HOME_LIBRARY]: update}
        update = {[VC.HOME_SCREEN]: update}

        this.props.handleChange(update) 
    }

    // Life cycle
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

                    <span className="home-screen-components-scrollcontainer">
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
                        <div className="home-screen-components-icons">
                            {localizedString.PLATFORM_SPECIFIC}
                            {
                                this.renderTable(this.state.extraIcons)
                            }
                        </div>
                    }
                    </span>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className="home-screen-components-right">
                </Layout.Sider>
            </Layout>
        )
    }
}
