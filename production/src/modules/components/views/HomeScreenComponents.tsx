import { Checkbox, Switch, Table, Layout } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenComponents.scss'
import { default as VC, localizedStrings, previewerWidth, platformType, iconDetail, iconTypes, libraryIcons, dossierIcons, dossierIconsDossierHome, extraDesktopIcons, extraMobileIcons, childrenIcons, iconValidKey, libraryIconKeys, sidebarIconKeys, libraryCustomizedIconKeys, mobileOnlyIconKeys, webDesktopOnlyIconKeys, REVERSE, platformSpecificIcons, platformSpecificIconKeys, CONTENT_BUNDLE_FEATURE_FLAG, libraryCustomizedIconDefaultValues, CONTENT_BUNDLE_DEFAULT_GROUP_NAME, GENERAL_PREVIEW_FEATURE_FLAG, contentInfoIcons, IconEnum, IconTypes, IconType } from '../HomeScreenConfigConstant'
import * as _ from 'lodash'
import HomeScreenPreviewer from './HomeScreenPreviewer'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig, selectIsDossierAsHome, selectIsToolbarHidden, selectIsToolbarCollapsed, selectSelectedSideBarIcons, selectSelectedLibraryCustomizedItems, selectSelectedLibraryIcons, selectSelectedDocumentIcons, selectCurrentConfigContentBundleIds, selectDefaultGroupsName, selectUserViewAllContentEnabled } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator';
import { Tooltip } from '@mstr/rc';
import { isLibraryServerVersionMatch, isUserHasManageContentGroupPrivilege, LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION, LIBRARY_SERVER_VERSION_THRESHOLD, LIBRARY_SUPPORT_DOSSIER_AS_HOME_BOOKMARK, LIBRARY_SUPPORT_MOBILE_INSIGHTS, LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION, LIBRARY_SUPPORT_GRANULAR_CONTROL} from '../../../utils';
import { Environment, WorkstationModule } from '@mstr/workstation-types'
import { filterNonsupportIcons, getFeatureFlag } from './HomeScreenUtils'
import { WebVersionContext } from './HomeScreenConfigEditor'
import SettingIcon from './home-screen-components/setting.component'
import { getHomeScreenSpecialIconMap, IconContextInfo, SpecialIconContextInfo, SpecialIconKeyMap } from './home-screen-components/home-screen-components.model'
declare var workstation: WorkstationModule;
const childrenKeyOffset = 1000;
/* ClassName */
const classNamePrefix = 'home-screen-components';
const columnDisplayText = 'displayText';
const columnSelected = 'selected';


interface HomeScreenComponentsState {
    extraIcons: iconDetail[],
    contentBundleFeatureEnable: boolean;
    defaultGroupEnable: boolean,
    contentDiscoveryFeatureEnable: boolean;
    mobileOptionsVisible: boolean,
    webOptionsVisible: boolean,
    webVersion: string;
    homeScreenSpecialIconMap: SpecialIconContextInfo
}

class HomeScreenComponents extends React.Component<any, HomeScreenComponentsState> {
    findParentIcon = (iconKey: IconEnum) => {
        const candidateParents = Object.keys(this.state.homeScreenSpecialIconMap).filter(v => this.state.homeScreenSpecialIconMap[v].children?.length)
        const targetIcons = candidateParents?.filter(v => this.state.homeScreenSpecialIconMap[v]?.children?.map(c => c.key).includes(iconKey));
        // special case: there maybe two parent icons for specific iconKey. In this case, should judge the two parent icons are same.
        if (!targetIcons?.length) {
            return null;
        }else {
            let resIcons = Array.from(new Set(targetIcons));
            if (resIcons.length === 1){
                return resIcons[0];
            }else {
                // there are more than one parent icon, should filter the contradictory case.In principle, only one key icon can exist at a time for rendering
                // If library as home, should not display the options, if dossier as home should not display the options_mobile/options_web
                if(this.props.isDossierHome){
                    resIcons = resIcons.filter(v => ![iconTypes.accountMobile.key, iconTypes.accountWeb.key].includes(v))
                }else {
                    resIcons = resIcons.filter(v => ![iconTypes.accountMobileDossier.key, iconTypes.accountWebDossier.key, iconTypes.account.key].includes(v))
                }
                return resIcons[0];
            }
            
        }
        
    }
    parentIconDisabled = (iconKey: IconEnum) => {
        const parentIcon = this.findParentIcon(iconKey as IconEnum);
        if(!parentIcon || this.state.homeScreenSpecialIconMap[parentIcon]?.dummy ) return false;
        return !(this.iconContextInfo(parentIcon)?.selected)
    }
    ancestorIconDisabled = (iconKey: string) => {
        let currentIcon  = iconKey;
        let disable = this.parentIconDisabled(currentIcon as IconEnum);
        while(currentIcon && !disable){
            currentIcon = this.findParentIcon(currentIcon as IconEnum);
            disable = this.parentIconDisabled(currentIcon as IconEnum);
            if(disable){
                return true;
            }
        }
        return disable;
    }
    isIconDisabled = (iconKey: string) => {
        // toolbar hidden
        const { toolbarHidden } = this.props;
        // special case: new dossier will be disabled when the edit dossier is disabled or content bundle length > 0 and not allow the view all contents checkbox.
        if (iconKey === iconTypes.newDossier.key) {
            if (
                this.props.contentBundleIds?.length > 0 &&
                !this.props.allowUserViewAllContents
            ) {
                return true;
            }
            if (
                this.props.selectedLibraryCustomizedItems[
                    iconTypes.editDossier.key
                ] === false
            ) {
                return true;
            }
        }
        if (iconKey === iconTypes.addLibrary.key) {
            if (
                this.props.selectedLibraryCustomizedItems[
                    iconTypes.switch_library.key
                ] === false
            ) {
                return true;
            }
        }
        if (iconKey === iconTypes.contentDiscovery.key) {
            if (
                this.props.contentBundleIds?.length > 0 &&
                !this.props.allowUserViewAllContents
            ) {
                return true;
            }
        }
        let disabled = false;
        if (
            mobileOnlyIconKeys.includes(iconKey) &&
            !this.state.mobileOptionsVisible
        ) {
            disabled = true;
        } else if (
            webDesktopOnlyIconKeys.includes(iconKey) &&
            !this.state.webOptionsVisible &&
            !this.props.isDossierHome
        ) {
            disabled = true;
        } else if (iconKey === iconTypes.all.key) {
            // disable all switch button by default.
            disabled = true;
        }
        // special logic added by the granular control.
        // the logic flow is firstly find the parent icon if existed. Then judge the parent option whether is off.
        //decouple the switch library icon with the parent sidebar when dossier as home.
        if (
            iconKey === iconTypes.switch_library.key &&
            this.props.isDossierHome
        ) {
            return disabled || toolbarHidden;
        }
        const parentIconDisabled = this.ancestorIconDisabled(
            iconKey as IconEnum
        );
        // toolbar hidden will not affect the content info section.
        if (contentInfoIcons.map((v) => v.key).includes(iconKey)) {
            return disabled || parentIconDisabled;
        }
        return disabled || toolbarHidden || parentIconDisabled;
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
            if (iconKey === iconTypes.contentDiscovery.key) {
                if (!(this.props.contentBundleIds?.length > 0 && !this.props.allowUserViewAllContents)) {
                    return false
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
            // width: 205,
            render: (icon: [string, string, IconContextInfo]) => {
                return (
                    <>
                    {
                    !icon[2]?.expandable &&
                    <span style={ icon[2] && !icon[2]?.dummy && this.isIconDisabled(icon[2]?.iconKey as IconEnum) ?  {opacity: 0.5} : {opacity: 1.0}}>
                        {icon[0] && <span className={icon[0]}/>}
                        <span className={icon[0] ? `${classNamePrefix}-table-text` : `${classNamePrefix}-table-text-no-icon`}>  {icon[1]}  </span> 
                    </span>
                    }
                    {icon[2]?.configurable && <SettingIcon enabled = {icon[2]?.selected && !icon[2]?.dummy &&!this.isIconDisabled(icon[2]?.iconKey as IconEnum)} iconKey = {icon[2]?.iconKey} independentSetting = {icon[2]?.independentSetting}></SettingIcon>}
                    {
                             icon[2]?.tooltipStr && <Tooltip 
                                title={icon[2]?.tooltipStr}
                                placement='right'>
                                <span className={VC.FONT_MSG_INFO}> </span>
                                </Tooltip>
                        }
                    </>
                )
            }
        },
        {
            title: '',
            key: columnSelected,
            dataIndex: columnSelected,
            align: 'right' as const,
            width: 140,
            render: (selectedInfo: IconContextInfo) => {
                return (

                    <div>
                        {
                            !this.props.toolbarHidden && this.isHelpTipShow(selectedInfo.iconKey) && <Tooltip 
                                title={Object.values(iconTypes).find(v => v.key === selectedInfo.iconKey).tipMsg}
                                placement='right'>
                                <span className={VC.FONT_MSG_INFO}> </span>
                                </Tooltip>
                        }
                        { !selectedInfo?.dummy && < Switch checked={selectedInfo.selected} onChange={
                    (e) => this.onIconStateChange(e, selectedInfo.iconKey)} disabled={this.isIconDisabled(selectedInfo.iconKey)} size={'small'} />}
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

    iconContextInfo = (iconKey: string): IconContextInfo => {
        const validKey = iconValidKey(iconKey) // transform 'account_web', 'account_mobile', to 'account'
        let configurable = this.state.homeScreenSpecialIconMap[iconKey]?.configurable;
        let independentSetting = this.state.homeScreenSpecialIconMap[iconKey]?.independentSetting;
        let tooltipStr = this.state.homeScreenSpecialIconMap[iconKey]?.tooltipStr;
        let dummy = this.state.homeScreenSpecialIconMap[iconKey]?.dummy;
        const expandable = this.state.homeScreenSpecialIconMap[iconKey]?.expandable;
        let selected = false;
        if(dummy){
            iconKey = iconKey.replace('_dossier_home', '');
        }
        if (libraryCustomizedIconKeys.includes(iconKey)) {
            selected = _.get(this.props.selectedLibraryCustomizedItems, iconKey, libraryCustomizedIconDefaultValues[iconKey]);
            // special case for the edit dossier and new dossier.
            if(iconKey === iconTypes.newDossier.key){
                if(_.get(this.props.selectedLibraryCustomizedItems, iconTypes.editDossier.key) === false){
                    selected = false;
                }
                if(this.props.contentBundleIds?.length > 0 && !this.props.allowUserViewAllContents){
                    selected = false;
                }
            }
            // if the switch application is false, should disable the add library
            if(iconKey === iconTypes.addLibrary.key){
                if(_.get(this.props.selectedLibraryCustomizedItems, iconTypes.switch_library.key) === false){
                    selected = false;
                }
            }
                return {selected, iconKey, expandable, configurable, tooltipStr, dummy,independentSetting};
        }
        // added by the granular control. 
        // there are two special icons depends on the home moreSetting.
        if(iconKey === iconTypes.mobile_preferences.key){
            selected = !this.props.config?.general?.disablePreferences;
        }
        if(iconKey === iconTypes.mobile_advancedSettings.key){
            selected = !this.props.config?.general?.disableAdvancedSettings;
        }
        if (sidebarIconKeys.includes(iconKey)) {
            selected = this.props.selectedSidebarIcons.includes(validKey);
        } else {
            if (this.props.isDossierHome) {
                const dossierToolbarIcons = dossierIconsDossierHome.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    selected = this.props.selectedDocumentIcons.includes(validKey)
                }
                // Library Icon
                if (libraryIconKeys.includes(iconKey)) {
                    selected = this.props.selectedLibraryIcons.includes(validKey)
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
        return {selected, iconKey, expandable, configurable, tooltipStr, dummy, independentSetting}
    }

    // components
    renderTableExpander = (icon: [string, string, IconContextInfo], expanded: boolean) => {
        return (
            <span style={ !icon[2]?.dummy && this.isIconDisabled(icon[2]?.iconKey as IconEnum) ?  {opacity: 0.5} : {opacity: 1.0}}>
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
        const marginLeft = props.record.key >= childrenKeyOffset ? '12px' : '0px'
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
    filterUnsupportIcons = (childrenIcons: IconType[],webVersion: string) => {
        return childrenIcons;
        let tarChildIcons = filterNonsupportIcons(childrenIcons, webVersion);
        if (!this.state.contentBundleFeatureEnable){
            tarChildIcons = tarChildIcons?.filter(item => item.key !== iconTypes.defaultGroup.key);
        }
        if (!this.state.contentDiscoveryFeatureEnable) {
            tarChildIcons = tarChildIcons?.filter(item => item.key !== iconTypes.contentDiscovery.key)
        }
        return tarChildIcons;
    }
    generateChildrenData = (iconKey: string, webVersion: string) => {
        if(!this.state.homeScreenSpecialIconMap[iconKey]?.expandable) return null;
        
        let tarChildIcons = this.filterUnsupportIcons(this.state.homeScreenSpecialIconMap[iconKey]?.children, this.state.webVersion);
    
        const expandChildren = tarChildIcons
        .map( (icon, index) =>  {
            let displayText = icon.displayText
            let children;
            if(icon.key === iconTypes.defaultGroup.key) {
                let defaultGroupName = localizedStrings.DEFAULT_GROUPS;
                if(this.props.defaultGroupsName && this.props.defaultGroupsName !== CONTENT_BUNDLE_DEFAULT_GROUP_NAME){
                    defaultGroupName = this.props.defaultGroupsName;
                }
                displayText = defaultGroupName;
            }
            // special handling the insights label, version check
            if(icon.key === iconTypes.insights.key){
                if(!isLibraryServerVersionMatch(webVersion, LIBRARY_SUPPORT_MOBILE_INSIGHTS)){
                    displayText = localizedStrings.INSIGHTS_WEB_ONLY;
                }
            }
            children = this.generateChildrenData(icon.key, webVersion)
            if(children) {
                return (
                    {key: index + icon.key, displayText: [icon.iconName, displayText, this.iconContextInfo(icon.key)], selected: this.iconContextInfo(icon.key), children: this.generateChildrenData(icon.key, webVersion), expandable: true}
                )
            }else{
                return (
                    {key: index + icon.key, displayText: [icon.iconName, displayText, this.iconContextInfo(icon.key)], selected: this.iconContextInfo(icon.key), expandable: false}
                )
            }
            
        }
        )
        return expandChildren
        
    }
    renderTable = (icons: Array<iconDetail>, webVersion: string) => {
        // let tarChildIcons = filterNonsupportIcons(childrenIcons, this.state.webVersion);
        // if (!this.state.contentBundleFeatureEnable){
        //     tarChildIcons = tarChildIcons.filter(item => item.key !== iconTypes.defaultGroup.key);
        // }
        // let tarChildIcons = this.filterUnsupportIcons(childrenIcons, this.state.webVersion);
        
        const data = icons
            .map( (icon, index) => {
                // const hasChildren = iconExpandable(icon.displayText);
                const childrenIcons = this.generateChildrenData(icon.key, webVersion);
                const selectedInfo = this.iconContextInfo(icon.key)
                return (
                    childrenIcons ? {key: icon.key, displayText: [icon.iconName, icon.displayText, selectedInfo], selected: selectedInfo, children: childrenIcons, expandable: true} : {key: icon.key, displayText: [icon.iconName, icon.displayText, selectedInfo], selected: selectedInfo, expandable: false}
                )
            }
        )
        return <Table className={`${classNamePrefix}-table`} dataSource={data} columns={this.columns} pagination={false} showHeader={false} expandIcon={(props) => this.customExpandIcon(props)} />
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
    getAffectedChangeConfig = (value: boolean, iconKey: string, currentConfig: any, recursive?: boolean) => {
        const { isDossierHome } = this.props;
        if(this.state.homeScreenSpecialIconMap[iconKey]?.dummy){
            iconKey = iconKey.replace('_dossier_home', '');
        }
        const validKey = iconValidKey(iconKey);
        const handleCustomizedIcon = (iconKey: string, value: boolean) => {
            if (libraryCustomizedIconKeys.includes(iconKey)) {
                const currentCustomizedItems = _.get(currentConfig, 'homeScreen.homeLibrary.customizedItems', {})
                const customizedItems = _.assign(currentCustomizedItems, this.props.selectedLibraryCustomizedItems, {[iconKey]: value});
                // special case for the disable edit dossier, the new dossier should be forbidden subsequently.
                if(iconKey === iconTypes.editDossier.key && value === false){
                    customizedItems[iconTypes.newDossier.key] = value;
                }
                if(iconKey === iconTypes.switch_library.key && value === false){
                    customizedItems[iconTypes.addLibrary.key] = value;
                }
                _.set(currentConfig, 'homeScreen.homeLibrary.customizedItems', customizedItems)
                return true;
            };
            return false;
        }
        if(handleCustomizedIcon(iconKey, value)) return currentConfig;
        // handle the two special icons that located in the more settings previously.
        const handleSpecialIcon = (iconKey: string, value: boolean) => {
            if (Object.keys(SpecialIconKeyMap).includes(iconKey)) {
                _.set(currentConfig, SpecialIconKeyMap[iconKey], !value);
                return true;
            };
            return false;
        }
        if(handleSpecialIcon(iconKey, value)) return currentConfig;
        
        let update = {};
        const updateIconsInList = (targetIcons: string[], validKey: string, value: boolean) => {
            if (!value){
                return targetIcons.filter(v => v !== validKey)
            }else {
                targetIcons.push(validKey);
                return Array.from(new Set(targetIcons))
            }
        }
        // check side bar icons
        if (sidebarIconKeys.includes(iconKey)) {
            let icons = updateIconsInList([..._.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.ICON_SIDEBAR}`)], validKey, value)
            _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.ICON_SIDEBAR}`, icons);

        } else {
            let updateDocument = {}
            let updateLibrary = {}
            const selectedLibraryIcons = _.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.ICONS}`)
            const selectedDocumentIcons = _.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_DOCUMENT}.${VC.ICONS}`)
            // special handle
            const customizedItems = _.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`);
            // special case for the disable filter, the filter summary should be disabled subsequently.
            if(iconKey === iconTypes.filter.key && value === false){
                customizedItems[iconTypes.filter_summary.key] = value;
            }
            // Library Home
            if (isDossierHome) {
                const dossierToolbarIcons = dossierIconsDossierHome.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    const icons = updateIconsInList(selectedDocumentIcons, validKey, value)
                    update = {[VC.ICONS]: icons}
                    updateDocument = {
                        [VC.HOME_DOCUMENT]: update,
                        [VC.HOME_LIBRARY]: {
                            [VC.CUSTOMIZED_ITEMS]: customizedItems
                    }} 
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_DOCUMENT}.${VC.ICONS}`, icons);
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`, customizedItems);
                }
                // Library Icon
                if (libraryIconKeys.includes(iconKey)) {
                    const icons = updateIconsInList(selectedLibraryIcons, validKey, value)
                    update = {[VC.ICONS] : icons}
                    updateLibrary = {[VC.HOME_LIBRARY]: update}
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.ICONS}`, icons);
                }
            } else {
                // Library Icon
                if (libraryIconKeys.includes(iconKey)) {
                    const icons = updateIconsInList(selectedLibraryIcons, validKey, value)
                    update = {[VC.ICONS] : icons}
                    updateLibrary = {[VC.HOME_LIBRARY]: update}
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.ICONS}`, icons);
                }
                // Dossier Icon
                const dossierToolbarIcons = dossierIcons.map((element) => element.key);
                if (dossierToolbarIcons.includes(iconKey)) {
                    const icons = updateIconsInList(selectedDocumentIcons, validKey, value)
                    update = {[VC.ICONS]: icons}
                    updateDocument = {
                        [VC.HOME_DOCUMENT]: update,
                        [VC.HOME_LIBRARY]: {
                            [VC.CUSTOMIZED_ITEMS]: customizedItems
                        }
                    } 
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_DOCUMENT}.${VC.ICONS}`, icons);
                    _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`, customizedItems);
                }
            }
            update = _.merge(updateDocument, updateLibrary);
        }
        return currentConfig;

    }
    onIconStateChange = (value: boolean, iconKey: string, recursive?: boolean) => { 
        let currentConfig = this.props.config;
        currentConfig  = this.getAffectedChangeConfig(value, iconKey, currentConfig);
        
        const handleParentDependentChange = (iconKey: string, value: boolean) => {
            if(recursive) return;
            // handle the children case, if all the children icons are off, enable the parent icon will turn on the children icons automatically.
            if(value === true){
                const dfs = (iconKey: string) => {
                    const childrenIcons = this.filterUnsupportIcons(this.state.homeScreenSpecialIconMap[iconKey]?.children, this.state.webVersion)?.map(v => v.key);
                    if(!childrenIcons?.length) return;
                    if(childrenIcons?.every(t => this.iconContextInfo(t)?.selected === false)){
                        for(let i =0; i< childrenIcons?.length;i++){
                            currentConfig = this.getAffectedChangeConfig(true, childrenIcons[i], currentConfig)
                            dfs(childrenIcons[i]);
                        }
                    }
                }
                dfs(iconKey);
            }
            // handle the children icons are off then turn off the parent icon.
            const offTheAncestor = (iconKey: IconEnum) => {
                // find the parent icon;
                let parentIcon = this.findParentIcon(iconKey as IconEnum);
                if(this.state.homeScreenSpecialIconMap[parentIcon]?.independentWithChild || !parentIcon){
                    return;
                }
                const siblingIcons = this.filterUnsupportIcons(this.state.homeScreenSpecialIconMap[parentIcon]?.children, this.state.webVersion)?.filter(v => v.key !== iconKey)?.map(v => v.key) ?? [];
                // if the sibling icons are all off and the current value is off, then switch off the parent icon. And the vice versa.
                const judgeSame = (targetIcons: IconEnum[], currentVal: boolean) => {
                    return targetIcons?.every(t => this.iconContextInfo(t)?.selected === currentVal);
                };
                
                const isSame = judgeSame(siblingIcons as IconEnum[], value);
                if (isSame){
                    currentConfig = this.getAffectedChangeConfig(value, parentIcon, currentConfig)
                }
                if(isSame){
                    offTheAncestor(parentIcon as IconEnum);
                }
            }
            offTheAncestor(iconKey as IconEnum);
            

        }
        handleParentDependentChange(iconKey, value);
        this.props.updateCurrentConfig(currentConfig)
        return
    }

    // Life cycle
    constructor(props: any) {
        super(props)
        this.state = {...this.getNewState(),
            homeScreenSpecialIconMap: getHomeScreenSpecialIconMap()
        };
    }

    componentDidUpdate() {
        const newState = this.getNewState()
        if (!_.isEqual(newState.extraIcons, this.state.extraIcons) || newState.defaultGroupEnable !== this.state.defaultGroupEnable || newState.mobileOptionsVisible !== this.state.mobileOptionsVisible || newState.webOptionsVisible !== this.state.webOptionsVisible) {
            this.setState(newState)
        }
    }
    async componentDidMount() {
        const curEnv: Environment = await workstation.environments.getCurrentEnvironment();
        const contentBundleEnable = !!curEnv.webVersion && isLibraryServerVersionMatch(curEnv.webVersion, LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION) && isUserHasManageContentGroupPrivilege(curEnv.privileges);
        const contentDiscoveryEnable = !!curEnv.webVersion && isLibraryServerVersionMatch(curEnv.webVersion, LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION) && getFeatureFlag(GENERAL_PREVIEW_FEATURE_FLAG, curEnv)

        this.setState({
            contentBundleFeatureEnable: contentBundleEnable,
            contentDiscoveryFeatureEnable: contentDiscoveryEnable,
            webVersion: curEnv.webVersion,
            homeScreenSpecialIconMap: getHomeScreenSpecialIconMap(curEnv?.webVersion)
             
        });
      }
    generateContentInfo(webVersion: string) {
        if (!isLibraryServerVersionMatch(webVersion, LIBRARY_SUPPORT_GRANULAR_CONTROL)){
            return (<></>)
        }
        return (
            <>
                { this.renderTableTitle(localizedStrings.CONTENT_INFO) }
                { this.renderTable(contentInfoIcons, webVersion) }
            </>
         )
    }
    render() {
        return (
            <WebVersionContext.Consumer>
                {(value) => {
                    const webVersion = value?.webVersion ?? LIBRARY_SERVER_VERSION_THRESHOLD;
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
                            { this.renderTable(isLibraryServerVersionMatch(webVersion, LIBRARY_SUPPORT_DOSSIER_AS_HOME_BOOKMARK) ? dossierIconsDossierHome : dossierIconsDossierHome.filter(v => v.key !== iconTypes.bookmark.key), webVersion)}
                            { this.generateContentInfo(webVersion)}
                            { this.renderTableTitle(localizedStrings.PLATFORM_SPECIFIC) }
                            { this.renderTable(platformSpecificIcons, webVersion) }
                        </div>
                    }

                    {
                        // library as home group
                        !this.props.isDossierHome && <div className={`${classNamePrefix}-icons`}>
                            { this.renderTableTitle(localizedStrings.LIBRARY_WINDOW) }
                            { this.renderTable(libraryIcons, webVersion) }
                            { this.renderTableTitle(localizedStrings.DOSSIER_WINDOW) }
                            { this.renderTable(dossierIcons, webVersion) }
                            { this.generateContentInfo(webVersion)}
                            { this.renderTableTitle(localizedStrings.PLATFORM_SPECIFIC) }
                            { this.renderTable(platformSpecificIcons, webVersion) }
                        </div>
                    }
                    </div>
                </Layout.Content>
                {/* previewer */}
                <Layout.Sider className={`${classNamePrefix}-right`} width={previewerWidth}>
                    {/* content discovery preview should be disabled when has content bundle and cotent is limited */}
                    <HomeScreenPreviewer contentBundleFeatureEnable = {this.state.contentBundleFeatureEnable} hasContent = {this.state.defaultGroupEnable} webVersion = {this.state.webVersion}
                    contentDiscoveryFeatureEnable = {this.state.contentDiscoveryFeatureEnable && !(this.props.contentBundleIds?.length > 0 && !this.props.allowUserViewAllContents)} />
                </Layout.Sider>
            </Layout>
                    )
                }
            }
            </WebVersionContext.Consumer>
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
    allowUserViewAllContents: selectUserViewAllContentEnabled(state)
})

const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenComponents)
