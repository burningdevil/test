import * as React from 'react'
import '../scss/ContentBundlePicker.scss'
import { SearchInput } from '@mstr/rc';
import { Modal, Button, Menu } from 'antd';
import * as _ from "lodash";
import ContentBundleList from './ContentBundleList';
import { t } from '../../../i18n/i18next'

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
    this.props.handleBundlesAdd(this.state.selectedBundles)
    this.handleSelectionChanged([]);
    this.props.handleClose();
  }

  buttonGroup = () => {
    return (
        <div className="content-bundle-picker-btn">
            <Button onClick={this.handleCancelAdd}
            style={{ paddingTop: 0}}>
                {t('cancel')}
            </Button>
            <Button
                type="primary"
                style={{marginLeft: 10, paddingTop: 0}}
                onClick={this.handleSaveAdd}
                disabled = {this.state.selectedBundles.length === 0}>
                {t('select')}
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
              {t('selectContentBundles')}
            </div>
            <SearchInput className="content-bundle-picker-search" placeholder={t('search')}
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
                        {t('contentBundles')}
                    </div>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="content-bundle-picker-grid-right">
                <ContentBundleList includedIds = {[]} handleSelection = {this.handleSelectionChanged} allowDelete={false} nameFilter={this.state.nameFilter}/>
              </div>
            </div>
            <div className="content-bundle-picker-footer">
              {t('selectedStr', {bundlesCount})}
            </div>
          </div>
          {this.buttonGroup()}
        </div>  
      </Modal>
     );
  }
}
