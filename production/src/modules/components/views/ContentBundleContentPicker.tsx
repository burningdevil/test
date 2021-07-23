import * as React from 'react'
import '../scss/ContentBundleContentPicker.scss'
import { SearchInput } from '@mstr/rc';
import { store } from '../../../main'
import { Modal, Button, Menu } from 'antd';
import * as _ from "lodash";
import { ReactWsGrid } from '@mstr/react-ws-grid';
import {
  GridReadyEvent,
  GetContextMenuItemsParams,
  IServerSideGetRowsParams,
  SelectionChangedEvent,
  GridOptions,
  ServerSideStoreType,
} from 'ag-grid-community';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { connect } from 'react-redux';
import { selectAllDossiers, selectAllDocuments, selectIsLoadingDossiers, selectLoadingDossiersFinish } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as api from '../../../services/Api';
import { default as VC, localizedStrings, HomeScreenHomeObjectType, contentPickerSize } from '../HomeScreenConfigConstant'


var currentOffset = 0;
var activeTab = HomeScreenHomeObjectType.DOSSIER;
const classNamePrefix = 'content-bundle-content-picker';
const rowSelectionType = 'single';
const rowModelType = 'serverSide';

class ContentBundleContentPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: HomeScreenHomeObjectType.DOSSIER,
      selectedObject: {},
      gridApi: {},
      searchNameFilter: ''
    }
  }

  bundleContentPickerDataSource(server: any) {
    return {
      getRows: function (params: IServerSideGetRowsParams) {
        server.getData(params);
      },
    };
  }
  
  bundleContentPickerServer() {
    const THIS = this;
    return {
        getData: function (params: IServerSideGetRowsParams) {
          const isDossier = activeTab === HomeScreenHomeObjectType.DOSSIER;
          var results: any[] = [];
          var lastRow: number = -1;
          var limit: number = 300;
          var dossiers = THIS.props.dossiers;
          var documents = THIS.props.documents;
          var loadFinished = THIS.props.loadFinished;
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
          if(THIS.state.searchNameFilter !== '') {
            api.loadSearchedDossierDocuments(THIS.state.searchNameFilter).then((response: {dossiers: any, documents: any, totalCount: any}) => {
              lastRow = isDossier ? response.dossiers.length : response.documents.length;
              results = isDossier ? _.slice(response.dossiers, startRow, lastRow) : _.slice(response.documents, startRow, lastRow);
              results = results.map((content: any) => {
                return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
              });
              params.successCallback(results, lastRow);
            });
          } else {
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
    this.state.gridApi.refreshServerSideStore({});
  }

  handleCancelAdd = () => {
    this.props.handleClose();
    this.handleSelectionChanged({});
    this.setState({
      searchNameFilter: ''
    });
  }

  handleSearch = (value: string) => {
    this.setState({
      searchNameFilter: value
    });
    this.state.gridApi.deselectAll();
    this.state.gridApi.onFilterChanged();
  }

  handleSaveAdd = () => {
    const {id, projectId, name} = this.state.selectedObject;
    const isDossier = this.state.activeTab === HomeScreenHomeObjectType.DOSSIER;
    this.props.handleChange(name, projectId +'/' + id, isDossier);
    this.props.handleClose();
    this.handleSelectionChanged({});
    this.setState({
      searchNameFilter: ''
    });
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
                disabled = {_.isEmpty(this.state.selectedObject)}>
                {localizedStrings.SELECT}
            </Button>
        </div>
    );
  };

  getGridContents = (contents: any[], activeTabStr: string) => {
      const newlist = contents.map((content) => {
        return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: activeTabStr === HomeScreenHomeObjectType.DOSSIER});
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
      <img className={`${classNamePrefix}-loading`} src={bookmarksImg}/>);
  }

  getContextMenuItems = (params: GetContextMenuItemsParams) => {
    return [] as any[];
    // return undefined;
  }

  getRowHeight = (params: any) => {
    return 36;
  }

  onGridReady = (params: GridReadyEvent) => {
    if (!params || !params.api) {
      return;
    }
    this.setState({
      gridApi: params.api
    });

    var fakeServer = this.bundleContentPickerServer();
    var datasource = this.bundleContentPickerDataSource(fakeServer);
    params.api.setServerSideDatasource(datasource);

    const { selectedObject } = this.state;
    if (!selectedObject.id) {
      return;
    }
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
    rowSelection: rowSelectionType,
    rowMultiSelectWithClick: true,
    onSelectionChanged: this.onSelectionChanged,
    onGridReady: this.onGridReady,
    rowModelType: rowModelType,
    serverSideStoreType: ServerSideStoreType.Partial,
    
    getContextMenuItems: this.getContextMenuItems,
    columnDefs: [
        {field: VC.NAME, sortable: true, headerName: localizedStrings.NAME, width: 250, cellRenderer: (params: any) => {
          if (params.node.data.isDossier) {
            return '<img class="content-bundle-content-picker-grid-right-name-dossier" src="../assets/images/dossier.jpg"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
          } else {
            return '<img class="content-bundle-content-picker-grid-right-name-document" src="../assets/images/document.png"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
          }
        }},
        {field: VC.CERTIFIED, sortable: true, headerName: localizedStrings.CERTIFIED, width: 90, cellRenderer: (params: any) => {
          if (params.node.data.certified) {
              return `<span class=${VC.FONT_CERTIFIED} style='color: #f08033; font-size: 14px' />`;
          } else {
            return '';
          }}
        },
        {field: VC.OWNER_NAME, sortable: true, headerName: localizedStrings.OWNER, width: 120},
        {field: VC.DATE_CREATED_SHORT, sortable: true, width: 116, headerName: localizedStrings.DATE_CREATED},
        {field: VC.DATE_MODIFIED_SHORT, sortable: true, width: 116, headerName: localizedStrings.DATE_MODIFIED}
    ]
  };

  render() {
    const { loadingData } = this.props;
    
    return (
      <Modal
          className={`${classNamePrefix}-modal`}
          destroyOnClose={true}
          width={contentPickerSize.width}
          maskClosable = {false}
          visible = {this.props.visible}
          footer={null}
          onCancel={() => {
          }}
      >
        <div className={`${classNamePrefix}`}>
          <div className={`${classNamePrefix}-top`}>
            <div className={`${classNamePrefix}-header`}>
              {localizedStrings.SELECT_DOSSIER_HINT}
            </div>
            <SearchInput className={`${classNamePrefix}-search`} placeholder={localizedStrings.SEARCH}
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}
                value={this.state.searchNameFilter}
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
                  <Menu.Item tabIndex={0} aria-label={localizedStrings.DOSSIER_TAB_TEXT} key={HomeScreenHomeObjectType.DOSSIER} className={`${classNamePrefix}-grid-menu-tab1`} onClick={this.tabBarChanged}>
                    <span className={VC.FONT_DOSSIER}/>
                    <span className={`${classNamePrefix}-grid-menu-dossier`}>
                      {localizedStrings.DOSSIERS}
                    </span>
                  </Menu.Item>
                  <Menu.Item tabIndex={0} aria-label={localizedStrings.DOCUMENT_TAB_TEXT} key={HomeScreenHomeObjectType.DOCUMENT} className={`${classNamePrefix}-grid-menu-tab2`} onClick={this.tabBarChanged}>
                    <span className={VC.FONT_DOCUMENT}/>
                    <span className={`${classNamePrefix}-grid-menu-document`}>
                      {localizedStrings.DOCUMENTS}
                    </span>
                  </Menu.Item>
                </Menu>
              </div>
              <div className={`${classNamePrefix}-grid-right`}>
                <div style={{ width: '100%', height: '100%' }}>
                <div id='contentPickerGrid' style={{ height: '100%', width: '100%'}}>
                    {/* <AgGridReact gridOptions ={this.gridOptions}>
                    </AgGridReact> */}
                    <ReactWsGrid
                        rowMultiSelectWithClick={true}
                        onSelectionChanged = {this.onSelectionChanged}
                        onGridReady = {this.onGridReady}
                        rowModelType = {rowModelType}
                        // @ts-ignore: RC Component Support error
                        serverSideStoreType = {ServerSideStoreType.Partial}
                        rowSelection = {rowSelectionType}
                        getRowHeight = {this.getRowHeight}
                        columnDefs = {[
                            {field: VC.NAME, sortable: true, headerName: localizedStrings.NAME, width: 250, cellRenderer: (params: any) => {
                              if (params.node.data.isDossier) {
                                return '<img class="content-bundle-content-picker-grid-right-name-dossier" src="../assets/images/dossier.jpg"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
                              } else {
                                return '<img class="content-bundle-content-picker-grid-right-name-document" src="../assets/images/document.png"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
                              }
                            }},
                            {field: VC.CERTIFIED, sortable: true, headerName: localizedStrings.CERTIFIED, width: 90, cellRenderer: (params: any) => {
                              if (params.node.data.certified) {
                                  return `<span class=${VC.FONT_CERTIFIED} style='color: #f08033; font-size: 14px' />`;
                              } else {
                                return '';
                              }}
                            },
                            {field: VC.OWNER_NAME, sortable: true, headerName: localizedStrings.OWNER, width: 120},
                            {field: VC.DATE_CREATED_SHORT, sortable: true, width: 116, headerName: localizedStrings.DATE_CREATED},
                            {field: VC.DATE_MODIFIED_SHORT, sortable: true, width: 116, headerName: localizedStrings.DATE_MODIFIED}
                        ]}
                        />
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
  loadingData: selectIsLoadingDossiers(state),
  loadFinished: selectLoadingDossiersFinish(state)
})

const connector = connect(mapState, {
})

export default connector(ContentBundleContentPicker)
