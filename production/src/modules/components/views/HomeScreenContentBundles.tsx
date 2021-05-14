import * as React from 'react';
import '../scss/HomeScreenContentBundles.scss';
import * as _ from "lodash";
import { WorkstationModule, WindowEvent } from '@mstr/workstation-types';
import ContentBundleList from './ContentBundleList';

declare var workstation: WorkstationModule;

export default class HomeScreenContentBundles extends React.Component<any, any> {
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

  handleBundleDelete= (deleted:[]) => {
    const currentIds = this.props.contentBundleIds;
    const deletedIds = deleted.map(bundle => (bundle.id));
    const newIds = _.difference(currentIds, deletedIds);
    this.props.handleChange(newIds);
  }

  handleBundleAdd= (added:[]) => {
    const currentIds = this.props.contentBundleIds;
    const addedIds = added.map(bundle => (bundle.id));
    const newIds = _.concat(currentIds || [], addedIds);
    this.props.handleChange(newIds);
  }

  render() {
    return (
      <div className="home-screen-bundle-content-container">
        <ContentBundleList includedIds = {this.props.contentBundleIds} handleSelection = {this.handleSelection} handleDeletion = {this.handleBundleDelete} handleAdd = {this.handleBundleAdd} allowDelete={true}/>
      </div>
    )
  }
}
