import * as React from 'react'
import '../scss/ContentBundleContentPicker.scss'
import { SearchInput } from '@mstr/rc';
import { store } from '../../../main'
import { Modal, Button, Menu } from 'antd';
import * as _ from "lodash";
import {AgGridReact} from 'ag-grid-react';
import {
  GridReadyEvent,
  GetContextMenuItemsParams,
  IServerSideGetRowsParams,
  SelectionChangedEvent,
  GridOptions,
  ServerSideStoreType,
} from 'ag-grid-community'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { connect } from 'react-redux';
import { selectAllDossiers, selectAllDocuments, selectIsLoadingDossiers, selectLoadingDossiersFinish } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/api';
import { t } from '../../../i18n/i18next';

var currentOffset = 0;
var activeTab = 'Dossier';
var searchNameFilter = '';

const popoverGeneral = {
  width: 909,
  height: 617,
  headerHeight: 0,
};

class ContentBundleContentPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: 'Dossier',
      selectedObject: {},
    }
  }

  bundleContentPickerDataSource(server: any) {
    return {
      getRows: function (params: IServerSideGetRowsParams) {
        console.log('[Datasource] - rows requested by grid: ', params.request);
        var response = server.getData(params);
        setTimeout(function () {
          if (response.success) {
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } else {
            params.fail();
          }
        }, 200);
      },
    };
  }
  
  bundleContentPickerServer() {
    return {
        getData: function (params: IServerSideGetRowsParams) {
          const isDossier = activeTab === 'Dossier';
          console.log(activeTab);
          var results: any[] = [];
          var lastRow: number = -1;
          var limit: number = 300;
          var dossiers = selectAllDossiers(store.getState());
          var documents = selectAllDocuments(store.getState());
          var loadFinished = selectLoadingDossiersFinish(store.getState());
          
          var startRow = params.request.startRow;
          var endRow = params.request.endRow;
          if (params.request.sortModel && params.request.sortModel.length > 0) {
            const { sort, colId } = params.request.sortModel[0];
            if (loadFinished) {
                lastRow = isDossier ? dossiers.length : documents.length;
                results = isDossier ? _.orderBy(dossiers, [colId], [sort]): _.orderBy(documents, [colId], [sort]);
                results = _.slice(results, startRow, lastRow);
                results = results.map((content: any) => {
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
                });
                params.successCallback(results, lastRow);
            } else {
              api.loadBatchDossierDocuments(dossiers.length + documents.length, -1).then((response: {dossiers: any, documents: any, totalCount: any}) => {
                dossiers = dossiers.concat(response.dossiers);
                documents = documents.concat(response.documents);
                lastRow = isDossier ? dossiers.length : documents.length;
                results = isDossier ? _.orderBy(dossiers, [colId], [sort]): _.orderBy(documents, [colId], [sort]);
                results = _.slice(results, startRow, lastRow);
                results = results.map((content: any) => {
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
                });
                params.successCallback(results, lastRow);
              });
            }
          } else {
          if(searchNameFilter !== '') {
            api.loadSearchedDossierDocuments(searchNameFilter).then((response: {dossiers: any, documents: any, totalCount: any}) => {
              lastRow = isDossier ? response.dossiers.length : response.documents.length;
              results = isDossier ? _.slice(response.dossiers, startRow, lastRow) : _.slice(response.documents, startRow, lastRow);
              results = results.map((content: any) => {
                return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
              });
              params.successCallback(results, lastRow);
            });
          } else {
            console.log(dossiers);
            if (loadFinished) {
              lastRow = isDossier ? dossiers.length : documents.length;
              results = isDossier ? _.slice(dossiers, startRow, lastRow) : _.slice(documents, startRow, lastRow);
              results = results.map((content: any) => {
                return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
              });
              params.successCallback(results, lastRow);
            } else {
              var currentLength = isDossier ? dossiers.length : documents.length;
              if (endRow < currentLength) {
                results = isDossier ? _.slice(dossiers, startRow, endRow) : _.slice(documents, startRow, endRow);
                results = results.map((content: any) => {
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
                });
                params.successCallback(results, lastRow);
              } else {
                var expectedCount = endRow - currentLength;
                (function loop(count) {
                  if (count > 0) {
                    api.loadBatchDossierDocuments(currentOffset, limit).then((response: {dossiers: any, documents: any, totalCount: any}) => {
                      dossiers = dossiers.concat(response.dossiers);
                      documents = documents.concat(response.documents);
                      if(response.totalCount <= currentOffset + limit) {//load finished
                        lastRow = isDossier ? dossiers.length : documents.length;
                        results = isDossier ? _.slice(dossiers, startRow, lastRow) : _.slice(documents, startRow, lastRow);
                        results = results.map((content: any) => {
                          return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
                        });
                        params.successCallback(results, lastRow);
                      } else {
                        var loaded = isDossier ? response.dossiers.length : response.documents.length;
                        if (loaded > expectedCount) {//loaded
                          results = isDossier ? _.slice(dossiers, startRow, endRow) : _.slice(documents, startRow, endRow);
                          results = results.map((content: any) => {
                            return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
                          });
                          params.successCallback(results, lastRow);
                        } else {//need to continue load
                          currentOffset = currentOffset + limit;
                          expectedCount = expectedCount - loaded;
                          loop(expectedCount);
                        }
                      }
                    }).catch((e: any) => (console.log(e)));
                  }
                })(expectedCount);
              }
            }
         }
        }
       }
    }
  }

  tabBarChanged = (param: any) => {
    this.setState({
      activeTab: param.key
    });
    activeTab = param.key;
    this.gridOptions.api.refreshServerSideStore({});
  }

  handleCancelAdd = () => {
    this.props.handleClose();
    this.handleSelectionChanged({});
    searchNameFilter = '';
  }

  handleSearch = (value: string) => {
    //filter on name in allBundleList
    searchNameFilter = value;
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.onFilterChanged();
  }

  handleSaveAdd = () => {
    const {id, projectId, name} = this.state.selectedObject;
    this.props.handleChange(name, projectId +'/' + id);
    this.props.handleClose();
    this.handleSelectionChanged({});
    searchNameFilter = '';
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

  getGridContents = (contents: any[], activeTabStr: string) => {
      const newlist = contents.map((content) => {
        return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: activeTabStr === 'Dossier'});
      });
      return newlist;
  }

  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log(event.api.getSelectedNodes());
    var selections = event.api.getSelectedNodes();
    selections = selections.map(o=>o.data);
    if (selections && selections.length > 0) {
      this.handleSelectionChanged(selections[0]);
    }
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

  getContextMenuItems = (params: GetContextMenuItemsParams) => {
    return [] as any[];
  }

  onGridReady = (params: GridReadyEvent) => {
    if (!params || !params.api) {
      return;
    }

    var fakeServer = this.bundleContentPickerServer();
    var datasource = this.bundleContentPickerDataSource(fakeServer);
    params.api.setServerSideDatasource(datasource);

    const { selectedObject } = this.state;
    params.api.forEachNode(function (node: any) {
      node.setSelected(node.data.id === selectedObject.id);
    });
  };

  gridOptions: GridOptions = {
    rowHeight: 35,
    headerHeight:35,
    defaultColDef: {
      flex: 0,
      resizable: false,
      sortable: true,
      menuTabs: [] as string[]
    },
    animateRows: true,
    rowSelection: 'single',
    rowMultiSelectWithClick: true,
    onSelectionChanged: this.onSelectionChanged,
    onGridReady: this.onGridReady,
    rowModelType: 'serverSide',
    serverSideStoreType: ServerSideStoreType.Partial,
    
    getContextMenuItems: this.getContextMenuItems,
    columnDefs: [
        {field: 'name', headerName: t('name'), width: 250, cellRenderer: (params: any) => {
          if (params.node.data.isDossier) {
            return '<img class="content-bundle-content-picker-grid-right-name-dossier" src="../assets/images/dossier.jpg"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
          } else {
            return '<img class="content-bundle-content-picker-grid-right-name-document" src="../assets/images/document.png"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
          }
        }},
        {field: 'certified', headerName: t('certified'), width: 90, cellRenderer: (params: any) => {
          if (params.node.data.certified) {
              return `<span class="icon-home_certified" style="color: #f08033; font-size: 14px" />`;
          } else {
            return '';
          }}
        },
        {field: 'ownerName', headerName: t('owner'), width: 120},
        {field: 'dateCreatedShort', width: 116, headerName: t('dateCreated')},
        {field: 'dateModifiedShort', width: 116, headerName: t('dateModified')}
    ]
  };

  render() {
    const { loadingData } = this.props;
    
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
              {t('selectDossierHint')}
            </div>
            <SearchInput className="content-bundle-content-picker-search" placeholder="Search"
                onChange={(value: string) => {
                  this.handleSearch(value);
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
                  <Menu.Item tabIndex={0} aria-label={t('dossiersTab')} key="Dossier" className="content-bundle-content-picker-grid-menu-tab1" onClick={this.tabBarChanged}>
                    <div className="icon-dossier"/>
                    <div className="content-bundle-content-picker-grid-menu-dossier">
                      {t('dossiers')}
                    </div>
                  </Menu.Item>
                  <Menu.Item tabIndex={0} aria-label={t('documentsTab')} key="Document" className="content-bundle-content-picker-grid-menu-tab2" onClick={this.tabBarChanged}>
                    <div className="icon-rsd-cover"/>
                    <div className="content-bundle-content-picker-grid-menu-document">
                      {t('documents')}
                    </div>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="content-bundle-content-picker-grid-right">
                <div style={{ width: '100%', height: '100%' }}>
                <div id="myGrid" style={{ height: '100%', width: '100%'}} className="ag-theme-alpine">
                    <AgGridReact gridOptions={this.gridOptions}>
                    </AgGridReact>
                </div>
              </div>
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

const mapState = (state: RootState) => ({
  dossiers: selectAllDossiers(state),
  documents: selectAllDocuments(state),
  loadingData: selectIsLoadingDossiers(state)
})

const connector = connect(mapState, {
})

export default connector(ContentBundleContentPicker)
