import * as React from 'react';
import '../scss/HomeScreenObjectList.scss';
import * as _ from "lodash";
import { ReactWindowGrid, SearchInput, Spinner, Record } from '@mstr/rc';
import { WorkstationModule } from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { Button } from 'antd';
import { objectCountInBatch, navBar } from './HomeScreenObjectPicker'

declare var workstation: WorkstationModule;

const EnumDSSXMLViewMedia = {
  DssXmlViewMediaViewStatic: 0x00000001,
  DssXmlViewMediaViewAnalysis: 0x00000800,
  DssXmlViewMediaHTML5Dashboard: 0x00002000
};

export default class HomeScreenObjectList extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      offset: 0,
      objectList: [],
      loadingData: true
    }
  }

  componentWillReceiveProps(nextProps:{}) {
    this.processObjectList(_.get(nextProps, 'objectList', []));
  }

  processObjectList(currentList:[]) {
    let modifiedList = currentList;
    //filter based on type
    modifiedList = currentList.filter(info => {
      return this.getObjectType(info.viewMedia) == this.props.objectType;
    });
    //construct owner and certified
    modifiedList = modifiedList.map((info) => {
      let resultInfo = info;
      _.assign(resultInfo, {ownerName: info.owner.name, certified: info.certifiedInfo.certified});

      return resultInfo;
    });
    
    this.setState({objectList: modifiedList, offset: currentList.length, loadingData: currentList.length == 0});
  }

  getObjectType(viewMedia: number) {
    const defModePosition = viewMedia >> 27;
    let defaultViewMedia;
    if (defModePosition == 0) {
        defaultViewMedia = 0;
    }

    defaultViewMedia = EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << defModePosition - 1;
    if (defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis || defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard) {
        return navBar.DOSSIER;
    } else {
        return navBar.DOCUMENT;
    }
}

  loadData = async () => {
    const response = await HttpProxy.get('/searches/results?pattern=4&type=14081&getAncestors=false&offset=' + this.state.offset + '&limit=' + objectCountInBatch + '&certifiedStatus=ALL');
    let data = response;
    if (response.data) {
      data = response.data;
    }
    if (data && data.result) {
      this.props.handleChange(data.result);
    }
    this.setState({
      loadingData: false
    });
    console.log(data);
  }

  handleSearch = (value: string) => {
    this.setState({
      contentsList: []
    });
  }

  handleShowMore = async () => {
    this.setState({
      loadingData: true
    });
    this.loadData();
  }

  handleSelectObject = (event: MouseEvent, record: {}) => {
    console.log(event);
    console.log(record);
    this.props.handleSelectedObjectChange(record);
  }

  renderLoadingIcon = () => {
    return (
      <Spinner className="object-list-loading-more" text = {"Loading"}/>);
  }

  render() {
    return (
      <div className="object-list-content-container">
        <div className="object-list-head-content-container">
          <SearchInput className="object-list-search-container"
              onChange={(value: string) => {
                this.handleSearch(value);
              }}/>
          <Button type='link' className = "object-list-show-more" disabled = {this.state.offset >= this.props.totalCount} onClick={this.handleShowMore}>
            Show More
          </Button>
        </div>
      
       <ReactWindowGrid className="object-list-grid"
          columnDef={[
            {
              field: 'name',
              headerName: 'Name',
              sortable: true
            },
            {
              field: 'certified',
              headerName: 'Certified',
              sortable: true
            },
            {
              field: 'ownerName',
              headerName: 'Owner',
              sortable: true
            },
            {
              field: 'dateModified',
              headerName: 'Date Modified',
              sortable: true
            },
            {
              field: 'projectId',
              headerName: 'Application',
              width: '20%',
              sortable: true
            }
          ]}
          rowData={this.state.objectList}
          isColumnConfigurable={false}
          onRowClick={this.handleSelectObject}
        />
        {this.state.loadingData && this.renderLoadingIcon()}
      </div>
    )
  }
}

//   <div className="object-list-head-content-container">
      //     <SearchInput className="object-list-search-container"
      //         onChange={(value: string) => {
      //           this.handleSearch(value);
      //         }}/>
      //     <div className="object-list-show-more">
      //       Show More
      //     </div>
      //   </div>
// import * as React from 'react'
// import { EnvironmentChangeArg } from '@mstr/workstation-types'
// import './Module1.scss'
// import environment, { EVENTS } from '../env/WSEvents'
// import { env } from '../main'

// export default class Module1 extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props)
//     this.state = {}
//   }

//   componentDidMount() {
//     environment.subscribe({
//       [EVENTS.ON_DISCONNECTED]:
//       (info) => this.onEnvChange(info, EVENTS.ON_DISCONNECTED)
//     })
//     environment.subscribe({
//       [EVENTS.ON_CONNECTED]:
//       (info) => this.onEnvChange(info, EVENTS.ON_CONNECTED)
//     })
//     this.loadData()
//   }

//   loadData = async () => {
//     const selecedObject = await env.selectedObject.getSelectedObject()
//     const curEnv = await env.environments.getCurrentEnvironment()
//     this.setState({
//       object: selecedObject.name,
//       curEnv: curEnv.name
//     })
//   }

//   onEnvChange = (info: EnvironmentChangeArg, event: string) => {
//     console.log(event, info)
//   }

//   render() {
//     const { object, curEnv } = this.state
//     return (
//       <div>
//         <div className='module1-welcome'>Plugin Module 1</div>
//         <div>{`Selected Object - ${object}`}</div>
//         <div>{`Current Environmet - ${curEnv}`}</div>
//       </div>
//     )
//   }
// }
