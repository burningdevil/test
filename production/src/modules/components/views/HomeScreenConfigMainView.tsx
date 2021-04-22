import * as React from 'react';
import '../scss/HomeScreenConfigMainView.scss';
import { ReactWindowGrid, MSTRWSIcon } from '@mstr/rc';
import { WorkstationModule, ObjectEditorSettings } from '@mstr/workstation-types';
import HomeScreenConfigEditor from './HomeScreenConfigEditor';
import { HttpProxy } from '../../../main';


//TODO: remove when rest api to migrate to library user.
import serverConfig from '../../../../build/server.config';
const headers = {
  Authorization: "Basic " + btoa(serverConfig.adminUser + ":" + serverConfig.adminPassword)
}

declare var workstation: WorkstationModule;

export default class HomeScreenConfigMainView extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      configList: [],
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
    const response = await HttpProxy.get('/admin/mstrClients/library/configs', headers);
    let data = response;
    if (response.data) {
      data = response.data;
    }
    const configList = data.map(config => {
      return {
        ...config,
        platform: 'Web',
        home: 'Dossier',
        components: 'xxx,yyy,zzz',
        contentBundles: 'aa,bb,bb'
      }
    });
    this.setState({
      configList: configList
    });
  }

  handleDismiss = (visible: boolean) => {
    // this.setState({
    //   configEditorVisible: visible
    // })
  }

  render() {
    return (
      <div>
        <div className="add-application-container">
          <MSTRWSIcon
            className="add-application-icon"
            type="msdl-add"
            onClick={() => {
              console.log("Env: " + this.state.environmentURL);
              const options: ObjectEditorSettings = {
                objectType: 'HomeScreenConfig',
                environment: this.state.currentEnv
              }
              workstation.dialogs.openObjectEditor(options).catch(e =>
                workstation.dialogs.error({
                    message: 'Open object editor failed with error',
                    additionalInformation: JSON.stringify(e)
                })
              )
            }}
          />
          <span className="story-icon-text">
            New Application
          </span>
        </div>
        <ReactWindowGrid
          columnDef={[
            {
              field: 'name',
              headerName: 'Name',
              sortable: true,
              width: '10%'
            },
            {
              field: 'platform',
              headerName: 'Platform',
              sortable: true,
              width: '10%'
            },
            {
              field: 'home',
              headerName: 'Home',
              width: '10%',
              sortable: true
            },
            {
              field: 'components',
              headerName: 'Components',
              sortable: false,
              width: '30%'
            },
            {
              field: 'contentBundles',
              headerName: 'Content Bundles',
              sortable: true,
              width: '30%'
            },
            {
              field: 'lastUpdate',
              headerName: 'Date Modified',
              sortable: true,
              width: '10%'
            }
          ]}
          rowData={this.state.configList}
          // getContextMenuItems={function noRefCheck(){}}
          isColumnConfigurable={true}
        />
        <HomeScreenConfigEditor
          visible={this.state.configEditorVisible}
          isEditConfig={this.state.isEditConfig}
          handleDismiss={this.handleDismiss}
        >
        </HomeScreenConfigEditor>
      </div>
    )
  }
}
