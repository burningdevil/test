import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigEditor.scss'
import '../../../assets/fonts/webfonts/css/dossier.css'
import { Tabs, Layout, Button, message} from 'antd';
import { WorkstationModule, EnvironmentChangeArg, EnvironmentAction, EnvironmentStatus} from '@mstr/workstation-types';
import HomeScreenGeneral from './HomeScreenGeneral';
import HomeScreenComponents from './HomeScreenComponents';
import HomeScreenMoreSetting from './HomeScreenMoreSetting';
import HomeScreenHomeSetting from './HomeScreenHomeSetting';
import HomeScreenContentBundles from './HomeScreenContentBundles';
import HomeScreenDossierSetting from './HomeScreenDossierSetting';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { PARSE_METHOD } from '../../../utils/ParseMethods';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectIsDuplicateConfig, selectIsConfigNameError, selectIsDossierAsHome } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import * as api from '../../../services/Api';
import { default as VC, localizedStrings, editorSize } from '../HomeScreenConfigConstant'

declare var workstation: WorkstationModule;

const classNamePrefix = 'home-screen-editor';

class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: VC.GENERAL,
      homeSettingTabVisitCount: 0,
      configId: undefined,
      isNameCopyed: false,  // Copy of Name for duplicate config operation should only be handled one time.
      currentEnv: {}
    }
  }

  async componentDidMount() {
      // Set Duplicate Config Flag
      const extraContext = await workstation.window.getExtraContext();
      const extraContextJson = JSON.parse(extraContext);
      const isDuplicate = extraContextJson.isDuplicate;
      this.props.setDuplicateConfig(isDuplicate);
      this.props.setConfigInfoList(extraContextJson.configInfoList);

      // Handle Edit config
      const configId = this.parseConfigId(_.get(this.props, 'location.search', undefined));
      if (configId) {
        api.loadCurrentEditConfig(configId);
      } else {
        const newApplicationName = this.generateDefaultAppName(extraContextJson.configInfoList);
        this.props.updateCurrentConfig({name: newApplicationName});
      }

      const currentEnv = await workstation.environments.getCurrentEnvironment();
      let isNameCopyed = false;
      if (isDuplicate && this.props.config.name && this.props.config.name.length > 0) {
        this.props.updateCurrentConfig({name: 'Copy of ' + this.props.config.name});
        isNameCopyed = true;
      }
      this.setState({
        currentEnv: currentEnv,
        configId: configId,
        isNameCopyed: isNameCopyed
      });

      workstation.environments.onEnvironmentChange((change: EnvironmentChangeArg) => {
        console.log('editor enviornment change: ' + change.actionTaken);
        console.log('editor enviornment change: env name : ' + change.changedEnvironment.name);
        console.log('editor enviornment change: env status : ' + change.changedEnvironment.status);
        if (change.actionTaken === EnvironmentAction.Disconnect && change.changedEnvironment.status === EnvironmentStatus.Disconnected && change.changedEnvironment.url === this.state.currentEnv.url) {
          // Disconnect environment and Close current window
          workstation.environments.disconnect(this.state.currentEnv.url);
          workstation.window.close();  
        }
      })
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.isDuplicateConfig && !this.state.isNameCopyed && nextProps.config.name !== this.props.config.name){
      this.props.updateCurrentConfig({name: 'Copy of ' + nextProps.config.name});
      this.setState({
        isNameCopyed: true
      });
      return;
    }
  }

  generateDefaultAppName = (configInfoList: any) => {
    const defaultAppName = localizedStrings.DEFAULT_APP_NAME;
    if (configInfoList.filter((appInfo: any ) => {
      return appInfo.name.toLowerCase() === defaultAppName.toLowerCase();
    }).length === 0) {
      return defaultAppName;
    }
    for (let i = 1; i < 10000; i++) {
      const newAppName = `${defaultAppName} ${i}`;
      if (configInfoList.filter((appInfo: any ) => {
        return appInfo.name.toLowerCase() === newAppName.toLowerCase();
      }).length === 0) {
        return newAppName;
      }
    }
    return '';  // Return empty name if Default App name count is larger than 10000.
  }

  parseConfigId = (querystr: string) => {
      const spliter = '=';
      const matchKey = 'id';
      if (querystr) {
          const querys = (/^[?#]/.test(querystr) ? querystr.slice(1) : querystr).split('&');
          let queryFound = querys.find((query) => {
              let [key,] = query.split('=');
              return key === matchKey;
          });
          return queryFound && queryFound.split(spliter)[1];
      }
  };

  tabBarChanged = (key: string) => {
    const { isDossierHome } = this.props;
    const homeSettingTabVisitCount = (key === VC.HOME_SCREEN && isDossierHome) ? this.state.homeSettingTabVisitCount + 1 : this.state.homeSettingTabVisitCount;
    this.setState({
        activeKey: key,
        homeSettingTabVisitCount: homeSettingTabVisitCount
    });
  }

  buttonGroup = () => {
    const { isDossierHome, config } = this.props;
    const dossierUrlPath = 'homeScreen.homeDocument.url';
    const dossierUrl = _.get(config, dossierUrlPath, '');
    return (
        <div className={`${classNamePrefix}-layout-btn`}>
            <Button key={VC.BACK} onClick={this.handleCancel}>
                {localizedStrings.CANCEL}
            </Button>
            <Button key={VC.GENERATE}
                type= 'primary'
                style={{marginLeft: 10}}
                onClick={this.handleSaveConfig}
                disabled = {this.props.isConfigNameError || (isDossierHome && _.isEmpty(dossierUrl))}>
                {localizedStrings.SAVE}
            </Button>
        </div>
    );
  };

  handleSaveConfig = () => {
      const configId = this.state.configId;
      if (configId && !this.props.isDuplicateConfig) {
        HttpProxy.put(api.getApiPathForEditApplication(configId), this.props.config, {}, PARSE_METHOD.BLOB).then(() => {
          // trigger load config list and close window
          workstation.window.postMessage({homeConfigSaveSuccess: true}).then(() => {workstation.window.close();});
        }).catch((e: any) => {
          // request error handle, if 401, need re-authrioze, disconnect current environment and close current sub-window. Else, show error message
          this.processErrorResponse(e);
        });
      } else {
        let config = this.props.config;
        if (this.props.isDuplicateConfig) {
          config = _.omit(config, ['id', 'dateModified', 'dateCreated', 'objectVersion']);
          config.objectNames = [];
        }
        HttpProxy.post(api.getApiPathForNewApplication(), config, {}, PARSE_METHOD.BLOB).then(() => {
          workstation.window.postMessage({homeConfigSaveSuccess: true}).then(() => {workstation.window.close();});
        }).catch((err: any) => {
          this.processErrorResponse(err);
        });
      }
  }

  processErrorResponse = (e: any) => {
    const error = e as RestApiError;
    if (error.statusCode === 401) {
      workstation.environments.disconnect(this.state.currentEnv.url);
      workstation.window.close();
      return;
    }
    message.error(localizedStrings.ERR_APP_SAVE + error.errorMsg);
  }

  handleCancel = () => {
    workstation.window.close();
  }

  render() {
    const bodyHeight = editorSize.height - editorSize.headerHeight;
    return (
        <Layout className= {`${classNamePrefix}-layout`}>
            <Layout.Content>
                <Layout className={`${classNamePrefix}-layout-content`}>
                    <div>
                        <Tabs
                            activeKey = {this.state.activeKey}
                            onChange={this.tabBarChanged}
                            tabPosition= 'left'
                            style={{height: bodyHeight}}>
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_GENERAL} key= {VC.GENERAL}>
                                <HomeScreenGeneral/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_HOME_SCREEN} key={VC.HOME_SCREEN}>
                                <HomeScreenHomeSetting visitCount={this.state.homeSettingTabVisitCount}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_COMPONENTS} key={VC.COMPONENTS}>
                                <HomeScreenComponents />
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            {/* <Tabs.TabPane tab={localizedStrings.NAVBAR_APPEARANCE} key={VC.APPEARANCE}>
                                {this.buttonGroup()}
                            </Tabs.TabPane> */}
                            {/* <Tabs.TabPane tab={localizedStrings.NAVBAR_DOSSIERSETTINGS} key={VC.DOSSIERSETTINGS}>
                                <HomeScreenDossierSetting />
                                {this.buttonGroup()}
                            </Tabs.TabPane> */}
                            {/* <Tabs.TabPane tab={localizedStrings.NAVBAR_CONTENT_BUNDLES} key={VC.CONTENT_BUNDLES} disabled={this.props.config.homeScreen.mode === 1}>
                                <HomeScreenContentBundles/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_MORE_SETTINGS} key={VC.MORESETTINGS}>
                                <HomeScreenMoreSetting/>
                                {this.buttonGroup()}
                            </Tabs.TabPane> */}
                        </Tabs>
                    </div>
                </Layout>
            </Layout.Content>
        </Layout>
    );
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state),
  isDossierHome: selectIsDossierAsHome(state),
  isDuplicateConfig: selectIsDuplicateConfig(state),
  isConfigNameError: selectIsConfigNameError(state)
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig,
  setDuplicateConfig: Actions.setDuplicateConfig,
  setCurrentConfig: Actions.setCurrentConfig,
  setConfigInfoList: Actions.setConfigInfoList
})

export default connector(HomeScreenConfigEditor)
