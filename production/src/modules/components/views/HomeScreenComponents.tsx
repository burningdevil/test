import { Checkbox, Switch, Table, Layout } from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import '../../../../src/assets/fonts/webfonts/css/dossier.css'
import '../scss/HomeScreenComponents.scss'
import { default as VC, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons, iconValidKey, dossierIconKeys, libraryIconKeys, sidebarIconKeys, mobileOnlyIconKeys, webDesktopOnlyIconKeys } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import HomeScreenPreviewer from './HomeScreenPreviewer'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectIsDossierAsHome, selectIsToolbarHidden, selectIsToolbarCollapsed, selectSelectedSideBarIcons, selectSelectedLibraryIcons, selectSelectedDocumentIcons, selectCurrentConfigContentBundleIds, selectDefaultGroupsName } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { t } from '../../../i18n/i18next'

// constatns 
const localizedString = {
    ENABLE_FEATURE_TITLE: t('enableFeatureTitle'),
    ENABLE_FEATURE_DESC: t('enableFeatureDesc'),
    DISABLE_TOOLBAR: t('disableToolbar'),
    COLLAPSE_TOOLBAR: t('collapseToolbar'),

    LIBRARY_WINDOW: t('libraryWindow'),
    DOSSIER_WINDOW: t('dossierWindow'),
    DOSSIER_WINDOW_HOME: t('dossierWindowHome'),
    // PLATFORM_SPECIFIC: 'PLATFORM SPECIFIC',
}
const childrenKeyOffset = 1000

// helper
function iconExpandable(iconText: string) {
    return iconText === iconTypes.sidebar.displayText
}

interface HomeScreenComponentsState {
    extraIcons: iconDetail[],
    defaultGroupEnable: boolean,
    mobileOptionsVisible: boolean,
    webOptionsVisible: boolean,
}

