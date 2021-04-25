import * as React from 'react'
import '../scss/HomeScreenConfigEditor.scss'
import { Tabs, Layout, Button} from 'antd';
import { WorkstationModule, WindowEvent } from '@mstr/workstation-types';
import { Alert } from '@mstr/rc';
import HomeScreenGeneral from './HomeScreenGeneral';
import HomeScreenComponents from './HomeScreenComponents';
import HomeScreenHomeSetting from './HomeScreenHomeSetting';
import HomeScreenContentBundles from './HomeScreenContentBundles';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { PARSE_METHOD } from '../../../utils/ParseMethods';

declare var workstation: WorkstationModule;

const navBar = {
  GENERAL: 'General',
  HOME_SCREEN: 'Home Screen',
  COMPONENTS: 'Components',
  CONTENT_BUNDLES: 'Content Bundles',
  MORE_SETTINGS: 'More Settings'
};
const popoverGeneral = {
  width: 1045,
  height: 700,
  headerHeight: 0,
};

export default class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      configId: undefined,
      configInfo: {
          name: '',
          description: '',
          platform: ['Mobile'],
          homeScreen: {mode: 0, homeDocument: {}, icons:[]},
          homeLibrary: {icons:[], contentBundleIds:[]}
      }
    }
  }

  async componentDidMount() {
      const configId = this.parseConfigId(_.get(this.props, 'location.search', undefined));
      this.setState({
          configId: configId
      });
      console.log(configId);
      if (configId) {
        this.loadData(configId);
      }
    //   workstation.window.addHandler(WindowEvent.CLOSE, () => {
    //       console.log('close editor');
    //       workstation.window.setCloseInfo('test');
    //       return {
    //         ResponseValue: true
    //       };
    //   });
  }

  loadData = async (configId: string) => {
    const response = await HttpProxy.get('/mstrClients/libraryApplications/configs/' + configId);
    let data = response;
    if (response.data) {
      data = response.data;
    }

    if (!_.has(data, 'platform')) {
        _.assign(data, {platform: ['Mobile']});
    }
    
    this.setState({
      configInfo: data
    });

    console.log(data);
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
            <Button key="back"
                onClick={this.handleCancel}
            >
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

  handleConfigPropertiesChange = (properties: object) => {
    const currentConfig = _.merge(this.state.configInfo, properties);
    this.setState({
        configInfo: currentConfig
    });
  }

  handleSaveConfig = async () => {
      const configId = this.state.configId;
      if (configId) {
        await HttpProxy.put('/mstrClients/libraryApplications/configs/' + configId, this.state.configInfo, {}, PARSE_METHOD.BLOB).catch(e=>(<Alert details="Fix the warning"
        message="Warning..."
        theme="as"
        title="Warning"/>));
      } else {
        await HttpProxy.post('/mstrClients/libraryApplications/configs', this.state.configInfo, {}, PARSE_METHOD.BLOB).catch(e=>(<Alert details="Fix the warning"
        message="Warning..."
        theme="as"
        title="Warning"/>));
      }
      //trigger load config list and close window
      await workstation.window.postMessage({homeConfigSaveSuccess: true});
      workstation.window.close();
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
                                <HomeScreenGeneral name={this.state.configInfo.name} description={this.state.configInfo.description} platform={this.state.configInfo.platform} handleChange = {this.handleConfigPropertiesChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.HOME_SCREEN} key="2">
                                <HomeScreenHomeSetting homeScreen={this.state.configInfo.homeScreen} handleChange = {this.handleConfigPropertiesChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.COMPONENTS} key="3">
                                <HomeScreenComponents platform={this.state.configInfo.platform} mode={this.state.configInfo.homeScreen.mode}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.CONTENT_BUNDLES} key="4">
                                <HomeScreenContentBundles contentIds = {this.state.configInfo.homeScreen} handleChange = {this.handleConfigPropertiesChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.MORE_SETTINGS} key="5">
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
