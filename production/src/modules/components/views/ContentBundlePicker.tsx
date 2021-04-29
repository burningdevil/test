import * as React from 'react'
import '../scss/ContentBundlePicker.scss'
import { Tabs, Button} from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import ContentBundleList from './ContentBundleList';
import * as _ from "lodash";

declare var workstation: WorkstationModule;

export const navBar = {
  CONTENTBUNDLES: 'Content Bundles'
};

const popoverGeneral = {
  width: 1045,
  height: 700,
  headerHeight: 0,
};

export default class ContentBundlePicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      selectedBundles:[ ]
    }
  }

  tabBarChanged = (key: string) => {
    this.setState({
        activeKey: key
    });
  }

  buttonGroup = () => {
    return (
        <div className="content-bundle-picker-btn">
            <Button key="back"
                onClick={this.handleCancel}
            >
                {'Cancel'}
            </Button>
            <Button key="Generate"
                type="primary"
                style={{marginLeft: 10}}
                disabled={!this.state.selectedBundles || this.state.selectedBundles.length === 0}
                onClick={this.handleSelectBundles}>
                {'Select'}
            </Button>
        </div>
    );
  };

  handleBundleSelection = (selection: []) => {
    this.setState({
      selectedBundles: selection
    });
  }

  handleSelectBundles = async () => {
      await workstation.window.postMessage({selectedBundleList: this.state.selectedBundles});
      workstation.window.close();
  }

  handleCancel = () => {
    workstation.window.close();
  }

  render() {
    const bodyHeight = popoverGeneral.height - popoverGeneral.headerHeight;
    return (
      <div className='content-bundle-picker-container'>
          <Tabs
              activeKey = {this.state.activeKey}
              onChange={this.tabBarChanged}
              tabPosition="left"
              style={{height: bodyHeight}}
              >
              <Tabs.TabPane tab={navBar.CONTENTBUNDLES} key="1">
                <ContentBundleList handleSelection = {this.handleBundleSelection} allowDelete={false}/>
                {this.buttonGroup()}
              </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
