import * as React from 'react'
import '../scss/ContentBundlePicker.scss'
import { SearchInput } from '@mstr/rc';
import { Modal, Button, Menu } from 'antd';
import * as _ from "lodash";
import ContentBundleList from './ContentBundleList';
import { default as VC, localizedStrings, bundlePickerSize, selectedBundlesStr } from '../HomeScreenConfigConstant'

const classNamePrefix = 'content-bundle-picker';
const bundleMenuKey = 'bundles';

export default class ContentBundlePicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: bundleMenuKey,
      selectedBundles:[ ],
      nameFilter: ''
    }
  }

  handleCancelAdd = () => {
    this.handleSelectionChanged([]);
    this.props.handleClose();
  }

  handleSaveAdd = () => {
    this.props.handleBundlesAdd(this.state.selectedBundles)
    this.handleSelectionChanged([]);
    this.props.handleClose();
  }

  buttonGroup = () => {
    return (
        <div className={`${classNamePrefix}-btn`}>
            <Button onClick={this.handleCancelAdd}
            style={{ paddingTop: 0}}>
                {localizedStrings.CANCEL}
            </Button>
            <Button
                type='primary'
                style={{marginLeft: 10, paddingTop: 0}}
                onClick={this.handleSaveAdd}
                disabled = {this.state.selectedBundles.length === 0}>
                {localizedStrings.SELECT}
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
    const bundlesCount = this.state.selectedBundles.length
    return (
      <Modal
          className={`${classNamePrefix}-modal`}
          destroyOnClose={true}
          width={bundlePickerSize.width}
          maskClosable = {false}
          visible = {this.props.visible}
          footer={null}
          onCancel={() => {
          }}
      >
        <div className={`${classNamePrefix}`}>
          <div className={`${classNamePrefix}-top`}>
            <div className={`${classNamePrefix}-header`}>
              {localizedStrings.SELECT_CONTENT_BUNDLES}
            </div>
            <SearchInput className={`${classNamePrefix}-search`} placeholder={localizedStrings.SEARCH} value={this.state.nameFilter}
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}
                onClear={() => {
                  this.handleSearch('');
                }}/>
          </div>
          <div className={`${classNamePrefix}-middle`}>
            <div className={`${classNamePrefix}-grid`}>
              <div className={`${classNamePrefix}-grid-left`}>
                <Menu className={`${classNamePrefix}-grid-menu`}
                  defaultSelectedKeys={[this.state.activeTab]}
                  mode='inline'
                  theme={'dark'}
                >
                  <Menu.Item key={bundleMenuKey} className={`${classNamePrefix}-grid-menu-tab`}>
                    <div className={VC.FONT_GROUP}/>
                    <div className={`${classNamePrefix}-grid-menu-text`}>
                        {localizedStrings.NAVBAR_CONTENT_BUNDLES}
                    </div>
                  </Menu.Item>
                </Menu>
              </div>
              <div className={`${classNamePrefix}-grid-right`}>
                <ContentBundleList includedIds = {[]} handleSelection = {this.handleSelectionChanged} allowDelete={false} nameFilter={this.state.nameFilter}/>
              </div>
            </div>
            <div className={`${classNamePrefix}-footer`}>
              {`${selectedBundlesStr(bundlesCount)}`}
            </div>
          </div>
          {this.buttonGroup()}
        </div>  
      </Modal>
     );
  }
}
