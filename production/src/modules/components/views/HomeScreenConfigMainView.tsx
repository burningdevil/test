import * as React from 'react';
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigMainView.scss';
import { message, Menu, Dropdown } from 'antd';
import { copyToClipboard } from '../../../utils/copy';
import { ReactWsGrid, ColumnDef } from '@mstr/react-ws-grid';
import type { CellContextMenuEvent } from 'ag-grid-community/';
import { Record } from '@mstr/rc/types';
import { WorkstationModule, ObjectEditorSettings, EnvironmentChangeArg, WindowEvent, EnvironmentAction, EnvironmentStatus, Environment, PropertiesSettings, MstrObject, Project} from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectConfigList, selectContentBundleList, selectIsConfigLoading } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/Api';
import * as _ from "lodash";
import { hexIntToColorStr } from './HomeScreenUtils';
import DisconnectedPage from './error-pages/DisconnectedPage';
import ServerIncompatiblePage from './error-pages/ServerIncompatiblePage';
import NoAccessPage from './error-pages/NoAccessPage';
import { isLibraryServerVersionMatch, isIServerVersionMatch, isUserHasManageApplicationPrivilege, DEFAULT_CONFIG_ID } from '../../../utils';
import classNames from 'classnames';
import { default as VC, localizedStrings, platformType, APPLICATION_OBJECT_TYPE, APPLICATION_OBJECT_SUBTYPE } from '../HomeScreenConfigConstant';


