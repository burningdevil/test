import * as React from 'react';
import '../scss/HomeScreenContentBundles.scss';
import * as _ from "lodash";
import ContentBundleList from './ContentBundleList';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectCurrentConfigContentBundleIds, selectSelectedSideBarIcons } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { connect } from 'react-redux';
import { iconTypes, localizedStrings } from '../HomeScreenConfigConstant';
import { default as VC } from '../HomeScreenConfigConstant'

const classNamePrefix = 'home-screen-bundle-content';
const bundleIdPath = 'homeScreen.homeLibrary.contentBundleIds';
const sidebarPath = 'homeScreen.homeLibrary.sidebars';

class HomeScreenContentBundles extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
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

  render() {
    return (
      <div className={`${classNamePrefix}-container`}>
        <ContentBundleList includedIds = {this.props.contentBundleIds} handleSelection = {this.handleSelection} handleDeletion = {this.handleBundleDelete} handleAdd = {this.handleBundleAdd} allowDelete={true}/>
        <div className= {`${classNamePrefix}-message-tip`}>
          <span className={VC.FONT_MSG_INFO}> </span>
          <span >{localizedStrings.ADD_CONTENT_BUNDLE_TIP_MSG}</span>
        </div>
        
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state),
  contentBundleIds: selectCurrentConfigContentBundleIds(state),
  sidebarIcons: selectSelectedSideBarIcons(state),
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenContentBundles)