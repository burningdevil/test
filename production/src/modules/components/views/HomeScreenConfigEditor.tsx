import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigEditor.scss'
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
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector';
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
      configId: undefined,
      currentEnv: {}
    }
  }

  async componentDidMount() {
      const configId = this.parseConfigId(_.get(this.props, 'location.search', undefined));
      if (configId) {
        api.loadCurrentEditConfig(configId);
      }
      const currentEnv = await workstation.environments.getCurrentEnvironment();
      this.setState({
        currentEnv: currentEnv,
        configId: configId
      });
      const extraContext = await workstation.window.getExtraContext();
      const configInfoList = JSON.parse(extraContext);
      console.log('config list: ' + extraContext);
      this.props.setConfigInfoList(configInfoList);

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
    this.setState({
        activeKey: key
    });
  }

  buttonGroup = () => {
    return (
        <div className={`${classNamePrefix}-layout-btn`}>
            <Button key={VC.BACK} onClick={this.handleCancel}>
                {localizedStrings.CANCEL}
            </Button>
            <Button key={VC.GENERATE}
                type= 'primary'
                style={{marginLeft: 10}}
                onClick={this.handleSaveConfig}
                disabled = {_.isEmpty(this.props.config.name)}>
                {localizedStrings.SAVE}
            </Button>
        </div>
    );
  };

  handleSaveConfig = () => {
      const configId = this.state.configId;
      if (configId) {
        HttpProxy.put(api.getApiPathForEditApplication(configId), this.props.config, {}, PARSE_METHOD.BLOB).then(() => {
          // trigger load config list and close window
          workstation.window.postMessage({homeConfigSaveSuccess: true}).then(() => {workstation.window.close();});
        }).catch((e: any) => {
          // request error handle, if 401, need re-authrioze, disconnect current environment and close current sub-window. Else, show error message
          this.processErrorResponse(e);
        });
      } else {
        HttpProxy.post(api.getApiPathForNewApplication(), this.props.config, {}, PARSE_METHOD.BLOB).then(() => {
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
                                <HomeScreenHomeSetting />
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
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_CONTENT_BUNDLES} key={VC.CONTENT_BUNDLES} disabled={this.props.config.homeScreen.mode === 1}>
                                <HomeScreenContentBundles/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={localizedStrings.NAVBAR_MORE_SETTINGS} key={VC.MORESETTINGS}>
                                <HomeScreenMoreSetting/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </Layout>
            </Layout.Content>
        </Layout>
    );
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state)
})

const connector = connect(mapState, {
  setCurrentConfig: Actions.setCurrentConfig,
  setConfigInfoList: Actions.setConfigInfoList
})

export default connector(HomeScreenConfigEditor)
