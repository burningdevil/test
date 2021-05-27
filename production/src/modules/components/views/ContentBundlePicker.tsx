import * as React from 'react'
import '../scss/ContentBundlePicker.scss'
import { ReactWindowGrid, SearchInput, SelectionStructure } from '@mstr/rc';
import { Modal, Button, Menu, Table } from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import * as _ from "lodash";
import classNames from 'classnames';
import { HttpProxy } from '../../../main';
import ContentBundleList from './ContentBundleList';

declare var workstation: WorkstationModule;

const popoverGeneral = {
  width: 900,
  height: 600,
  headerHeight: 0,
};

const EnumDSSXMLViewMedia = {
  DssXmlViewMediaViewStatic: 0x00000001,
  DssXmlViewMediaViewAnalysis: 0x00000800,
  DssXmlViewMediaHTML5Dashboard: 0x00002000
};

export default class ContentBundlePicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: 'bundles',
      selectedBundles:[ ],
      nameFilter: ''
    }
  }

  isContentTypeDossier(viewMedia: number) {
    const defModePosition = viewMedia >> 27;
    let defaultViewMedia;
    if (defModePosition == 0) {
        defaultViewMedia = 0;
    }

    defaultViewMedia = EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << defModePosition - 1;
    if (defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis || defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard) {
        return true;
    } else {
        return false;
    }
  }

  handleCancelAdd = () => {
    this.handleSelectionChanged([]);
    this.props.handleClose();
  }

  handleSaveAdd = () => {
    // const {id, projectId, name} = this.state.selectedObject;
    // this.props.handleChange(name, projectId +'/' + id);
    this.props.handleBundlesAdd(this.state.selectedBundles)
    this.handleSelectionChanged([]);
    this.props.handleClose();
  }

  buttonGroup = () => {
    return (
        <div className="content-bundle-picker-btn">
            <Button onClick={this.handleCancelAdd}
            style={{ paddingTop: 0}}>
                Cancel
            </Button>
            <Button
                type="primary"
                style={{marginLeft: 10, paddingTop: 0}}
                onClick={this.handleSaveAdd}
                disabled = {this.state.selectedBundles.length === 0}>
                Select
            </Button>
        </div>
    );
  };

  handleSelectionChanged = (selections: []) => {
    this.setState({
      selectedBundles: selections
    });
  }

  handleSearch = (value: string) => {
    this.setState({
      nameFilter: value
    });
  }

  render() {
    return (
      <Modal
          className='content-bundle-picker-modal'
          destroyOnClose={true}
          width={popoverGeneral.width}
          maskClosable = {false}
          visible = {this.props.visible}
          footer={null}
          onCancel={() => {
            //this.props.handleDismiss(false)
          }}
      >
        <div className="content-bundle-picker">
          <div className="content-bundle-picker-top">
            <div className="content-bundle-picker-header">
              Select content bundles
            </div>
            <SearchInput className="content-bundle-picker-search" placeholder="Search"
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}/>
          </div>
          <div className="content-bundle-picker-middle">
            <div className="content-bundle-picker-grid">
              <div className="content-bundle-picker-grid-left">
                <Menu className="content-bundle-picker-grid-menu"
                  defaultSelectedKeys={[this.state.activeTab]}
                  mode="inline"
                  theme={'dark'}
                >
                  <Menu.Item key="bundles" className="content-bundle-picker-grid-menu-tab">
                    <div className="icon-group_groups_a"/>
                    <div className="content-bundle-picker-grid-menu-text">
                        Content Bundles
                    </div>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="content-bundle-picker-grid-right">
                <ContentBundleList includedIds = {[]} handleSelection = {this.handleSelectionChanged} allowDelete={false} nameFilter={this.state.nameFilter}/>
              </div>
            </div>
            <div className="content-bundle-picker-footer">
              {this.state.selectedBundles.length + ' selected'}
            </div>
          </div>
          {this.buttonGroup()}
        </div>  
      </Modal>
     );
  }
}

// import * as React from 'react'
// import '../scss/ContentBundlePicker.scss'
// import { Tabs, Button} from 'antd';
// import { WorkstationModule } from '@mstr/workstation-types';
// import ContentBundleList from './ContentBundleList';
// import * as _ from "lodash";

// declare var workstation: WorkstationModule;

// export const navBar = {
//   CONTENTBUNDLES: 'Content Bundles'
// };

// const popoverGeneral = {
//   width: 1045,
//   height: 700,
//   headerHeight: 0,
// };

// export default class ContentBundlePicker extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props)
//     this.state = {
//       activeKey: '1',
//       selectedBundles:[ ]
//     }
//   }

//   tabBarChanged = (key: string) => {
//     this.setState({
//         activeKey: key
//     });
//   }

//   buttonGroup = () => {
//     return (
//         <div className="content-bundle-picker-btn">
//             <Button key="back"
//                 onClick={this.handleCancel}
//             >
//                 {'Cancel'}
//             </Button>
//             <Button key="Generate"
//                 type="primary"
//                 style={{marginLeft: 10}}
//                 disabled={!this.state.selectedBundles || this.state.selectedBundles.length === 0}
//                 onClick={this.handleSelectBundles}>
//                 {'Select'}
//             </Button>
//         </div>
//     );
//   };

//   handleBundleSelection = (selection: []) => {
//     this.setState({
//       selectedBundles: selection
//     });
//   }

//   handleSelectBundles = async () => {
//       await workstation.window.postMessage({selectedBundleList: this.state.selectedBundles});
//       workstation.window.close();
//   }

//   handleCancel = () => {
//     workstation.window.close();
//   }

//   render() {
//     const bodyHeight = popoverGeneral.height - popoverGeneral.headerHeight;
//     return (
//       <div className='content-bundle-picker-container'>
//           <Tabs
//               activeKey = {this.state.activeKey}
//               onChange={this.tabBarChanged}
//               tabPosition="left"
//               style={{height: bodyHeight}}
//               >
//               <Tabs.TabPane tab={navBar.CONTENTBUNDLES} key="1">
//                 <ContentBundleList handleSelection = {this.handleBundleSelection} allowDelete={false}/>
//                 {this.buttonGroup()}
//               </Tabs.TabPane>
//         </Tabs>
//       </div>
//     );
//   }
// }
