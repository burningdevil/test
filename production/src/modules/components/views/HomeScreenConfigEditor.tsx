import * as React from 'react'
import '../scss/HomeScreenConfigEditor.scss'
import { Modal, Tabs, Layout, Button} from 'antd';

const popoverEditTitle = 'Edit Application Configuration';
const popoverCreateTitle = 'Create Application Configuration';
const navBar = {
  GENERAL: 'General',
  HOME_SCREEN: 'Home Screen',
  COMPONENTS: 'Components',
  CONTENT_BUNDLES: 'Content Bundles',
  MORE_SETTINGS: 'More Settings'
};
const popoverGeneral = {
  width: 1045,
  height: 600,
  headerHeight: 31,
};

export default class HomeScreenConfigEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1'
    }
  }

  componentDidMount() {
  }

  tabBarChanged = (key: string) => {
    this.setState({
        activeKey: key
    });
  }

  buttonGroup = () => {
    return (
        <div className="mstr-Admin-cfg-popover-btn">
            <Button key="back">
                {'Cancel'}
            </Button>
            <Button key="Generate"
                type="primary"
                style={{marginLeft: 10}}>
                {'Save'}
            </Button>
        </div>
    );
  };

  render() {
    const { visible, isEditConfig } = this.props;
    const bodyHeight = popoverGeneral.height - popoverGeneral.headerHeight;
    return (
        <Modal
            className='mstr-Admin-cfg-popover'
            destroyOnClose={true}
            width={popoverGeneral.width}
            maskClosable = {false}
            bodyStyle={{height: popoverGeneral.height}}
            visible={visible}
            footer={null}
            onCancel={() => {
              this.props.handleDismiss(false)
            }}
        >
            {visible ? (
                <Layout className='mstr-Admin-cfg-popover-layout'>
                    <Layout.Header>
                        <span>{isEditConfig ? popoverEditTitle : popoverCreateTitle}</span>
                    </Layout.Header>
                    <Layout.Content style={{height: bodyHeight}}>
                        <Layout className="mstr-Admin-cfg-popover-layout-content">
                            <div>
                                <Tabs
                                    activeKey = {this.state.activeKey}
                                    onChange={this.tabBarChanged}
                                    tabPosition="left"
                                    style={{height: bodyHeight}}>
                                    <Tabs.TabPane tab={navBar.GENERAL} key="1">
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
            ) : null}
        </Modal>
    );
  }
}
