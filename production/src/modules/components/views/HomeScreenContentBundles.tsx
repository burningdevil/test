import * as React from 'react';
import '../scss/HomeScreenContentBundles.scss';
import * as _ from "lodash";
import { WorkstationModule } from '@mstr/workstation-types';
import ContentBundleList from './ContentBundleList';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectCurrentConfigContentBundleIds } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { connect } from 'react-redux';
import { iconTypes } from '../HomeScreenConfigConstant';

declare var workstation: WorkstationModule;

class HomeScreenContentBundles extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }

  /* --------------- Below used for select dossier in workstation native way -----------------------*/
//   async componentDidMount() {
//     workstation.window.addHandler(WindowEvent.POSTMESSAGE, (message: any) => {
//       console.log(message);
//       const response = _.get(message, 'Message.selectedBundleList', '');
//       if (response) {
//         const currentIds = this.props.contentBundleIds;
//         const addedIds = response.map(bundle => (bundle.id));
//         const newIds = _.concat(currentIds, addedIds);
//         console.log('new ids added');
//         console.log(newIds);
//         this.props.handleChange(newIds);
//       }
//       return {
//           ResponseValue: true
//       };
//   });
// }
/* --------------- Above used for select dossier in workstation native way -----------------------*/

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
    const currentConfig = this.props.config;
    const currentBundles = _.get(currentConfig, 'homeScreen.homeLibrary.contentBundleIds')
    let sideBarIcons = _.get(currentConfig, 'homeScreen.homeLibrary.sidebars')
    _.set(currentConfig, 'homeScreen.homeLibrary.contentBundleIds', bundles);
    // set components options 'default groups' automaticlly 
    if (!_.isEmpty(currentBundles) && currentBundles.length > 0 && bundles.length === 0) {
        sideBarIcons = _.pull(sideBarIcons, iconTypes.defaultGroup.key)
    } else if ((_.isEmpty(currentBundles) || currentBundles.length === 0) && bundles.length > 0) {
        sideBarIcons = _.concat(sideBarIcons, iconTypes.defaultGroup.key)
    }
    _.set(currentConfig, 'homeScreen.homeLibrary.sidebars', sideBarIcons)
    console.log('handle bundle change');
    console.log(currentConfig);
    this.props.setCurrentConfig(currentConfig);
  }

  render() {
    return (
      <div className="home-screen-bundle-content-container">
        <ContentBundleList includedIds = {this.props.contentBundleIds} handleSelection = {this.handleSelection} handleDeletion = {this.handleBundleDelete} handleAdd = {this.handleBundleAdd} allowDelete={true}/>
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state),
  contentBundleIds: selectCurrentConfigContentBundleIds(state)
})

const connector = connect(mapState, {
  setCurrentConfig: Actions.setCurrentConfig
})

export default connector(HomeScreenContentBundles)