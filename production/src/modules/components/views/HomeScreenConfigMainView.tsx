import * as React from 'react';
import '../scss/HomeScreenConfigMainView.scss';
import { message } from 'antd';
import FileSaver from 'file-saver';
import { copyToClipboard } from '../../../utils/copy';
import { ReactWindowGrid } from '@mstr/rc';
import { SelectionStructure, Record } from '@mstr/rc/types';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { WorkstationModule, ObjectEditorSettings, EnvironmentChangeArg, WindowEvent} from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import * as api from '../../../services/api';
import * as _ from "lodash";

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
    if (response.data) {
      data = response.data;
    }
    const configList = data.map((config: any) => {
      let resultConfig = config;
      if (!_.has(resultConfig, 'platform')) {
        _.assign(resultConfig, {platform: 'Mobile'});
      } else {
        _.assign(resultConfig, {platform: resultConfig.platform.join(',')});
      }
      if (!_.has(resultConfig, 'contentBundleIds')) {
        _.assign(resultConfig, { contentBundles: []});
      } else {
        const mockContentBundles = [{
          id:'0C9E5B884608E5B1C2134B88A184062A',
          color: '#7565C0',
          name: 'CT-Clients-FrameWork'
        },
        {
          id: '14D70C8D48AFE28F03446E8AFC3C2313',
          color: '#176AFF',
          name: 'Hiring Plan'
        },
        {
          id: '1E63CC394EF298FD7C4EBD8F449FAFF6',
          color: '#B464E7',
          name: 'HR-Team'
        },
        {
          id: '1E63CC394EF298FD7C4EBD8F449FAFF6',
          color: '#176AFF',
          name: 'Budget and Operation'
        },
        {
          id: '1E63CC394EF298FD7C4EBD8F449FAFF6',
          color: '#7565C0',
          name: 'Applications'
        },
        {
          id: '1E63CC394EF298FD7C4EBD8F449FAFF6',
          color: '#B464E7',
          name: 'Spike'
        }];
        _.assign(resultConfig, { contentBundles: resultConfig.contentBundleIds.map((bundleId: string) => {
          return mockContentBundles[Math.ceil(Math.random() * 6) % 6];
        }) });
      }
      _.assign(resultConfig, {mode: resultConfig.mode == 0 ? 'Library' : 'Dossier'});

      if (_.has(resultConfig, 'lastUpdate')) {
        _.assign(resultConfig, {lastUpdate: new Date(resultConfig.lastUpdate).toLocaleString()});
      }

      return resultConfig;
    });
    this.setState({
      configList: configList
    });
  }

  handleAddApplication = () => {
    this.openConfigEditor();
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
      await HttpProxy.delete('/mstrClients/libraryApplications/configs/' + objId, {}).catch((e: any) => (console.log(e)));
    }
    this.loadData();
  }

  duplicateConfig = async (objId : string = '') => {
    if (objId) {
      await HttpProxy.post('/mstrClients/libraryApplications/configs?sourceId=' + objId, {}).catch((e: any) => (console.log(e)));
    }
    this.loadData();
  }

  downloadJsonFile = async (configJson: JSON, configId: string) => {
    let blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(configJson)))],
        { type: 'application/json;charset=utf-8;' });
    FileSaver.saveAs(blob, configId + '.json');
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
      const handleClickMobileLink = async () => {
        try {
          const currentEnv = await workstation.environments.getCurrentEnvironment();
          const mobileLink = currentEnv.url + "config/" + contextMenuTarget.id;
          copyToClipboard(mobileLink);
          message.success('copy application url to clipboard successfully!');
        } catch (e) {
          message.error('copy application url to clipboard fail: ' + e);
        }
      };

      const handleClickWebLink = async () => {
        try {
          const currentEnv = await workstation.environments.getCurrentEnvironment();
          const webLink = currentEnv.url + "config/" + contextMenuTarget.id;
          copyToClipboard(webLink);
          message.success('copy application url to clipboard successfully!');
        } catch (e) {
          message.error('copy application url to clipboard fail: ' + e);
        }
      };
      
      const handleClickDownload = () => {
        const configId = contextMenuTarget.id;
        api.downloadSingleMobileConfig(configId).then(config => {
          this.downloadJsonFile(config, configId);
        }).catch(() => {
          message.error('download application config json file fail.');
        });
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
        // {
        //   "name": "Copy Link",
        //   "subMenuItems":[{'title': 'Link for Mobile', "itemIndex": '0', 'action': handleClickMobileLink},
        //                   {'title': 'Link for Web and Desktop', "itemIndex": '1', 'action': handleClickWebLink}]
        // },
        {
          "name": "Download Json File",
          "action": handleClickDownload
        },
        {
          "name": 'Link for Mobile', 
          'action': handleClickMobileLink
        },
        {
          "name": 'Link for Web and Desktop', 
          'action': handleClickWebLink
        }
      ];
    };
    return (
      <div className="home-screen-main-container">
        <div className="add-application-container">
          <span className= "icon-pnl_add-new" onClick={this.handleAddApplication}/>
          <span className="add-application-icon-text">
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
              field: 'contentBundles',
              headerName: 'Content Bundles',
              sortable: true,
              width: '30%',
              render: (d: Record) => {
                if (d.contentBundles.length === 0) {
                  return (
                    <div className='Config-List-Content-Bundles'>
                      <span>All bundles users have access to will appear in the app.</span>
                    </div>
                  )
                }
                return (
                  <div className='Config-List-Content-Bundles'>
                    {
                      d.contentBundles.map(((bundle: {name: string, color: string}) => {
                        return (<span className='Config-List-Content-Bundle-Item'>
                          <span className='Config-List-Content-Bundle-Item-Icon' style={{background: bundle.color}}></span>
                          <span className='Config-List-Content-Bundle-Item-Text'>{bundle.name}</span>
                        </span>)
                      }))
                    }
                  </div>
                )
              },
            },
            {
              field: 'lastUpdate',
              headerName: 'Date Modified',
              sortable: true,
              width: '15%'
            }
          ]}
          rowData={this.state.configList}
          getContextMenuItems={getContextMenuItems}
          isColumnConfigurable={true}
        />
       </div>
    )
  }
}
