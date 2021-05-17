import * as React from 'react'
import '../scss/ContentBundleContentPicker.scss'
import { ReactWindowGrid, SearchInput, SelectionStructure } from '@mstr/rc';
import { Modal, Button, Menu, Table } from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import * as _ from "lodash";
import classNames from 'classnames';
import { ClickParam } from 'antd/lib/menu';
import { HttpProxy } from '../../../main';
import { isContentTypeDossier } from './HomeScreenUtils'

declare var workstation: WorkstationModule;

const popoverGeneral = {
  width: 909,
  height: 617,
  headerHeight: 0,
};

export default class ContentBundleContentPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: 'Dossier',
      searchNameFilter: '',
      selectedObject: {},
      offset: 0,
      dossiers: [],
      documents: [],
      loadingData: true
    }
  }

  async componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const response = await HttpProxy.get('/searches/results?pattern=4&type=14081&getAncestors=false&limit=1000&certifiedStatus=ALL').catch((e: any) => (console.log(e)));
    let objectList = response;
    if (response && response.data) {
        objectList = response.data;
    }

    const dossiers = objectList.result.filter((o: { viewMedia: number; }) => {return isContentTypeDossier(o.viewMedia)});
    const documents = objectList.result.filter((o: { viewMedia: number; }) => {return !isContentTypeDossier(o.viewMedia)});
    this.setState({
      loadingData: false,
      dossiers,
      documents
    });
  }

  tabBarChanged = (param: ClickParam) => {
    this.setState({
      activeTab: param.key
    });
  }

  handleCancelAdd = () => {
    this.props.handleClose();
  }

  handleSaveAdd = () => {
    const {id, projectId, name} = this.state.selectedObject;
    this.props.handleChange(name, projectId +'/' + id);
    this.props.handleClose();
  }

  buttonGroup = () => {
    return (
        <div className="content-bundle-content-picker-btn">
            <Button onClick={this.handleCancelAdd}
            style={{ paddingTop: 0}}>
                Cancel
            </Button>
            <Button
                type="primary"
                style={{marginLeft: 10, paddingTop: 0}}
                onClick={this.handleSaveAdd}
                disabled = {_.isEmpty(this.state.selectedObject)}>
                Select
            </Button>
        </div>
    );
  };

  geCertifiedIcon (isCertified: boolean) {
    return isCertified ? <div className = "icon-certified"/> : '';
}

  getContentIconWithName (name: string, type: string) {
    const iconClass = type === 'Dossier' ? classNames(
      'mstr-ws-iconset-objects',
      'icon-content-dossier'
    ) : classNames(
      'mstr-ws-iconset-objects',
      'icon-content-document'
    );
    return <div className = "content-bundle-content-picker-name"><span className={iconClass}/>{name}</div>;
  }

  getGridContents = (contents: any[], activeTab: string) => {
    // return [{
    //   "name": "DE30028 HeatMap flash html5",
    //   "id": "001808FB497F3C0256DB1B847AE4FA35",
    //   "dateCreated": "2016-03-09T06:40:19.000+0000",
    //   "dateModified": "2016-07-21T03:45:11.000+0000",
    //   "acg": 199,
    //   "owner": {
    //     "name": "Wu, Qiong",
    //     "id": "D595FF124C25A2C67E9C14A36C93BD5C"
    //   },
    //   "viewMedia": 134217845,
    //   "certifiedInfo": {
    //     "certified": false
    //   }}];

      const newlist = contents.map((content) => {
        return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
      });
      return newlist;
  }

  handleSelectObject = (event: MouseEvent, record: {}) => {
    // console.log(event);
    // console.log(record);
    this.handleSelectionChanged(record);
    //this.props.handleSelectedObjectChange(record);
  }

  handleSelectionChanged = (selection: {}) => {
    this.setState({
      selectedObject: selection
    });
  }

  renderLoadingIcon = () => {
    const bookmarksImg = require('../images/loading.gif');
    return (
      <img className="content-bundle-content-picker-loading" src={bookmarksImg}/>);
  }

  // rowSelection = {
  //   onChange: (selectedRowKeys: string[] | number[], selectedRows:[] ) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //     this.handleSelectionChanged(selectedRows);
  //   },
  //   type:'radio'
  // };

  // renderVirtualList = () => {
  //   const { visible, dossiers, documents } = this.props;
  //   const contents = this.getGridContents(this.state.activeTab === 'Dossier' ? dossiers : documents, this.state.activeTab);
  //   if (!contents) {
  //     return null;
  //   }
  //   return (
  //     <Grid
  //       className="virtual-grid"
  //       columnCount={5}
  //       columnWidth={() => 104}
  //       height={440}
  //       rowCount={contents.length}
  //       rowHeight={() => 54}
  //       width={800}
  //     >
  //       {({ columnIndex, rowIndex, style }) => (
  //         <div style={style}>
  //           {contents[rowIndex]['nameWithIcon']}
  //         </div>
  //       )}
  //     </Grid>
  //   );
  // };

  render() {
    const { dossiers, documents, loadingData } = this.state;
    const contents = this.getGridContents(this.state.activeTab === 'Dossier' ? dossiers : documents, this.state.activeTab);
    return (
      <Modal
          className='content-bundle-content-picker-modal'
          destroyOnClose={true}
          width={popoverGeneral.width}
          maskClosable = {false}
          visible = {this.props.visible}
          footer={null}
          onCancel={() => {
            //this.props.handleDismiss(false)
          }}
      >
        <div className="content-bundle-content-picker">
          <div className="content-bundle-content-picker-top">
            <div className="content-bundle-content-picker-header">
              Select dossiers or documents to add
            </div>
            <SearchInput className="content-bundle-content-picker-search" placeholder="Search"
                onChange={(value: string) => {
                  //this.handleSearch(value);
                }}/>
          </div>
          <div className="content-bundle-content-picker-middle">
            <div className="content-bundle-content-picker-grid">
              <div className="content-bundle-content-picker-grid-left">
                <Menu className="content-bundle-content-picker-grid-menu"
                  defaultSelectedKeys={[this.state.activeTab]}
                  mode="inline"
                  theme={'dark'}
                >
                  <Menu.Item key="Dossier" className="content-bundle-content-picker-grid-menu-tab1" onClick={this.tabBarChanged}>
                    <div className="icon-dossier"/>
                    <div className="content-bundle-content-picker-grid-menu-dossier">
                      Dossiers
                    </div>
                  </Menu.Item>
                  <Menu.Item key="Document" className="content-bundle-content-picker-grid-menu-tab2" onClick={this.tabBarChanged}>
                    <div className="icon-rsd-cover"/>
                    <div className="content-bundle-content-picker-grid-menu-document">
                      Documents
                    </div>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="content-bundle-content-picker-grid-right">
                {/* <Table className="content-bundle-content-picker-grid-table" columns = {[
                  {
                    dataIndex: 'nameWithIcon',
                    title: 'Name',
                    width: '40%',
                    sorter: (a, b) => a.name.localeCompare(b.name),
                    sortDirections: ['descend', 'ascend'],
                  },
                  {
                    dataIndex: 'certifiedWithIcon',
                    title: 'Certified',
                    width: '15%'
                  },
                  {
                    dataIndex: 'ownerName',
                    title: 'Owner',
                    width: '15%',
                    sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
                    sortDirections: ['descend', 'ascend'],
                  },
                  {
                    dataIndex: 'dateCreatedShort',
                    title: 'Date Created',
                    width: '15%',
                    sorter: (a, b) => a.dateCreated.localeCompare(b.dateCreated),
                    sortDirections: ['descend', 'ascend'],
                  },
                  {
                    dataIndex: 'dateModifiedShort',
                    title: 'Date Modified',
                    width: '15%',
                    sorter: (a, b) => a.dateModified.localeCompare(b.dateModified),
                    sortDirections: ['descend', 'ascend'],
                  }
                ]} dataSource = {contents} scroll={{ y: 410 }} pagination={false}/> */}
                  <ReactWindowGrid
              columnDef={[
                {
                  comparator: (a:any, b: any) => a.name.localeCompare(b.name),
                  field: 'nameWithIcon',
                  headerName: 'Name',
                  sortable: true,
                  width: '40%'
                },
                {
                  field: 'certifiedWithIcon',
                  headerName: 'Certified',
                  width: '15%',
                  sortable: false
                },
                {
                  field: 'ownerName',
                  headerName: 'Owner',
                  sortable: true,
                  width: '15%'
                },
                {
                  field: 'dateCreatedShort',
                  headerName: 'Date Created',
                  sortable: true,
                  width: '15%'
                },
                {
                  field: 'dateModifiedShort',
                  headerName: 'Date Modified',
                  sortable: true,
                  width: '15%'
                }
              ]}
              rowData={contents}
              isColumnConfigurable={false}
              onRowClick={this.handleSelectObject}
            />
              </div>
            </div>
            {/* <div className="content-bundle-content-picker-footer">
              {contents.length + ' selected'}
            </div> */}
          </div>
          {this.buttonGroup()}
          {loadingData && this.renderLoadingIcon()}
        </div>  
      </Modal>
     );
  }
}