declare var workstation: WorkstationModule;
const classNamePrefix = 'home-screen-main';
const appRootPath = 'app';
const appRootPathWithConfig = 'app/config/';
const customAppPath = 'CustomApp?webLink=';
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
      isUserHasAccess: true,
      isInitialLoading: true
    }
  }

  async componentDidMount() {
    this.loadData();
    this.checkServerAndUserPrivilege();

    workstation.environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
      console.log('enviornment change: ' + change.actionTaken);
      console.log('enviornment change: env name : ' + change.changedEnvironment.name);
      console.log('enviornment change: env status : ' + change.changedEnvironment.status);
      if (change.actionTaken === EnvironmentAction.ChangeEnvironmentSelection && change.changedEnvironment.status === EnvironmentStatus.Connected) {
        this.setState({
          isInitialLoading: true
        });
        this.loadData();
        this.checkServerAndUserPrivilege();
      }
      if (change.actionTaken === EnvironmentAction.Disconnect && change.changedEnvironment.status === EnvironmentStatus.Disconnected && change.changedEnvironment.url === this.state.currentEnv.url) {
        this.setState({
          isEnvReady: false,
          isConnected: false
        });
      }
    })

    workstation.window.addHandler(WindowEvent.POSTMESSAGE, (msg: any) => {
      if(_.get(msg, configSaveSuccessPath, '')){
        this.setState({
          isInitialLoading: false
        });
        this.loadData();
      }
      return {
          ResponseValue: true
      };
    });
  }

  checkServerAndUserPrivilege = async () => {
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    const status: any = await api.getServerStatus();
    const isMDVersionMatched = await this.loadDefaultConfig();
    const isConnected = currentEnv.status === EnvironmentStatus.Connected;
    const isLibraryVersionMatched = isLibraryServerVersionMatch(status.webVersion);
    const isIServerVersionMatched = isIServerVersionMatch(status.iServerVersion);
    const isUserHasAccess = isUserHasManageApplicationPrivilege(currentEnv.privileges);
    this.setState({
      currentEnv: currentEnv,
      isConnected: isConnected,
      isLibraryVersionMatched: isLibraryVersionMatched,
      isIServerVersionMatched: isIServerVersionMatched,
      isMDVersionMatched: isMDVersionMatched,
      isUserHasAccess: isUserHasAccess,
      isEnvReady: isConnected && isLibraryVersionMatched && isIServerVersionMatched && isMDVersionMatched && isUserHasAccess
    });
  }

  loadDefaultConfig = async () => {
    let hasDefault = true;
    await HttpProxy.get('/v2/applications/' + DEFAULT_CONFIG_ID).catch(() => {
      hasDefault = false
    });
    return hasDefault;
  }

  loadData = () => {
    api.loadConfigList();
    api.loadContentBundleList();
  }

  handleAddApplication = () => {
    this.openConfigEditor();
  }

  openConfigEditor = (objId : string = '', isDuplicate: boolean = false) => {
    const objType = VC.CONFIG_EDITOR_OBJTYPE;
    const configInfoList = this.props.configList.map((config: any) => {
      return {
        id: config.id,
        name: config.name
      };
    });
    const extraContext = {
      configInfoList: configInfoList,
      isDuplicate: isDuplicate
    }
    let options: ObjectEditorSettings = {
      objectType: objType,
      environment: this.state.currentEnv,
      extraContext: JSON.stringify(extraContext)
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
      HttpProxy.delete(api.getApiPathForDeleteApplication(objId), {}).then((res: any) => {
        this.setState({
          isInitialLoading: false
        });
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
        const appLink = d.isDefault ? currentEnv.url + customAppPath + encodeURIComponent(currentEnv.url + appRootPath) : currentEnv.url + customAppPath + encodeURIComponent(currentEnv.url + appRootPathWithConfig + d.id);
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
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={handleClickCopyLink}>
          <span className={`${classNamePrefix}-item-copy`}/>
          {localizedStrings.COPY_LINK}
        </Menu.Item>
        {/* <Menu.Item key="1" onClick={handleClickDownload}>
          <span className={`${classNamePrefix}-item-json`}/>
          {localizedStrings.DOWNLOAD_JSON}
        </Menu.Item> */}
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
        _.assign(resultConfig, {platformstr: _.capitalize(platformType.web)});
      } else {
        _.assign(resultConfig, {platformstr: resultConfig.platforms.map((o: string)=>_.capitalize(o)).join(', ')});
      }
      if (!_.has(resultConfig, [VC.HOME_SCREEN, VC.HOME_LIBRARY, VC.CONTENT_BUNDLE_IDS])) {
        _.assign(resultConfig, { contentBundles: []});
      } else {
        var arr = resultConfig.homeScreen.homeLibrary.contentBundleIds.reduce(function(res: any, v: any) {
          return res.concat(_.filter(THIS.props.contentBundleList, function(o) { return o.id === v; }));
          }, []);
        _.assign(resultConfig, { contentBundles: arr });
      }

      _.assign(resultConfig, {mode: resultConfig.homeScreen && resultConfig.homeScreen.mode === 1 ? localizedStrings.DOSSIER : localizedStrings.LIBRARY});

      if (_.has(resultConfig, VC.DATE_MODIFIED)) {
        _.assign(resultConfig, {dateModified: _.split(resultConfig.dateModified, /[\T.]+/, 2).join(' ')});
      }

      if (_.has(resultConfig, VC.DATE_CREATED)) {
        _.assign(resultConfig, {dateCreated: _.split(resultConfig.dateCreated, /[\T.]+/, 2).join(' ')});
      }

      return resultConfig;
    });
    return configList;
  }

  getColumnDef = () => {
    return [
      {
        field: VC.NAME,
        headerName: localizedStrings.NAME,
        lockVisible: true,
        cellRendererFramework: (rendererParam: any) => {
          const d = rendererParam.data;
          return (
            <div className={`${classNamePrefix}-application-name-container`}>
              {d.isDefault && <span className={`${classNamePrefix}-default-application-text`}>{'(' + localizedStrings.DEFAULT + ')'}</span>}
              <span className={`${classNamePrefix}-application-name-text`}>{d.name}</span>
              {this.renderShareContextMenu(d)}
            </div>
          )
        },
      },
      {
        field: VC.DESC,
        headerName: localizedStrings.DESCRIPTION,
      },
      // {
      //   field: VC.PLATFORM_STR,
      //   headerName: localizedStrings.PLATFORMS,
      // },
      {
        field: VC.MODE,
        headerName: localizedStrings.HOME,
        width: 100,
        resizable: false,
      },
      // {
      //   field: VC.CONTENT_BUNDLES,
      //   headerName: localizedStrings.NAVBAR_CONTENT_BUNDLES,
      //   sortable: false,
      //   cellRendererFramework: (rendererParam: any) => {
      //     const d = rendererParam.data;
      //     if (d.contentBundles.length === 0) {
      //       return (
      //         <div className={`${classNamePrefix}-content-bundles`}>
      //           <span>{d.mode === localizedStrings.LIBRARY ? localizedStrings.BUNDLE_USER_HINT : ''}</span>
      //         </div>
      //       )
      //     }
      //     return (
      //       <div className={`${classNamePrefix}-content-bundles`}>
      //         {
      //           d.contentBundles.map(((bundle: {name: string, color: number}) => {
      //             return (<span className={`${classNamePrefix}-content-bundles-item`}>
      //               <span className={`${classNamePrefix}-content-bundles-item-icon`} style={{ background: hexIntToColorStr(bundle.color) }}></span>
      //               <span className={`${classNamePrefix}-content-bundles-item-text`}>{bundle.name}</span>
      //             </span>)
      //           }))
      //         }
      //       </div>
      //     )
      //   },
      // },
      {
        field: VC.DATE_MODIFIED,
        headerName: localizedStrings.DATE_MODIFIED,
        width: 175,
        resizable: true // DE209336; make date column resizable.
      },
      {
        field: VC.DATE_CREATED,
        headerName: localizedStrings.DATE_CREATED,
        width: 175,
        resizable: true,
        initialHide: true
      }
    ] as ColumnDef[]
  }

  render() {
    const configDataSource = this.generateConfigDisplayList();
    const getContextMenuItems = (event: CellContextMenuEvent) => {
      const contextMenuTarget: Record = event.data;

      const handleClickEdit = () => {
        this.openConfigEditor(contextMenuTarget.id);
      };
      const handleClickDelete = () => {
        this.deleteConfig(contextMenuTarget.id);
      };
      const handleClickDuplicate = () => {
        this.openConfigEditor(contextMenuTarget.id, true);
      };
      const handleClickInfo = () => {
        const selectedObjs : MstrObject[] = [{id: contextMenuTarget.id, type: APPLICATION_OBJECT_TYPE, subType: APPLICATION_OBJECT_SUBTYPE}];
        const currentProj : Project = this.state.currentEnv.projects[0];
        let options: PropertiesSettings = {
          objects: selectedObjs,
          project: currentProj,
          environment: this.state.currentEnv
        }
        
        workstation.dialogs.openProperties(options).catch(e =>
          workstation.dialogs.error({
              message: 'Open object properties failed with error',
              additionalInformation: JSON.stringify(e)
          })
        )
      };

      /* ********************************************* */
      // Context Menu Formation
      /* ********************************************* */
      const contextMenuItems = [];
      contextMenuItems.push({
        name: localizedStrings.EDIT,
        action: handleClickEdit
      });

      contextMenuItems.push({
        name: localizedStrings.DELETE,
        action: handleClickDelete,
        disabled: contextMenuTarget? contextMenuTarget.isDefault : false
      })

      contextMenuItems.push({
        name: localizedStrings.DUPLICATE,
        action: handleClickDuplicate,
        disabled: contextMenuTarget? contextMenuTarget.isDefault : false
      })

      contextMenuItems.push({
        name: localizedStrings.GETINFO,
        action: handleClickInfo
      })

      return contextMenuItems
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
          <ReactWsGrid
            rowSelectable={true}
            rowMultiSelectWithClick={false}
            getRowHeight={() => 32}
            showCheckbox={false}
            useToolbar={true}
            // @ts-ignore: RC Component Support error
            rowSelection='single'
            getContextMenuItems={getContextMenuItems}
            isLoading={this.props.configLoading && this.state.isInitialLoading}
            columnDefs={this.getColumnDef()}
            defaultColDef={{
              resizable: true,
              sortable: true,
            }}
            rowData={configDataSource}
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
  configLoading: selectIsConfigLoading(state),
  contentBundleList: selectContentBundleList(state)
})

const connector = connect(mapState, {
})

export default connector(HomeScreenConfigMainView)