class HomeScreenComponents extends React.Component<any, HomeScreenComponentsState> {
    isIconDisabled = (iconKey: string) => {
        // toolbar hidden
        const {toolbarHidden} = this.props
        // side bar hidden
        const sidebarDisabled = sidebarIconKeys.includes(iconKey) && !(this.iconSelectedInfo(iconTypes.sidebar.key)[0])

        let disabled = false
        if (mobileOnlyIconKeys.includes(iconKey) && !this.state.mobileOptionsVisible) {
            disabled = true
        } else if (webDesktopOnlyIconKeys.includes(iconKey) && !this.state.webOptionsVisible && !this.props.isDossierHome) {
            disabled = true
        } else if (iconKey === iconTypes.defaultGroup.key && !this.state.defaultGroupEnable) {
            disabled = true
        }
        return disabled || toolbarHidden || sidebarDisabled
    }

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
                return (
                    < Switch checked={selectedInfo[0]} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo[1])} disabled={this.isIconDisabled(selectedInfo[1])} size={'small'} />
                )
            }
        }
    ];

    getNewState = () => {
        let state = {...this.state}
        
        const {contentBundleIds, config, isDossierHome} = this.props
        const {platform} = config
        if (!isDossierHome) {
            state.defaultGroupEnable = !_.isEmpty(contentBundleIds) && contentBundleIds.length > 0
            state.mobileOptionsVisible = _.includes(platform, platformType.mobile)
            state.webOptionsVisible = _.includes(platform, platformType.web) || _.includes(platform, platformType.desktop)
        }
   
        const extraIcons = _.concat(platform.includes(platformType.desktop) ? extraDesktopIcons : [], platform.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    iconSelectedInfo = (iconKey: string) => {
        const validKey = iconValidKey(iconKey) // trasnfrom 'account_web', 'account_mobile', to 'account'
        let selected = false
        if (sidebarIconKeys.includes(iconKey)) {
            selected = this.props.selectedSidebarIcons.includes(validKey)
        } else {
            if (libraryIconKeys.includes(iconKey)) {
                selected = this.props.selectedLibraryIcons.includes(validKey)
            }
            if (dossierIconKeys.includes(iconKey)) {
                selected = this.props.selectedDocumentIcons.includes(validKey) 
            }
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
        const marginLeft = props.record.key >= childrenKeyOffset ? '10px' : '0px'
        if (props.expandable || props.record.expandable) {
            return <span style={{marginLeft: marginLeft, cursor: 'pointer'}} onClick={e => {
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
        const expandChildren = childrenIcons
            .map( (icon, index) =>  {
                let displayText = icon.displayText
                if(icon.key === iconTypes.defaultGroup.key) {
                    displayText = _.isEmpty(this.props.defaultGroupsName) ? t('defaultGroups') : this.props.defaultGroupsName
                }
                return (
                    {key: childrenKeyOffset+index, displayText: [icon.iconName, displayText], selected: this.iconSelectedInfo(icon.key)}
                )
            }
        )

        const data = icons
            .map( (icon, index) => {
                const hasChildren = iconExpandable(icon.displayText)
                const selectedInfo = this.iconSelectedInfo(icon.key)
                return (
                    hasChildren ? {key: index, displayText: [icon.iconName, icon.displayText], selected: selectedInfo, children: expandChildren, expandable: true} : {key: index, displayText: [icon.iconName, icon.displayText], selected: selectedInfo, expandable: false}
                )
            }
        )
        
        return <Table className="home-screen-components-table" dataSource={data} columns={this.columns} pagination={false} showHeader={false} expandIcon={(props) => this.customExpandIcon(props)} />
    }

    renderOptions = (checked: boolean, value: number, text: string) => {
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
    onToolbarStateChange = (value: number, checked: boolean) => {
        let update = {}
        
        switch (value) { 
            case VC.HIDE_TOOLBAR:
                update = {[VC.TOOLBAR_MODE]: (checked ? value : 0) | (this.props.toolbarCollapsed ? VC.COLLAPSE_TOOLBAR : 0)}
                break;
            case VC.COLLAPSE_TOOLBAR:
                update = {[VC.TOOLBAR_MODE]: (checked ? value : 0) | (this.props.toolbarHidden ? VC.HIDE_TOOLBAR : 0)}
                break;
            default:
                break;
        }
        // update on both library and dossier
        update = {[VC.HOME_DOCUMENT]: update, [VC.HOME_LIBRARY]: update}
        update = {[VC.HOME_SCREEN]: update}
        this.props.updateCurrentConfig(update)
    }

    onIconStateChange = (value: boolean, iconKey: string) => {
        let update = {}
        // check side bar icons
        const validKey = iconValidKey(iconKey) 
        if (sidebarIconKeys.includes(iconKey)) {
            const icons = value ? _.concat(this.props.selectedSidebarIcons, validKey) : _.pull(this.props.selectedSidebarIcons, validKey)
            update = {[VC.ICON_SIDEBAR]: icons}
            update = {[VC.HOME_LIBRARY]: update}
        } else {
            let updateDocument = {}
            let updateLibrary = {}
            if (dossierIconKeys.includes(iconKey)) {
                const icons = value ? _.concat(this.props.selectedDocumentIcons, validKey) : _.pull(this.props.selectedDocumentIcons, validKey)
                update = {[VC.ICONS]: icons}
                updateDocument = {[VC.HOME_DOCUMENT]: update} 
            }
            if (libraryIconKeys.includes(iconKey)) {
                const icons = value ? _.concat(this.props.selectedLibraryIcons, validKey) : _.pull(this.props.selectedLibraryIcons, validKey)
                update = {[VC.ICONS] : icons}
                updateLibrary = {[VC.HOME_LIBRARY]: update}
            }
            update = _.merge(updateDocument, updateLibrary)
        }
        update = {[VC.HOME_SCREEN]: update}
        this.props.updateCurrentConfig(update) 
    }

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = this.getNewState()
    }

    componentDidUpdate() {
        const newState = this.getNewState()
        if (!_.isEqual(newState.extraIcons, this.state.extraIcons) || newState.defaultGroupEnable !== this.state.defaultGroupEnable || newState.mobileOptionsVisible !== this.state.mobileOptionsVisible || newState.webOptionsVisible !== this.state.webOptionsVisible) {
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

                    {this.renderOptions(this.props.toolbarHidden, VC.HIDE_TOOLBAR, localizedString.DISABLE_TOOLBAR)}
                    {this.renderOptions(this.props.toolbarCollapsed, VC.COLLAPSE_TOOLBAR, localizedString.COLLAPSE_TOOLBAR)}

                    <div className="home-screen-components-scrollcontainer">
                    {
                        // dossier as home group
                        this.props.isDossierHome && <div className="home-screen-components-icons">
                            { this.renderTableTitle(localizedString.DOSSIER_WINDOW_HOME) }
                            { this.renderTable(dossierIconsDossierHome) }
                        </div>
                    }

                    {
                        // library as home group
                        !this.props.isDossierHome && <div className="home-screen-components-icons">
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
                    <HomeScreenPreviewer />
                </Layout.Sider>
            </Layout>
        )
    }
}

const mapState = (state: RootState) => ({
    config: selectCurrentConfig(state),
    isDossierHome: selectIsDossierAsHome(state),
    toolbarHidden: selectIsToolbarHidden(state),
    toolbarCollapsed: selectIsToolbarCollapsed(state),
    selectedSidebarIcons: selectSelectedSideBarIcons(state),
    selectedLibraryIcons: selectSelectedLibraryIcons(state),
    selectedDocumentIcons: selectSelectedDocumentIcons(state), 
    contentBundleIds: selectCurrentConfigContentBundleIds(state),
    defaultGroupsName: selectDefaultGroupsName(state),
})
  
const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenComponents)
