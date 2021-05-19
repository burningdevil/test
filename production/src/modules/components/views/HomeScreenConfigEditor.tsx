import * as React from 'react'
import '../scss/HomeScreenConfigEditor.scss'
import { Tabs, Layout, Button} from 'antd';
import { WorkstationModule, WindowEvent } from '@mstr/workstation-types';
import { Alert } from '@mstr/rc';
import HomeScreenGeneral from './HomeScreenGeneral';
import HomeScreenComponents from './HomeScreenComponents';
import HomeScreenMoreSetting from './HomeScreenMoreSetting';
import HomeScreenHomeSetting from './HomeScreenHomeSetting';
import HomeScreenContentBundles from './HomeScreenContentBundles';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { PARSE_METHOD } from '../../../utils/ParseMethods';
import { childrenIcons, CONSTANTS, dossierIconsDossierHome, iconTypes, libraryIcons } from '../HomeScreenConfigConstant';
import { includes } from 'lodash';

declare var workstation: WorkstationModule;

const navBar = {
  GENERAL: 'General',
  HOME_SCREEN: 'Home Screen',
  COMPONENTS: 'Components',
  CONTENT_BUNDLES: 'Content Bundles',
  MORE_SETTINGS: 'More Settings'
};
const popoverGeneral = {
  width: 962,
  height: 708,
  headerHeight: 0,
};

export default class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      configId: undefined,
      previewDeviceType: CONSTANTS.REVIEW_MODE_TABLET,
      configInfo: {
          name: '',
          description: '',
          platform: ['Mobile', 'Web', 'Desktop'],
          homeScreen: {mode: 0, homeLibrary: {icons:libraryIcons.map((icon) => icon.key), sidebars: childrenIcons.map((icon) => icon.key).filter((key) => key !== iconTypes.defaultGroup.key), contentBundleIds:[], toolbarMode: 0, toolbarDisabled: 0}, homeDocument: {url:"", icons:dossierIconsDossierHome.map((icon) => icon.key), toolbarMode: 0, toolbarDisabled: 0}},
          general: { networkTimeout: 180, cacheClearMode: 1, clearCacheOnLogout: false, maxLogSize: 500, logLevel: 12, updateInterval: 1440}
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

    if (!_.has(data, 'homeScreen.homeLibrary')) {
      data.homeScreen.homeLibrary = {icons:[], sidebars:[], contentBundleIds:[]}
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

  handleConfigPropertiesChange = (properties: object) => {
    const currentConfig = _.merge(this.state.configInfo, properties);
    this.setState({
        configInfo: currentConfig
    });
  }

  handleContentBundleChange = (bundles: []) => {
    const currentConfig = this.state.configInfo;
    _.set(currentConfig, 'homeScreen.homeLibrary.contentBundleIds', bundles);
    console.log('handle bundle change');
    console.log(currentConfig);
    this.setState({
        configInfo: currentConfig
    });
  }

  handlePreviewDeviceTypeChange = (type: string) => {
      this.setState({
        previewDeviceType: type
      })
  }

  handleSaveConfig = async () => {
      const configId = this.state.configId;
      if (configId) {
        await HttpProxy.put('/mstrClients/libraryApplications/configs/' + configId, this.state.configInfo, {}, PARSE_METHOD.BLOB).catch((e: any)=>(<Alert details="Fix the warning"
        message="Warning..."
        theme="as"
        title="Warning"/>));
      } else {
        await HttpProxy.post('/mstrClients/libraryApplications/configs', this.state.configInfo, {}, PARSE_METHOD.BLOB).catch((e: any)=>(<Alert details="Fix the warning"
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
                                <HomeScreenGeneral name={this.state.configInfo.name} description={this.state.configInfo.description} platform={this.state.configInfo.platform} configId = {this.state.configInfo.id} handleChange = {this.handleConfigPropertiesChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.HOME_SCREEN} key="2">
                                <HomeScreenHomeSetting homeScreen={this.state.configInfo.homeScreen} handleChange = {this.handleConfigPropertiesChange} deviceType={this.state.previewDeviceType} platform={this.state.configInfo.platform} handleDeviceTypeChange={this.handlePreviewDeviceTypeChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.COMPONENTS} key="3">
                                <HomeScreenComponents homeScreen={this.state.configInfo.homeScreen} handleChange = {this.handleConfigPropertiesChange} deviceType={this.state.previewDeviceType} platform={this.state.configInfo.platform} handleDeviceTypeChange={this.handlePreviewDeviceTypeChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.CONTENT_BUNDLES} key="4" disabled={this.state.configInfo.homeScreen.mode===1}>
                                <HomeScreenContentBundles contentBundleIds = {this.state.configInfo.homeScreen.homeLibrary.contentBundleIds} handleChange = {this.handleContentBundleChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.MORE_SETTINGS} key="5">
                                <HomeScreenMoreSetting general = {this.state.configInfo.general} handleChange = {this.handleConfigPropertiesChange}/>
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
