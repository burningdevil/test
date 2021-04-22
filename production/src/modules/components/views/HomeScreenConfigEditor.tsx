import * as React from 'react'
import '../scss/HomeScreenConfigEditor.scss'
import { Tabs, Layout, Button} from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import HomeScreenGeneral from './HomeScreenGeneral';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';

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
          platform: ['Mobile']
      }
    }
  }

  async componentDidMount() {
      const configId = this.parseConfigId(_.get(this.props, 'location.search', undefined));
      this.setState({
          configId: configId
      });
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
    
    this.setState({
      configInfo: data
    });
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
      const response = configId ? await HttpProxy.put('/mstrClients/libraryApplications/configs/' + this.state.configId, this.state.configInfo) : await HttpProxy.post('/mstrClients/libraryApplications/configs/' + this.state.configId, this.state.configInfo);
      let data = response;
      if (data.status === 204) { //success
        //trigger load config list and close window
        workstation.window.close();
      } else { //error
        //show error dialog
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
                                <HomeScreenGeneral name={this.state.configInfo.name} description={this.state.configInfo.description} platform={this.state.configInfo.platform} handleChange = {this.handleConfigPropertiesChange}/>
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.HOME_SCREEN} key="2">
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.COMPONENTS} key="3">
                                {this.buttonGroup()}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={navBar.CONTENT_BUNDLES} key="4">
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
