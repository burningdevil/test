import * as React from 'react';
import '../scss/HomeScreenContentBundles.scss';
import * as _ from "lodash";
import { ReactWindowGrid, MSTRWSIcon, SearchInput } from '@mstr/rc';
import { WorkstationModule, ObjectEditorSettings } from '@mstr/workstation-types';
import { HttpProxy, env } from '../../../main';

declare var workstation: WorkstationModule;

export default class HomeScreenContentBundles extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      contentsList: []
    }
  }

  async componentDidMount() {
    this.loadData();
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    console.log("Env: " + currentEnv);
    this.setState({
      currentEnv: currentEnv
    });
    
  }

  loadData = async () => {
    // const response = await HttpProxy.get('/contentBundles');
    // const bundlesList = this.constructBundleList(response);
    const contentsList = {
      "DED77D324ED01C5DC719AB884D1756C3":[
          {
              "id": "46A61F2345F765F0836036B63240A0B9",
              "name": "dname1",
              "projectId": "DED77D324ED01C5DC719AB884D1756C3",
              "type": 55,
              "viewMedia": 1879072805,
              "modifiedTime": "2021-01-07T07:13:59.000Z",
              "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
              "isCertified": true,
              "acg":255
          },
          {
              "id": "46A61F2345F765F0836036B63240A0BA",
              "projectId": "DED77D324ED01C5DC719AB884D1756C3",
              "name": "dname2",
              "type": 55,
              "viewMedia": 1879072805,
              "modifiedTime": "2021-01-07T09:13:59.000Z",
              "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
              "isCertified": false,
              "acg":255
          },
          {
            "id": "46A61F2345F765F0836036B63240A0B9",
            "name": "dname3",
            "projectId": "DED77D324ED01C5DC719AB884D1756C3",
            "type": 55,
            "viewMedia": 1879072805,
            "modifiedTime": "2021-01-07T07:13:59.000Z",
            "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
            "isCertified": true,
            "acg":255
          },
          {
            "id": "46A61F2345F765F0836036B63240A0B9",
            "name": "dname4",
            "projectId": "DED77D324ED01C5DC719AB884D1756C3",
            "type": 55,
            "viewMedia": 1879072805,
            "modifiedTime": "2021-01-07T07:13:59.000Z",
            "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
            "isCertified": true,
            "acg":255
          },
          {
            "id": "46A61F2345F765F0836036B63240A0B9",
            "name": "dname5",
            "projectId": "DED77D324ED01C5DC719AB884D1756C3",
            "type": 55,
            "viewMedia": 1879072805,
            "modifiedTime": "2021-01-07T07:13:59.000Z",
            "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
            "isCertified": true,
            "acg":255
        }
      ]
    };
    var contents = [{}];
    Object.entries(contentsList).forEach(
      ([key, value]) => _.merge(contents, value)
    );
    contents = contents.map(bundle => ({"index": bundle.id, "name":<div style={{display: 'flex'}}><MSTRWSIcon type="msdl-dossier" style={{padding: '5px', color: "#ffff00"}} />{bundle.name}</div>, "certified": bundle.isCertified ? 1: 0, "owner": bundle.owner.name, "type": bundle.type, "dateModified": bundle.modifiedTime}))
    this.setState({
      contentsList: contents
    });
  }

  // constructBundleList = (response: Array) => {
  //   const bundlesList = response;
  //   return bundlesList;
  // }

  handleSearch = (value: string) => {
    this.setState({
      contentsList: []
    });
  }

  handleAddContent = async () => {
    console.log("Env: " + this.state.environmentURL);           
    const options: ObjectEditorSettings = {
      objectType: 'HomeConfigContentBundle',
      environment: this.state.currentEnv
    }
    workstation.dialogs.openObjectEditor(options).catch(e =>
      workstation.dialogs.error({
          message: 'Open object editor failed with error',
          additionalInformation: JSON.stringify(e)
      })
    )
  }

  render() {
    return (
      <div className="home-screen-bundle-content-container">
        <div className="home-screen-add-content-container">
          <SearchInput className="home-screen-content-search-container"
              onChange={(value: string) => {
                this.handleSearch(value);
              }}/>
          <MSTRWSIcon
            className="home-screen-add-content-icon"
            type="msdl-add"
            onClick={() => {
              this.handleAddContent();
            }}
          />
          <span className="home-screen-add-content-text">
            Add Content
          </span>
        </div>
        <ReactWindowGrid
          columnDef={[
            {
              field: 'name',
              headerName: 'Content',
              sortable: false,
              width: '65%'
            },
            {
              field: 'type',
              headerName: 'Type',
              width: '35%',
              sortable: true
            }
          ]}
          rowData={this.state.contentsList}
          isColumnConfigurable={false}
          rowSelectable
        />
      </div>
    )
  }
}
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
