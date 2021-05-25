import * as React from 'react';
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigMainView.scss';
import { message } from 'antd';
import FileSaver from 'file-saver';
import { copyToClipboard } from '../../../utils/copy';
import { ReactWindowGrid } from '@mstr/rc';
import { SelectionStructure, Record } from '@mstr/rc/types';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { WorkstationModule, ObjectEditorSettings, EnvironmentChangeArg, WindowEvent, EnvironmentAction, EnvironmentStatus} from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectConfigList, selectContentBundleList } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/api';
import * as _ from "lodash";
import { hexIntToColorStr } from './HomeScreenUtils';
import DisconnectedPage from './disconnected-page';

declare var workstation: WorkstationModule;
class HomeScreenConfigMainView extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentEnv: {},
      isEnvReady: true
    }
  }

  async componentDidMount() {
    this.loadData();
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    this.setState({
      currentEnv: currentEnv,
      isEnvReady: currentEnv.status === EnvironmentStatus.Connected
    });
    workstation.environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
      console.log('enviornment change: ' + change.actionTaken);
      console.log('enviornment change: env name : ' + change.changedEnvironment.name);
      console.log('enviornment change: env status : ' + change.changedEnvironment.status);
      if (change.actionTaken === EnvironmentAction.ChangeEnvironmentSelection && change.changedEnvironment.url !== this.state.currentEnv.url) {
        this.setState({
          currentEnv: change.changedEnvironment,
          isEnvReady: change.changedEnvironment.status === EnvironmentStatus.Connected
        });
        if (change.changedEnvironment.status === EnvironmentStatus.Connected) {
          this.loadData();
        }
      }
      if (change.actionTaken === EnvironmentAction.Connect && change.changedEnvironment.url === this.state.currentEnv.url) {
        this.setState({
          isEnvReady: true
        });
        this.loadData();
      }
      if (change.actionTaken === EnvironmentAction.Disconnect && change.changedEnvironment.status === EnvironmentStatus.Disconnected && change.changedEnvironment.url === this.state.currentEnv.url) {
        this.setState({
          isEnvReady: false
        });
      }
    })

    workstation.window.addHandler(WindowEvent.POSTMESSAGE, (msg: any) => {
      console.log(msg);
      if(_.get(msg, 'Message.homeConfigSaveSuccess', '')){
        this.loadData();
      }
      return {
          ResponseValue: true
      };
    });
  }

  loadData = () => {
    api.loadConfigList();
    api.loadContentBundleList();
  }

  handleAddApplication = () => {
    this.openConfigEditor();
  }

  openConfigEditor = (objId : string = '') => {
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

  deleteConfig = (objId : string = '') => {
    if (objId) {
      HttpProxy.delete('/mstrClients/libraryApplications/configs/' + objId, {}).then((res: any) => {
        this.loadData();
      }).catch((e: any) => {
        const error = e as RestApiError;
        if (error.statusCode === 401) {
          workstation.environments.getCurrentEnvironment().then(currentEnv => {
            workstation.environments.disconnect(currentEnv.url);
            message.error('401 error and disconnect');
          });
        }
      });
    }
  }

  duplicateConfig = async (objId : string = '') => {
    if (objId) {
      HttpProxy.post('/mstrClients/libraryApplications/configs?sourceId=' + objId, {}).then((res: any) => {
        this.loadData();
      }).catch((e: any) => {
        const error = e as RestApiError;
        if (error.statusCode === 401) {
          workstation.environments.getCurrentEnvironment().then(currentEnv => {
            workstation.environments.disconnect(currentEnv.url);
            message.error('401 error and disconnect');
          });
        }
      });
    }
  }

  downloadJsonFile = async (configJson: JSON, configId: string) => {
    let blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(configJson)))],
        { type: 'application/json;charset=utf-8;' });
    FileSaver.saveAs(blob, configId + '.json');
  }

  generateConfigDisplayList = () => {
    const configList = this.props.configList.map((config: any) => {
      let resultConfig = _.cloneDeep(config);
      if (!_.has(resultConfig, 'platform')) {
        _.assign(resultConfig, {platform: 'Mobile'});
      } else {
        _.assign(resultConfig, {platform: resultConfig.platform.join(',')});
      }
      if (!_.has(resultConfig, 'contentBundleIds')) {
        _.assign(resultConfig, { contentBundles: []});
      } else {
        var arr = resultConfig.contentBundleIds.reduce(function(res: any, v: any) {
          return res.concat(_.filter(this.props.contentBundleList, function(o) { return o.id === v; }));
          }, []);
        _.assign(resultConfig, { contentBundles: arr });
      }

      _.assign(resultConfig, {mode: resultConfig.mode == 0 ? 'Library' : 'Dossier'});

      if (_.has(resultConfig, 'lastUpdate')) {
        _.assign(resultConfig, {lastUpdate: new Date(resultConfig.lastUpdate).toLocaleString()});
      }

      return resultConfig;
    });
    return configList;
  }

  render() {
    const configDisplayList = this.generateConfigDisplayList();
    const getContextMenuItems = (selection: SelectionStructure, contextMenuTarget: Record): ContextMenuItem[] => {
      const handleClickEdit = () => {
        this.openConfigEditor(contextMenuTarget.id);
      };
      const handleClickDelete = () => {
        this.deleteConfig(contextMenuTarget.id);
      };
      const handleClickDuplicate = () => {
        this.duplicateConfig(contextMenuTarget.id);
      };
      const handleClickCopyLink = async () => {
        try {
          const currentEnv = await workstation.environments.getCurrentEnvironment();
          const appLink = currentEnv.url + "app/config/" + contextMenuTarget.id;
          copyToClipboard(appLink);
          message.success('The application link has been successfully copied!');
        } catch (e) {
          message.error('Copy application link to clipboard fail: ' + e);
        }
      };
      const handleClickDownload = () => {
        const configId = contextMenuTarget.id;
        api.downloadSingleMobileConfig(configId).then(config => {
          this.downloadJsonFile(config, configId);
        }).catch((e) => {
          const error = e as RestApiError;
          if (error.statusCode === 401) {
            workstation.environments.getCurrentEnvironment().then(currentEnv => {
              workstation.environments.disconnect(currentEnv.url);
              message.error('401 error and disconnect');
            });
          }
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
        {
          "name": "Share",
          "subMenuItems":[{'title': 'Copy Link', "itemIndex": '0', 'action': handleClickCopyLink},
                          {'title': 'Download Json File', "itemIndex": '1', 'action': handleClickDownload}]
        }
      ];
    };
    return this.state.isEnvReady ? (
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
                      d.contentBundles.map(((bundle: {name: string, color: number}) => {
                        return (<span className='Config-List-Content-Bundle-Item'>
                          <span className='Config-List-Content-Bundle-Item-Icon' style={{ background: hexIntToColorStr(bundle.color) }}></span>
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
          rowData={configDisplayList}
          getContextMenuItems={getContextMenuItems}
          isColumnConfigurable={true}
        />
      </div>
    ) : (
      <DisconnectedPage />
    ) 
  }
}

const mapState = (state: RootState) => ({
  configList: selectConfigList(state),
  contentBundleList: selectContentBundleList(state)
})

const connector = connect(mapState, {
})

export default connector(HomeScreenConfigMainView)