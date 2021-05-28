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
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { RestApiError } from '../../../server/RestApiError';
import { PARSE_METHOD } from '../../../utils/ParseMethods';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import * as api from '../../../services/api';
import { t } from '../../../i18n/i18next'

declare var workstation: WorkstationModule;

const navBar = {
  GENERAL: t('general'),
  HOME_SCREEN: t('homeScreen'),
  COMPONENTS: t('components'),
  CONTENT_BUNDLES: t('cotentBundle'),
  MORE_SETTINGS: t('moreSettings')
};
const popoverGeneral = {
  width: 962,
  height: 708,
  headerHeight: 0,
};

class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      configId: undefined,
      currentEnv: {}
    }
  }

  async componentDidMount() {
      const configId = this.parseConfigId(_.get(this.props, 'location.search', undefined));
      this.setState({
          configId: configId
      });
      if (configId) {
        api.loadCurrentEditConfig(configId);
      }
      const currentEnv = await workstation.environments.getCurrentEnvironment();
      this.setState({
        currentEnv: currentEnv
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

  parseConfigId = (querystr: string) => {
      if (querystr) {
          const querys = (/^[?#]/.test(querystr) ? querystr.slice(1) : querystr).split('&');
          let queryFound = querys.find((query) => {
              let [key,] = query.split('=');
              return key === "id";
          });

          return queryFound && queryFound.split('=')[1];
      }
      
  };

  tabBarChanged = (key: string) => {
    this.setState({
        activeKey: key
    });
  }

  buttonGroup = () => {
    return (
        <div className="mstr-Admin-cfg-popover-btn">
            <Button key="back" onClick={this.handleCancel}>
                {'Cancel'}
            </Button>
            <Button key="Generate"
                type="primary"
                style={{marginLeft: 10}}
                onClick={this.handleSaveConfig}>
                {'Save'}
            </Button>
        </div>
    );
  };

  handleSaveConfig = async () => {
      const configId = this.state.configId;
      if (configId) {
        HttpProxy.put('/mstrClients/libraryApplications/configs/' + configId, this.props.config, {}, PARSE_METHOD.BLOB).then(() => {
          // trigger load config list and close window
          workstation.window.postMessage({homeConfigSaveSuccess: true}).then(() => {workstation.window.close();});
        }).catch((e: any) => {
          // request error handle, if 401, need re-authrioze, disconnect current environment and close current sub-window. Else, show error message
          const error = e as RestApiError;
          if (error.statusCode === 401) {
            workstation.environments.disconnect(this.state.currentEnv.url);
            workstation.window.close();
            return;
          }
          message.error('save application error:' + error.errorMsg);
        });
      } else {
        HttpProxy.post('/mstrClients/libraryApplications/configs', this.props.config, {}, PARSE_METHOD.BLOB).then(() => {
          workstation.window.postMessage({homeConfigSaveSuccess: true}).then(() => {workstation.window.close();});
        }).catch((e: any) => {
          const error = e as RestApiError;
          if (error.statusCode === 401) {
            workstation.environments.disconnect(this.state.currentEnv.url);
            workstation.window.close();
            return;
          }
          message.error('save application error:' + error.errorMsg);
        });
      }
  }

  handleCancel = () => {
    workstation.window.close();
  }

  render() {
    const bodyHeight = popoverGeneral.height - popoverGeneral.headerHeight;
    return (
        <Layout className='mstr-Admin-cfg-popover-layout'>
            <Layout.Content>
                <Layout className="mstr-Admin-cfg-popover-layout-content">
                    <div>
                        <Tabs
                            activeKey = {this.state.activeKey}
                            onChange={this.tabBarChanged}
                            tabPosition="left"
                            style={{height: bodyHeight}}>
                            <Tabs.TabPane tab={navBar.GENERAL} key="1">
                                <HomeScreenGeneral/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.HOME_SCREEN} key="2">
                                <HomeScreenHomeSetting />
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.COMPONENTS} key="3">
                                <HomeScreenComponents />
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.CONTENT_BUNDLES} key="4" disabled={this.props.config.homeScreen.mode === 1}>
                                <HomeScreenContentBundles/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.MORE_SETTINGS} key="5">
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
  setCurrentConfig: Actions.setCurrentConfig
})

export default connector(HomeScreenConfigEditor)
