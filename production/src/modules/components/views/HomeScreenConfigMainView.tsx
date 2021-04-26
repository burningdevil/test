import * as React from 'react';
import '../scss/HomeScreenConfigMainView.scss';
import { ReactWindowGrid, MSTRWSIcon } from '@mstr/rc';
import { SelectionStructure, Record } from '@mstr/rc/types';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { WorkstationModule, ObjectEditorSettings, EnvironmentChangeArg, WindowEvent} from '@mstr/workstation-types';
import HomeScreenConfigEditor from './HomeScreenConfigEditor';
import { HttpProxy } from '../../../main';
import * as _ from "lodash";


//TODO: remove when rest api to migrate to library user.
// import serverConfig from '../../../../build/server.config';
// const headers = {
//   Authorization: "Basic " + btoa(serverConfig.adminUser + ":" + serverConfig.adminPassword)
// }

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
    workstation.environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
      console.log('enviornment change');
      this.setState({
        currentEnv: change.changedEnvironment
      });
      this.loadData();
    })

    workstation.window.addHandler(WindowEvent.POSTMESSAGE, (message: any) => {
      console.log(message);
      if(_.get(message, 'Message.homeConfigSaveSuccess', '')){
        this.loadData();
      }
      return {
          ResponseValue: true
      };
  });
  }

  loadData = async () => {
    const response = await HttpProxy.get('/mstrClients/libraryApplications/configs').catch(e => (this.setState({
      configList: []
    })));
    let data = response;
    console.log(response);
    if (response.data) {
      console.log('success1');
      data = response.data;
    }
    const configList = data.map(config => {
      let resultConfig = config;
      if (!_.has(resultConfig, 'platform')) {
        _.assign(resultConfig, {platform: ['Mobile']});
      }
      if (!_.has(resultConfig, 'contentBundleIds')) {
        _.assign(resultConfig, {contentBundleIds: []});
      }
      _.assign(resultConfig, {mode: resultConfig.mode == 0 ? 'Library' : 'Dossier'});

      return resultConfig;
      // return {
      //   ...config,
      //   platform: 'Web',
      //   home: 'Dossier',
      //   components: 'xxx,yyy,zzz',
      //   contentBundles: 'aa,bb,bb'
      // }
    });
    this.setState({
      configList: configList
    });
  }

  openConfigEditor = (objId : string = '') => {
    console.log("Env: " + this.state.environmentURL);
    const objType = 'HomeScreenConfig';
    let options: ObjectEditorSettings = {
      objectType: objType,
      environment: this.state.currentEnv
    }
    if(objId) {
      options = _.merge(options, {objectId: objId});
    }
    workstation.dialogs.openObjectEditor(options).catch(e =>
      workstation.dialogs.error({
          message: 'Open object editor failed with error',
          additionalInformation: JSON.stringify(e)
      })
    )
  }

  deleteConfig = async (objId : string = '') => {
    if (objId) {
      await HttpProxy.delete('/mstrClients/libraryApplications/configs/' + objId, {}).catch(e => (console.log(e)));
    }
    this.loadData();
  }

  duplicateConfig = async (objId : string = '') => {
    if (objId) {
      await HttpProxy.post('/mstrClients/libraryApplications/configs?sourceId=' + objId, {}).catch(e => (console.log(e)));
    }
    this.loadData();
  }

  render() {
    const getContextMenuItems = (selection: SelectionStructure, contextMenuTarget: Record): ContextMenuItem[] => {
      const handleClickEdit = () => {
        console.log(selection);
        console.log(contextMenuTarget);
        this.openConfigEditor(contextMenuTarget.id);
      };
      const handleClickDelete = () => {
        this.deleteConfig(contextMenuTarget.id);
      };
      const handleClickDuplicate = () => {
        this.duplicateConfig(contextMenuTarget.id);
      };
      const handleClickMobileLink = () => {
        const a = 1;
      };

      const handleClickWebLink = () => {
        const a = 1;
      };
      
      const handleClickDownload = () => {
        const a = 1;
      };
      return [
        {
          "name": "Edit",
          "action": handleClickEdit,
        },
        {
          "name": "Delete",
          "action": handleClickDelete,
        },
        {
          "name": "Duplicate",
          "action": handleClickDuplicate,
        },
        {
          "name": "Copy Link",
          "subMenuItems":[{'title': 'Link for Mobile', "itemIndex": '0', 'action': handleClickMobileLink},
                          {'title': 'Link for Web and Desktop', "itemIndex": '1', 'action': handleClickWebLink}]
        },
        {
          "name": "Download Json File",
          "action": handleClickDownload
        }
      ];
    };
    return (
      <div>
        <div className="add-application-container">
          <MSTRWSIcon
            className="add-application-icon"
            type="msdl-add"
            onClick={this.openConfigEditor}
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
              field: 'mode',
              headerName: 'Home',
              width: '10%',
              sortable: true
            },
            {
              field: 'icons',
              headerName: 'Components',
              sortable: false,
              width: '30%'
            },
            {
              field: 'contentBundleIds',
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
          getContextMenuItems={getContextMenuItems}
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
