import { Checkbox, Switch, Table, Layout } from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenComponents.scss'
import { default as VC, localizedStrings, previewerWidth, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons, iconValidKey, libraryIconKeys, sidebarIconKeys, LibraryCustomizedIconKeys, mobileOnlyIconKeys, webDesktopOnlyIconKeys } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import HomeScreenPreviewer from './HomeScreenPreviewer'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectIsDossierAsHome, selectIsToolbarHidden, selectIsToolbarCollapsed, selectSelectedSideBarIcons, selectSelectedLibraryCustomizedItems, selectSelectedLibraryIcons, selectSelectedDocumentIcons, selectCurrentConfigContentBundleIds, selectDefaultGroupsName } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'

const childrenKeyOffset = 1000;
/* ClassName */
const classNamePrefix = 'home-screen-components';
const columnDisplayText = 'displayText';
const columnSelected = 'selected';

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
        } else if (iconKey === iconTypes.all.key) { // disable all switch button by default.
            disabled = true
        }
        return disabled || toolbarHidden || sidebarDisabled
    }

    columns = [
        {
            title: '',
            key: columnDisplayText,
            dataIndex: columnDisplayText,
            align: 'left' as const,
            render: (icon: [string, string]) => {
                return (
                    !iconExpandable(icon[1]) &&
                    <span>
                        <span className={icon[0]}/>
                        <span className={`${classNamePrefix}-table-text`}>  {icon[1]}  </span> 
                    </span>
                )
            }
        },
        {
            title: '',
            key: columnSelected,
            dataIndex: columnSelected,
            align: 'right' as const,
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
        const {platforms} = config
        if (!isDossierHome) {
            state.defaultGroupEnable = !_.isEmpty(contentBundleIds) && contentBundleIds.length > 0
            state.mobileOptionsVisible = _.includes(platforms, platformType.mobile)
            state.webOptionsVisible = _.includes(platforms, platformType.web) || _.includes(platforms, platformType.desktop)
        }
   
        const extraIcons = _.concat(platforms.includes(platformType.desktop) ? extraDesktopIcons : [], platforms.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    iconSelectedInfo = (iconKey: string) => {
        const validKey = iconValidKey(iconKey) // trasnfrom 'account_web', 'account_mobile', to 'account'
        let selected = false
        if (sidebarIconKeys.includes(iconKey)) {
            selected = this.props.selectedSidebarIcons.includes(validKey)
            if (LibraryCustomizedIconKeys.includes(iconKey)) {
                selected = _.get(this.props.selectedLibraryCustomizedItems, iconKey, true);
            }
        } else {
            if (this.props.isDossierHome) {
                const dossierToolbarIcons = dossierIconsDossierHome.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    selected = this.props.selectedDocumentIcons.includes(validKey) 
                }
            } else {
                // Library Icon
                if (libraryIconKeys.includes(iconKey)) {
                    selected = this.props.selectedLibraryIcons.includes(validKey)
                }
                // Dossier Icon
                const dossierToolbarIcons = dossierIcons.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    selected = this.props.selectedDocumentIcons.includes(validKey) 
                }
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
                <span className={`${classNamePrefix}-table-text`}>  {icon[1]}  </span> 
                {expanded && <DownOutlined />}
                {!expanded && <RightOutlined />}
            </span>
        )
    }

    customExpandIcon = (props: any) => {
        const marginLeft = props.record.key >= childrenKeyOffset ? '10px' : '0px'
        if (props.expandable || props.record.expandable) {
            return <span style={{marginLeft: marginLeft, cursor: VC.POINTER}} onClick={e => {
                props.onExpand(props.record, e);
            }}>{this.renderTableExpander(props.record.displayText, props.expanded)}</span>
        } else {
            return <a style={{marginLeft: marginLeft} }/>
        }
    }

    renderTableTitle = (title: string) => {
        return <div className={`${classNamePrefix}-icons-title`}>{title}</div> 
    }

    renderTable = (icons: Array<iconDetail>) => {
        const expandChildren = childrenIcons
            .map( (icon, index) =>  {
                let displayText = icon.displayText
                if(icon.key === iconTypes.defaultGroup.key) {
                    displayText = _.isEmpty(this.props.defaultGroupsName) ? localizedStrings.DEFAULT_GROUPS : this.props.defaultGroupsName
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
        
        return <Table className={`${classNamePrefix}-table`} style={this.props.toolbarHidden ? {opacity: 0.5} : {opacity : 1.0}} dataSource={data} columns={this.columns} pagination={false} showHeader={false} expandIcon={(props) => this.customExpandIcon(props)} />
    }

    renderOptions = (checked: boolean, value: string, text: string) => {
        return <div className = {`${classNamePrefix}-toolbar`}>
            <Checkbox 
                checked={checked}
                value={value}
                disabled={value === VC.TOOLBAR_MODE ? this.props.toolbarHidden : false}
                onChange = {(e) => this.onToolbarStateChange(e.target.value, e.target.checked)}>
                {text}
            </Checkbox>
        </div>
    }

    // call backs
    onToolbarStateChange = (type: string, checked: boolean) => {
        let update = {}
        
        switch (type) { 
            case VC.TOOLBAR_MODE:
                update = {[VC.TOOLBAR_MODE]: checked ? VC.COLLAPSE_TOOLBAR : VC.SHOW_TOOLBAR}
                break;
            case VC.TOOLBAR_ENABLED:
                update = {[VC.TOOLBAR_ENABLED]: !checked}
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
        const { isDossierHome } = this.props
        let update = {}
        // check side bar icons
        const validKey = iconValidKey(iconKey) 
        if (sidebarIconKeys.includes(iconKey)) {
            const icons = value ? _.concat([], this.props.selectedSidebarIcons, validKey) : _.pull(_.concat([], this.props.selectedSidebarIcons), validKey)
            update = {[VC.ICON_SIDEBAR]: icons}
            if (LibraryCustomizedIconKeys.includes(iconKey)) {
                const customizedItems = _.assign({}, this.props.selectedLibraryCustomizedItems, {[VC.ICON_MY_CONTENT]: value});
                update = {[VC.CUSTOMIZED_ITEMS]: customizedItems}
            }
            update = {[VC.HOME_LIBRARY]: update}
        } else {
            let updateDocument = {}
            let updateLibrary = {}
            const selectedLibraryIcons = _.concat([], this.props.selectedLibraryIcons)
            const selectedDocumentIcons = _.concat([], this.props.selectedDocumentIcons)
            // Library Home
            if (isDossierHome) {
                const dossierToolbarIcons = dossierIconsDossierHome.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    const icons = value ? _.concat(selectedDocumentIcons, validKey) : _.pull(selectedDocumentIcons, validKey)
                    update = {[VC.ICONS]: icons}
                    updateDocument = {[VC.HOME_DOCUMENT]: update} 
                }
            } else {
                // Library Icon
                if (libraryIconKeys.includes(iconKey)) {
                    const icons = value ? _.concat(selectedLibraryIcons, validKey) : _.pull(selectedLibraryIcons, validKey)
                    update = {[VC.ICONS] : icons}
                    updateLibrary = {[VC.HOME_LIBRARY]: update}
                }
                // Dossier Icon
                const dossierToolbarIcons = dossierIcons.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    const icons = value ? _.concat(selectedDocumentIcons, validKey) : _.pull(selectedDocumentIcons, validKey)
                    update = {[VC.ICONS]: icons}
                    updateDocument = {[VC.HOME_DOCUMENT]: update} 
                }
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
            <Layout className={`${classNamePrefix}`}>
                <Layout.Content className={`${classNamePrefix}-left`}>
                    <div className = {`${classNamePrefix}-enable-feature`}>
                        {localizedStrings.ENABLE_FEATURE_TITLE}
                        <div className={`${classNamePrefix}-enable-feature-description`}>
                            {localizedStrings.ENABLE_FEATURE_DESC}
                        </div>
                    </div>

                    {this.renderOptions(this.props.toolbarHidden, VC.TOOLBAR_ENABLED, localizedStrings.DISABLE_TOOLBAR)}
                    {this.renderOptions(this.props.toolbarCollapsed, VC.TOOLBAR_MODE, localizedStrings.COLLAPSE_TOOLBAR)}

                    <div className={`${classNamePrefix}-scrollcontainer`}>
                    {
                        // dossier as home group
                        this.props.isDossierHome && <div className={`${classNamePrefix}-icons`}>
                            { this.renderTableTitle(localizedStrings.DOSSIER_WINDOW_HOME) }
                            { this.renderTable(dossierIconsDossierHome) }
                        </div>
                    }

                    {
                        // library as home group
                        !this.props.isDossierHome && <div className={`${classNamePrefix}-icons`}>
                            { this.renderTableTitle(localizedStrings.LIBRARY_WINDOW) }
                            { this.renderTable(libraryIcons) }
                            { this.renderTableTitle(localizedStrings.DOSSIER_WINDOW) }
                            { this.renderTable(dossierIcons) }
                        </div>
                    }
                    </div>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className={`${classNamePrefix}-right`} width={previewerWidth}>
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
    selectedLibraryCustomizedItems: selectSelectedLibraryCustomizedItems(state),
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
