import * as React from 'react';
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigMainView.scss';
import { message, Menu, Dropdown } from 'antd';
import FileSaver from 'file-saver';
import { copyToClipboard } from '../../../utils/copy';
import { ReactWindowGrid } from '@mstr/rc';
import { SelectionStructure, Record } from '@mstr/rc/types';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { WorkstationModule, ObjectEditorSettings, EnvironmentChangeArg, WindowEvent, EnvironmentAction, EnvironmentStatus, Environment} from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectConfigList, selectContentBundleList } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/api';
import * as _ from "lodash";
import { hexIntToColorStr } from './HomeScreenUtils';
import DisconnectedPage from './error-pages/DisconnectedPage';
import ServerIncompatiblePage from './error-pages/ServerIncompatiblePage';
import NoAccessPage from './error-pages/NoAccessPage';
import { isLibraryServerVersionMatch, isIServerVersionMatch, isUserHasManageApplicationPrivilege, DEFAULT_CONFIG_ID } from '../../../utils';
import classNames from 'classnames';
import { t } from '../../../i18n/i18next'


declare var workstation: WorkstationModule;
const prefixMainCls = 'home-screen-main';
class HomeScreenConfigMainView extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentEnv: {},
      isEnvReady: true,
      isConnected: true,
      isLibraryVersionMatched: true,
      isIServerVersionMatched: true,
      isMDVersionMatched: true,
      isUserHasAccess: true
    }
  }

  async componentDidMount() {
    this.loadData();
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    this.checkServerAndUserPrivilege(currentEnv);

    workstation.environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
      console.log('enviornment change: ' + change.actionTaken);
      console.log('enviornment change: env name : ' + change.changedEnvironment.name);
      console.log('enviornment change: env status : ' + change.changedEnvironment.status);
      if (change.actionTaken === EnvironmentAction.ChangeEnvironmentSelection && change.changedEnvironment.url !== this.state.currentEnv.url) {
        if (change.changedEnvironment.status === EnvironmentStatus.Connected) {
          this.loadData();
        }
        this.checkServerAndUserPrivilege(change.changedEnvironment);
      }
      if (change.actionTaken === EnvironmentAction.Connect && change.changedEnvironment.url === this.state.currentEnv.url) {
        this.setState({
          isEnvReady: true
        });
        this.loadData();
      }
      if (change.actionTaken === EnvironmentAction.Disconnect && change.changedEnvironment.status === EnvironmentStatus.Disconnected && change.changedEnvironment.url === this.state.currentEnv.url) {
        this.setState({
          isEnvReady: false,
          isConnected: false
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

  checkServerAndUserPrivilege = async (env: Environment) => {
    const status: any = await api.getServerStatus();
    console.log('server status: ' + JSON.stringify(status));
    const isMDVersionMatched = await this.loadDefaultConfig();
    const isConnected = env.status === EnvironmentStatus.Connected;
    const isLibraryVersionMatched = isLibraryServerVersionMatch(status.webVersion);
    const isIServerVersionMatched = isIServerVersionMatch(status.iServerVersion);
    const isUserHasAccess = isUserHasManageApplicationPrivilege(env.privileges);
    this.setState({
      currentEnv: env,
      isConnected: isConnected,
      isLibraryVersionMatched: isLibraryVersionMatched,
      isIServerVersionMatched: isIServerVersionMatched,
      isMDVersionMatched: isMDVersionMatched,
      isUserHasAccess: isUserHasAccess,
      isEnvReady: isConnected && isLibraryVersionMatched && isIServerVersionMatched && isMDVersionMatched && isUserHasAccess
    });
  }

  loadDefaultConfig = async () => {
    return true;
    // TOBE Enabled.
    // let hasDefault = true;
    // await HttpProxy.get('/mstrClients/libraryApplications/configs/' + DEFAULT_CONFIG_ID).catch(() => { hasDefault = false });
    // return hasDefault;
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

  renderShareContextMenu = (d: Record) => {
    const handleClickCopyLink = async () => {
      try {
        const currentEnv = await workstation.environments.getCurrentEnvironment();
        const appLink = d.isDefault ? currentEnv.url + "app" : currentEnv.url + "app/config/" + d.id;
        copyToClipboard(appLink);
        message.success('The application link has been successfully copied!');
      } catch (e) {
        message.error('Copy application link to clipboard fail: ' + e);
      }
    };
    const handleClickDownload = () => {
      const configId = d.id;
      api.downloadSingleConfig(configId).then(config => {
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

    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={handleClickCopyLink}>
          {t('copyLink')} 
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="1" onClick={handleClickDownload}>
          {t('downloadJson')}
        </Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown className={classNames(prefixMainCls, "application-share-menu-container")} overlay={menu} trigger={['click']}>
        <span className="icon-tb_share_n"/>
      </Dropdown>
    );
  };

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

      return [
        {
          "name": t('edit'),
          "action": handleClickEdit,
        },
        {
          "name": t('delete'),
          "action": handleClickDelete,
        },
        {
          "name": t('duplicate'),
          "action": handleClickDuplicate,
        }
      ];
    };

    return this.state.isEnvReady ? (
      <div className={prefixMainCls}>
        <div className={classNames(prefixMainCls, "new-application-container")}>
          <span tabIndex={0} aria-label={t('newApplicationBtn')} className={classNames(prefixMainCls, "icon-pnl_add-new")} onClick={this.handleAddApplication}/>
          <span>
            {t('newApplication')}
          </span>
        </div>
        <ReactWindowGrid
          columnDef={[
            {
              field: 'name',
              headerName: 'Name',
              sortable: true,
              width: '10%',
              render: (d: Record) => {
                return (
                  <div className='Application-Name-Container'>
                    <span className='Application-Name-Text'>{d.name}</span>
                    {this.renderShareContextMenu(d)}
                  </div>
                )
              },
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
                      <span>{t('bundleUserHint')}</span>
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
    ) : (!this.state.isConnected ? <DisconnectedPage/> :
          (!this.state.isLibraryVersionMatched ? <ServerIncompatiblePage needUpgradeLibraryServer={true}/> : 
            (!this.state.isIServerVersionMatched ? <ServerIncompatiblePage needIServerUpgrade={true}/> : 
              (!this.state.isMDVersionMatched ? <ServerIncompatiblePage needUpgradeMD={true}/> : <NoAccessPage />)))
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