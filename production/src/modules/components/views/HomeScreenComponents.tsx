import { Checkbox, Switch, Table, Layout } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenComponents.scss'
import { default as VC, localizedStrings, previewerWidth, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons, iconValidKey, libraryIconKeys, sidebarIconKeys, libraryCustomizedIconKeys, mobileOnlyIconKeys, webDesktopOnlyIconKeys, REVERSE, platformSpecificIcons, platformSpecificIconKeys, CONTENT_BUNDLE_FEATURE_FLAG, libraryCustomizedIconDefaultValues, CONTENT_BUNDLE_DEFAULT_GROUP_NAME } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import HomeScreenPreviewer from './HomeScreenPreviewer'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectIsDossierAsHome, selectIsToolbarHidden, selectIsToolbarCollapsed, selectSelectedSideBarIcons, selectSelectedLibraryCustomizedItems, selectSelectedLibraryIcons, selectSelectedDocumentIcons, selectCurrentConfigContentBundleIds, selectDefaultGroupsName } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator';
import { Tooltip } from '@mstr/rc'
import * as api from '../../../services/Api';
import { isLibraryServerVersionMatch, LIBRARY_SERVER_SUPPORT_DOC_TYPE_VERSION } from '../../../utils';


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
    contentBundleFeatureEnable: boolean;
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
        // special case: new dossier will be disabled when the edit dossier is disabled or content bundle length > 0.
        if(iconKey === iconTypes.newDossier.key){
            if(this.props.contentBundleIds?.length > 0){
                return true;
            }
            if(this.props.selectedLibraryCustomizedItems[iconTypes.editDossier.key] === false){
                return true;
            }
        }
        let disabled = false
        if (mobileOnlyIconKeys.includes(iconKey) && !this.state.mobileOptionsVisible) {
            disabled = true
        } else if (webDesktopOnlyIconKeys.includes(iconKey) && !this.state.webOptionsVisible && !this.props.isDossierHome) {
            disabled = true
        }else if (iconKey === iconTypes.all.key) { // disable all switch button by default.
            disabled = true
        }
        return disabled || toolbarHidden || sidebarDisabled
    }
    /**
     * 
     * @param iconKey 
     * if the icon has the attribute such as deps: ['!sidebar', '!account']
     * the return result is dependent on the sidebar icon is off and account icon is off.
     * @returns boolean
     */
    isHelpTipShow = (iconKey: string) => {
        const allIcons = Object.keys(iconTypes).filter(v => iconTypes[v].supportTip);
        const allIconKeys = allIcons.map(v => iconTypes[v].key);
        const validKey = iconValidKey(iconKey);
        if(allIconKeys.includes(iconKey)){
            const targetItem = iconTypes[allIcons[allIconKeys.indexOf(iconKey)]];
            if(iconKey === iconTypes.newDossier.key){
                if(this.props.contentBundleIds?.length > 0 || this.props.selectedLibraryCustomizedItems[iconTypes.editDossier.key] === false){
                    return false;
                }else{
                    targetItem.tipMsg = localizedStrings.DISABLE_NEW_DOSSIER_TOOLTIP;
                }
            }
            if(iconKey === iconTypes.editDossier.key){
                if(this.props.isDossierHome){
                    return false;
                }
            }
            
            if(!targetItem.deps?.length){
                return true;
            }
            const deps = targetItem.deps;
            let validResult = true;
            for(let dep of deps){
                let validReverse = dep.includes(REVERSE);
                let key = dep;
                if(validReverse){
                    key = dep.split(REVERSE)[1];
                };
                key = iconValidKey(key);
                // check all related props one time.
                const check = ['selectedDocumentIcons', 'selectedLibraryIcons'];
                const temp = check.some(v => this.props[v].includes(key));
                validResult = (!validReverse && temp) || (validReverse && !temp);
                if(!validResult){
                    return false;
                }
                // check for the customized item.
                if(libraryCustomizedIconKeys.includes(key)){
                    const check_customized = Object.keys(this.props.selectedLibraryCustomizedItems).includes(key);
                    if(!check_customized || (validReverse && this.props.selectedLibraryCustomizedItems[key] === true) || (!validReverse && this.props.selectedLibraryCustomizedItems[key] === false)){
                        return false;
                    }
                }

            };
            return true;

        }
        return false;
    }
    
    columns = [
        {
            title: '',
            key: columnDisplayText,
            dataIndex: columnDisplayText,
            align: 'left' as const,
            render: (icon: [string, string, [boolean, string]]) => {
                return (
                    !iconExpandable(icon[1]) &&
                    <span style={ icon[2] && !this.props.selectedLibraryIcons.includes(iconTypes.sidebar.key) && sidebarIconKeys.includes(icon[2][1]) ?  {opacity: 0.5} : {opacity: 1.0}}>
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
                    
                    <div>
                        {
                            !this.props.toolbarHidden && this.isHelpTipShow(selectedInfo[1]) && <Tooltip 
                                title={Object.values(iconTypes).find(v => v.key === selectedInfo[1]).tipMsg}
                                placement='right'>
                                <span className={VC.FONT_MSG_INFO}> </span>
                                </Tooltip>
                        }
                        < Switch checked={selectedInfo[0]} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo[1])} disabled={this.isIconDisabled(selectedInfo[1])} size={'small'} />
                    </div>
                    
                )
            }
        }
    ];
    getNewState = () => {
        let state = {...this.state}
        
        const {contentBundleIds, config, isDossierHome} = this.props
        const {platforms} = config;

        if (!isDossierHome) {
            state.defaultGroupEnable = !_.isEmpty(contentBundleIds) && contentBundleIds.length > 0 && state.contentBundleFeatureEnable === true;
            state.mobileOptionsVisible = true;
            state.webOptionsVisible = true;
        }
   
        const extraIcons = _.concat(platforms.includes(platformType.desktop) ? extraDesktopIcons : [], platforms.includes(platformType.mobile) ? extraMobileIcons : [])
        state.extraIcons = extraIcons
        return state
    }

    iconSelectedInfo = (iconKey: string) => {
        const validKey = iconValidKey(iconKey) // transform 'account_web', 'account_mobile', to 'account'
        let selected = false;
        if (libraryCustomizedIconKeys.includes(iconKey)) {
            selected = _.get(this.props.selectedLibraryCustomizedItems, iconKey, libraryCustomizedIconDefaultValues[iconKey]);
            // special case for the edit dossier and new dossier.
            if(iconKey === iconTypes.newDossier.key){
                if(_.get(this.props.selectedLibraryCustomizedItems, iconTypes.editDossier.key) === false){
                    selected = false;
                }
                if(this.props.contentBundleIds?.length > 0){
                    selected = false;
                }
            }
                return [selected, iconKey];
        }
        if (sidebarIconKeys.includes(iconKey)) {
            selected = this.props.selectedSidebarIcons.includes(validKey);
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
                <span className={`${classNamePrefix}-sidebar-caret`}>
                    {expanded && <CaretDownOutlined/>}
                    {!expanded && <CaretRightOutlined/>}
                </span>
                
                <span className={icon[0]}/>
                <span className={`${classNamePrefix}-table-text`}>  {icon[1]}  </span> 
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
        let tarChildIcons = childrenIcons;
        if (!this.state.contentBundleFeatureEnable){
            tarChildIcons = childrenIcons.filter(item => item.key !== iconTypes.defaultGroup.key);
        }
        const expandChildren = tarChildIcons
            .map( (icon, index) =>  {
                let displayText = icon.displayText
                if(icon.key === iconTypes.defaultGroup.key) {
                    let defaultGroupName = localizedStrings.DEFAULT_GROUPS;
                    if(this.props.defaultGroupsName && this.props.defaultGroupsName !== CONTENT_BUNDLE_DEFAULT_GROUP_NAME){
                        defaultGroupName = this.props.defaultGroupsName;
                    }
                    displayText = defaultGroupName;
                }
                return (
                    {key: childrenKeyOffset+index, displayText: [icon.iconName, displayText, this.iconSelectedInfo(icon.key)], selected: this.iconSelectedInfo(icon.key)}
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

    renderOptions = (checked: boolean, value: string, text: string, tip?: boolean) => {
        return <div className = {`${classNamePrefix}-toolbar`}>
            <Checkbox 
                checked={checked}
                value={value}
                disabled={value === VC.TOOLBAR_MODE ? this.props.toolbarHidden : false}
                onChange = {(e) => this.onToolbarStateChange(e.target.value, e.target.checked)}>
                {text}
            </Checkbox>
            {
                this.props.toolbarHidden && tip && <Tooltip 
                    title={localizedStrings.DISABLE_TOOLBAR_TOOLTIP}
                    placement='right'>
                    <span className={VC.FONT_MSG_INFO}> </span>
                </Tooltip>
            }
            
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
        const { isDossierHome } = this.props;
        const validKey = iconValidKey(iconKey);
        const handleCustomizedIcon = (iconKey: string, value: boolean) => {
            if (libraryCustomizedIconKeys.includes(iconKey)) {
                const customizedItems = _.assign({}, this.props.selectedLibraryCustomizedItems, {[iconKey]: value});
                // special case for the disable edit dossier, the new dossier should be forbidden subsequently.
                if(iconKey === iconTypes.editDossier.key && value === false){
                    customizedItems[iconTypes.newDossier.key] = value;
                }
                let customizedConfig = {
                    [VC.HOME_SCREEN]: {
                        [VC.HOME_LIBRARY]: {
                            [VC.CUSTOMIZED_ITEMS]: customizedItems
                        }
                    }
                }
                this.props.updateCurrentConfig(customizedConfig);
                return true;
            };
            return false;
        }
        if(handleCustomizedIcon(iconKey, value)) return;
        let update = {};
        // check side bar icons
        if (sidebarIconKeys.includes(iconKey)) {
            let icons = value ? _.concat([], this.props.selectedSidebarIcons, validKey) : _.pull(_.concat([], this.props.selectedSidebarIcons), validKey)
            let config = {[VC.ICON_SIDEBAR]: icons}
            update = {[VC.HOME_LIBRARY]: config}
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
            
            update = _.merge(updateDocument, updateLibrary);
        }
        update = {[VC.HOME_SCREEN]: update};
        this.props.updateCurrentConfig(update) 
    }

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = this.getNewState();
    }

    componentDidUpdate() {
        const newState = this.getNewState()
        if (!_.isEqual(newState.extraIcons, this.state.extraIcons) || newState.defaultGroupEnable !== this.state.defaultGroupEnable || newState.mobileOptionsVisible !== this.state.mobileOptionsVisible || newState.webOptionsVisible !== this.state.webOptionsVisible) {
            this.setState(newState)
        }
    }
    async componentDidMount() {
        const status: any = await api.getServerStatus();
        const contentBundleEnable = !!status.webVersion && isLibraryServerVersionMatch(status.webVersion, LIBRARY_SERVER_SUPPORT_DOC_TYPE_VERSION);
        this.setState({
            contentBundleFeatureEnable: contentBundleEnable
        });
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

                    {this.renderOptions(this.props.toolbarHidden, VC.TOOLBAR_ENABLED, localizedStrings.DISABLE_TOOLBAR, true)}
                    {this.renderOptions(this.props.toolbarCollapsed, VC.TOOLBAR_MODE, localizedStrings.COLLAPSE_TOOLBAR)}

                    <div className={`${classNamePrefix}-scrollcontainer`}>
                    {
                        // dossier as home group
                        this.props.isDossierHome && <div className={`${classNamePrefix}-icons`}>
                            { this.renderTableTitle(localizedStrings.DOSSIER_WINDOW_HOME) }
                            { this.renderTable(dossierIconsDossierHome) }
                            { this.renderTableTitle(localizedStrings.PLATFORM_SPECIFIC) }
                            { this.renderTable(platformSpecificIcons) }
                        </div>
                    }

                    {
                        // library as home group
                        !this.props.isDossierHome && <div className={`${classNamePrefix}-icons`}>
                            { this.renderTableTitle(localizedStrings.LIBRARY_WINDOW) }
                            { this.renderTable(libraryIcons) }
                            { this.renderTableTitle(localizedStrings.DOSSIER_WINDOW) }
                            { this.renderTable(dossierIcons) }
                            { this.renderTableTitle(localizedStrings.PLATFORM_SPECIFIC) }
                            { this.renderTable(platformSpecificIcons) }
                        </div>
                    }
                    </div>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className={`${classNamePrefix}-right`} width={previewerWidth}>
                    <HomeScreenPreviewer contentBundleFeatureEnable = {this.state.contentBundleFeatureEnable} hasContent = {this.state.defaultGroupEnable}/>
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
