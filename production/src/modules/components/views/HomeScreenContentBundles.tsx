import * as React from 'react';
import '../scss/HomeScreenContentBundles.scss';
import * as _ from "lodash";
import ContentBundleList from './ContentBundleList';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectCurrentConfigContentBundleIds, selectSelectedSideBarIcons, selectUserViewAllContentEnabled } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { connect } from 'react-redux';
import { GENERAL_PREVIEW_FEATURE_FLAG, iconTypes, localizedStrings } from '../HomeScreenConfigConstant';
import { default as VC } from '../HomeScreenConfigConstant'
import { Tooltip, Select } from '@mstr/rc';
import { Environment } from '@mstr/workstation-types';
import { getFeatureFlag } from './HomeScreenUtils';
import { LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION, isLibraryServerVersionMatch } from '../../../utils';
const { Option } = Select;
const classNamePrefix = 'home-screen-bundle-content';
const bundleIdPath = 'homeScreen.homeLibrary.contentBundleIds';
const sidebarPath = 'homeScreen.homeLibrary.sidebars';


interface HomeScreenContentBundlesState {
  contentDiscoveryFeatureEnable: boolean;
}
class HomeScreenContentBundles extends React.Component<any, HomeScreenContentBundlesState> {
  constructor(props: any) {
    super(props)
    this.state = {
      contentDiscoveryFeatureEnable: false
    }
  }

  handleSelection = () => {

  }

  handleBundleDelete= (deleted: any[]) => {
    const currentIds = this.props.contentBundleIds;
    const deletedIds = deleted.map(bundle => (bundle.id));
    const newIds = _.difference(currentIds, deletedIds);
    this.handleContentBundleChange(newIds);
  }

  handleBundleAdd= (added: any[]) => {
    const currentIds = this.props.contentBundleIds;
    const addedIds = added.map(bundle => (bundle.id));
    const newIds = _.concat(currentIds || [], addedIds);
    this.handleContentBundleChange(newIds);
  }

  handleContentBundleChange = (bundles: any[]) => {
    const currentConfig = this.props.config
    const currentBundles = this.props.contentBundleIds
    let sideBarIcons = _.concat([], this.props.sidebarIcons)
    _.set(currentConfig, bundleIdPath, bundles);
    // set components options 'default groups' automaticlly
    if (!_.isEmpty(currentBundles) && currentBundles.length > 0 && bundles.length === 0) {
        sideBarIcons = _.pull(sideBarIcons, iconTypes.defaultGroup.key)
    } else if ((_.isEmpty(currentBundles) || currentBundles.length === 0) && bundles.length > 0) {
        sideBarIcons = _.concat(sideBarIcons, iconTypes.defaultGroup.key)
    }
    _.set(currentConfig, sidebarPath, sideBarIcons)
    this.props.updateCurrentConfig(currentConfig);
  }
  handleAllowUsersViewAllContentChange = (val: boolean) => {
    const currentConfig = this.props.config;
    _.set(currentConfig, 'homeScreen.homeLibrary.showAllContents', !!val)
    this.props.updateCurrentConfig(currentConfig);
  }

  async componentDidMount() {
    const curEnv: Environment = await workstation.environments.getCurrentEnvironment();
    const contentDiscoveryEnable = !!curEnv.webVersion && isLibraryServerVersionMatch(curEnv.webVersion, LIBRARY_SUPPORT_CONTENT_DISCOVERY_VERSION) && getFeatureFlag(GENERAL_PREVIEW_FEATURE_FLAG, curEnv)

    this.setState({
        contentDiscoveryFeatureEnable: contentDiscoveryEnable
    });
  }


  render() {
    const contentDiscoveryTooltip = this.state.contentDiscoveryFeatureEnable ?
    (
      <>
      { localizedStrings.ALLOW_USERS_VIEW_ALL_CONTENT_TIP }
      <br/>
      <br/>
      { localizedStrings.ALLOW_USERS_VIEW_ALL_CONTENT_TIP2}
      </>
    ) : localizedStrings.ALLOW_USERS_VIEW_ALL_CONTENT_TIP;
    return (
      <div className={`${classNamePrefix}-container`}>
        <ContentBundleList includedIds = {this.props.contentBundleIds} handleSelection = {this.handleSelection} handleDeletion = {this.handleBundleDelete} handleAdd = {this.handleBundleAdd} allowDelete={true}/>
        <div className= {`${classNamePrefix}-message-tip`}>
          {this.props.showAllContentFeatureEnable && <>
            {<Select dropdownMatchSelectWidth={300}
              disabled = {this.props.contentBundleIds?.length > 0 ? false : true}
              style={{ width: "403px", height: "28px"}}
                size="middle" onChange={this.handleAllowUsersViewAllContentChange} defaultValue= {0} value = {this.props.allowUserViewAllContents ? 1 : 0} bordered={true}>
                        <Option value={0}>{localizedStrings.LIMIT_USERS_VIEW_ALL_CONTENT_MSG}</Option>
                        <Option value={1}>{localizedStrings.ALLOW_USERS_VIEW_ALL_CONTENT_MSG}</Option>
                    </Select>
            }
            {/* should be differnt when content discovery is not available. Tooltip did not support new line, use JSX instead. */}
            <Tooltip
              title={contentDiscoveryTooltip}
              placement='rightTop'>
              <span className={VC.FONT_MSG_INFO}> </span>
            </Tooltip>
          </>}

          {
            !this.props.showAllContentFeatureEnable && <>
              <span id ="previous-info-icon" className={VC.FONT_MSG_INFO}> </span>
              <span >{localizedStrings.ADD_CONTENT_BUNDLE_TIP_MSG}</span>
            </>
          }
        </div>

      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state),
  contentBundleIds: selectCurrentConfigContentBundleIds(state),
  sidebarIcons: selectSelectedSideBarIcons(state),
  allowUserViewAllContents: selectUserViewAllContentEnabled(state)
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenContentBundles)
