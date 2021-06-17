import * as React from 'react';
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigMainView.scss';
import { message, Menu, Dropdown } from 'antd';
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
import { default as VC, localizedStrings, platformType } from '../HomeScreenConfigConstant';


declare var workstation: WorkstationModule;
const classNamePrefix = 'home-screen-main';
const appRootPath = 'app';
const appRootPathWithConfig = 'app/config/';
const configSaveSuccessPath = 'Message.homeConfigSaveSuccess';

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
      if(_.get(msg, configSaveSuccessPath, '')){
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
    const objType = VC.CONFIG_EDITOR_OBJTYPE;
    let options: ObjectEditorSettings = {
      objectType: objType,
      environment: this.state.currentEnv
    }
    if(objId) {
      options = _.merge(options, {objectId: objId});
    }
    workstation.dialogs.openObjectEditor(options).catch(e =>
      workstation.dialogs.error({
          message: localizedStrings.ERR_EDITOR_OPEN,
          additionalInformation: JSON.stringify(e)
      })
    )
  }

  processErrorResponse = (e: any) => {
    const error = e as RestApiError;
    if (error.statusCode === 401) {
      workstation.environments.getCurrentEnvironment().then(currentEnv => {
        workstation.environments.disconnect(currentEnv.url);
        message.error(localizedStrings.ERR_SESSION_OUT);
      });
    }
  }

  deleteConfig = (objId : string = '') => {
    if (objId) {
      HttpProxy.delete(api.getApiPathForEditApplication(objId), {}).then((res: any) => {
        this.loadData();
      }).catch((e: any) => {
        this.processErrorResponse(e);
      });
    }
  }

  duplicateConfig = async (objId : string = '') => {
    if (objId) {
      HttpProxy.post(api.getApiPathForDuplicateApplication(objId), {}).then((res: any) => {
        this.loadData();
      }).catch((e: any) => {
        this.processErrorResponse(e);
      });
    }
  }

  downloadJsonFile = async (configJson: JSON, configId: string) => {
    var FileSaver = require('file-saver');
    let blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(configJson)))],
        { type: 'application/json;charset=utf-8;' });
    FileSaver.saveAs(blob, configId + VC.JSONFILE_SUFFIX);
  }

  renderShareContextMenu = (d: Record) => {
    const handleClickCopyLink = async () => {
      try {
        const currentEnv = await workstation.environments.getCurrentEnvironment();
        const appLink = d.default ? currentEnv.url + appRootPath : currentEnv.url + appRootPathWithConfig + d.id;
        copyToClipboard(appLink);
        message.success(localizedStrings.LINK_COPIED);
      } catch (e) {
        message.error(localizedStrings.ERR_LINK_COPY + e);
      }
    };
    const handleClickDownload = () => {
      const configId = d.id;
      api.downloadSingleConfig(configId).then(config => {
        this.downloadJsonFile(config, configId);
      }).catch((e) => {
        this.processErrorResponse(e);
      });
    };
    // const copyIcon = require('../images/copy.svg');
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={handleClickCopyLink}>
          <span className={`${classNamePrefix}-item-copy`}/>
          {localizedStrings.COPY_LINK}
        </Menu.Item>
        <Menu.Item key="1" onClick={handleClickDownload}>
          <span className={`${classNamePrefix}-item-json`}/>
          {localizedStrings.DOWNLOAD_JSON}
        </Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown className={classNames(classNamePrefix, 'application-share-menu-container')} overlay={menu} trigger={['click']}>
        <span className={VC.FONT_SHARE}/>
      </Dropdown>
    );
  };

  generateConfigDisplayList = () => {
    const THIS = this;
    const configList = this.props.configList.map((config: any) => {
      let resultConfig = _.cloneDeep(config);
      if (!_.has(resultConfig, VC.PLATFORM)) {
        _.assign(resultConfig, {platform: platformType.mobile});
      } else {
        _.assign(resultConfig, {platform: resultConfig.platform.join(', ')});
      }
      if (!_.has(resultConfig, VC.CONTENT_BUNDLE_IDS)) {
        _.assign(resultConfig, { contentBundles: []});
      } else {
        var arr = resultConfig.contentBundleIds.reduce(function(res: any, v: any) {
          return res.concat(_.filter(THIS.props.contentBundleList, function(o) { return o.id === v; }));
          }, []);
        _.assign(resultConfig, { contentBundles: arr });
      }

      _.assign(resultConfig, {mode: resultConfig.mode == 0 ? localizedStrings.LIBRARY : localizedStrings.DOSSIER});

      if (_.has(resultConfig, VC.LAST_UPDATE)) {
        _.assign(resultConfig, {lastUpdate: new Date(resultConfig.lastUpdate).toLocaleString()});
        //TODO: use dateCreated property
        _.assign(resultConfig, {dateCreated: new Date(resultConfig.lastUpdate).toLocaleString()});
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
          'name': localizedStrings.EDIT,
          'action': handleClickEdit,
        },
        {
          'name': localizedStrings.DELETE,
          'action': handleClickDelete,
        },
        {
          'name': localizedStrings.DUPLICATE,
          'action': handleClickDuplicate,
        }
      ];
    };

    return this.state.isEnvReady ? (
      <div className={`${classNamePrefix}`}>
        <div className={`${classNamePrefix}-new-application-container`}>
          <span tabIndex={0} aria-label={localizedStrings.NEW_APP_BTN_TEXT} className={VC.FONT_ADD_NEW} onClick={this.handleAddApplication}/>
          <span>
            {localizedStrings.NEW_APP_TEXT}
          </span>
        </div>
        <div className={`${classNamePrefix}-application-list-container`}>
          <ReactWindowGrid
            columnDef={[
              {
                field: VC.NAME,
                headerName: localizedStrings.NAME,
                sortable: true,
                width: '20%',
                render: (d: Record) => {
                  return (
                    <div className={`${classNamePrefix}-application-name-container`}>
                      <span className={`${classNamePrefix}-application-name-text`}>{d.name}</span>
                      {this.renderShareContextMenu(d)}
                    </div>
                  )
                },
              },
              {
                field: VC.DESC,
                headerName: localizedStrings.DESCRIPTION,
                sortable: true,
                width: '15%',
                showColumn: false,
              },
              {
                field: VC.PLATFORM,
                headerName: localizedStrings.PLATFORM,
                sortable: true,
                width: '10%'
              },
              {
                field: VC.MODE,
                headerName: localizedStrings.HOME,
                width: '10%',
                sortable: true
              },
              {
                field: VC.CONTENT_BUNDLES,
                headerName: localizedStrings.NAVBAR_CONTENT_BUNDLES,
                sortable: false,
                width: '30%',
                render: (d: Record) => {
                  if (d.contentBundles.length === 0) {
                    return (
                      <div className={`${classNamePrefix}-content-bundles`}>
                        <span>{localizedStrings.BUNDLE_USER_HINT}</span>
                      </div>
                    )
                  }
                  return (
                    <div className={`${classNamePrefix}-content-bundles`}>
                      {
                        d.contentBundles.map(((bundle: {name: string, color: number}) => {
                          return (<span className={`${classNamePrefix}-content-bundles-item`}>
                            <span className={`${classNamePrefix}-content-bundles-item-icon`} style={{ background: hexIntToColorStr(bundle.color) }}></span>
                            <span className={`${classNamePrefix}-content-bundles-item-text`}>{bundle.name}</span>
                          </span>)
                        }))
                      }
                    </div>
                  )
                },
              },
              {
                field: VC.LAST_UPDATE,
                headerName: localizedStrings.DATE_MODIFIED,
                sortable: true,
                width: '15%',
              },
              {
                field: VC.DATE_CREATED,
                headerName: localizedStrings.DATE_CREATED,
                sortable: true,
                width: '15%',
                showColumn: false
              }
            ]}
            rowData={configDisplayList}
            getContextMenuItems={getContextMenuItems}
            isColumnConfigurable={true}
          />
        </div>
      </div>
    ) : (!this.state.isConnected ? <DisconnectedPage/> :
          (!this.state.isLibraryVersionMatched ? <ServerIncompatiblePage needUpgradeLibraryServer={true} needIServerUpgrade={false} needUpgradeMD={false}/> : 
            (!this.state.isIServerVersionMatched ? <ServerIncompatiblePage needUpgradeLibraryServer={false} needIServerUpgrade={true} needUpgradeMD={false}/> : 
              (!this.state.isMDVersionMatched ? <ServerIncompatiblePage needUpgradeLibraryServer={false} needIServerUpgrade={false} needUpgradeMD={true} /> : <NoAccessPage />)))
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