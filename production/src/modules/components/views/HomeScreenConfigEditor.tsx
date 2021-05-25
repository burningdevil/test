import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenConfigEditor.scss'
import { Tabs, Layout, Button} from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import { Alert } from '@mstr/rc';
import HomeScreenGeneral from './HomeScreenGeneral';
import HomeScreenComponents from './HomeScreenComponents';
import HomeScreenMoreSetting from './HomeScreenMoreSetting';
import HomeScreenHomeSetting from './HomeScreenHomeSetting';
import HomeScreenContentBundles from './HomeScreenContentBundles';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { PARSE_METHOD } from '../../../utils/ParseMethods';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import { childrenIcons, CONSTANTS, dossierIconsDossierHome, iconTypes, libraryIcons, platformType, reviewType } from '../HomeScreenConfigConstant';

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

class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      configId: undefined,
      previewDeviceType: reviewType.TABLET,
      configInfo: {
          name: '',
          description: '',
          platform: ['Mobile', 'Web', 'Desktop'],
          homeScreen: {mode: CONSTANTS.MODE_USE_DEFAULT_HOME_SCREEN, homeLibrary: {icons:libraryIcons.map((icon) => icon.key), sidebars: childrenIcons.map((icon) => icon.key).filter((key) => key !== iconTypes.defaultGroup.key), contentBundleIds:[], toolbarMode: CONSTANTS.SHOW_TOOLBAR, toolbarDisabled: CONSTANTS.SHOW_TOOLBAR}, homeDocument: {url:"", icons:dossierIconsDossierHome.map((icon) => icon.key), toolbarMode: CONSTANTS.SHOW_TOOLBAR, toolbarDisabled: CONSTANTS.SHOW_TOOLBAR}},
          general: { networkTimeout: CONSTANTS.DEFAULT_NETWORK_TIMEOUT, cacheClearMode: CONSTANTS.CLEAR_AUTOMATIC, clearCacheOnLogout: false, maxLogSize: CONSTANTS.DEFAULT_MAX_LOG_SIZE, logLevel: CONSTANTS.LOG_LEVEL_WARNING, updateInterval: CONSTANTS.DEFAULT_UPDATE_INTERVAL}
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

    this.props.setCurrentConfig(data);

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
    // in case previewDeviceType not valid
    const platform = _.get(currentConfig, 'platform')
    let deviceType = this.state.previewDeviceType
    const availableTypes = _.concat(platform.includes(platformType.mobile) ? [reviewType.TABLET, reviewType.PHONE] : [], platform.includes(platformType.web) ? reviewType.WEB : [], platform.includes(platformType.desktop) ? reviewType.DESKTOP : [])
    
    let valid = true
    switch (deviceType) {
        case reviewType.TABLET:
        case reviewType.PHONE:
            if (!platform.includes(platformType.mobile)) {
                valid = false
            }
            break;
        case reviewType.WEB:
            if (!platform.includes(platformType.web)) {
                valid = false
            }
            break;
        case reviewType.DESKTOP:
            if (!platform.includes(platformType.desktop)) {
                valid = false
            }
            break;
        default:
            break;
    }
    if (!valid) {
        this.handlePreviewDeviceTypeChange(availableTypes.length > 0 ? availableTypes[0] : reviewType.TABLET)
    }
    this.setState({
        configInfo: currentConfig
    });
  }

  handleContentBundleChange = (bundles: []) => {
    const currentConfig = this.state.configInfo;
    const currentBundles = _.get(currentConfig, 'homeScreen.homeLibrary.contentBundleIds')
    let sideBarIcons = _.get(currentConfig, 'homeScreen.homeLibrary.sidebars')
    _.set(currentConfig, 'homeScreen.homeLibrary.contentBundleIds', bundles);
    // set components options 'default groups' automaticlly 
    if (!_.isEmpty(currentBundles) && currentBundles.length > 0 && bundles.length === 0) {
        sideBarIcons = _.pull(sideBarIcons, iconTypes.defaultGroup.key)
    } else if ((_.isEmpty(currentBundles) || currentBundles.length === 0) && bundles.length > 0) {
        sideBarIcons = _.concat(sideBarIcons, iconTypes.defaultGroup.key)
    }
    _.set(currentConfig, 'homeScreen.homeLibrary.sidebars', sideBarIcons)
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

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state)
})

const connector = connect(mapState, {
  setCurrentConfig: Actions.setCurrentConfig
})

export default connector(HomeScreenConfigEditor)
