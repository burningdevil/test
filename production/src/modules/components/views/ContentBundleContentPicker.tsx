import * as React from 'react'
import '../scss/ContentBundleContentPicker.scss'
import { SearchInput } from '@mstr/rc';
import { Modal, Button, Menu } from 'antd';
import * as _ from "lodash";
import { ReactWsGrid } from '@mstr/react-ws-grid';
import {
  SelectionChangedEvent,
  GridReadyEvent,
  GridApi,
  SortChangedEvent,
  IServerSideGetRowsParams
} from 'ag-grid-community';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { connect } from 'react-redux';
import { selectAllDossiers, selectAllDocuments, selectIsLoadingDossiers, selectLoadingDossiersFinish } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import { default as VC, localizedStrings, HomeScreenHomeObjectType, contentPickerSize } from '../HomeScreenConfigConstant'
import * as api from '../../../services/Api'
import { store } from '../../../main'
import ContentBundleList from './ContentBundleList';

const classNamePrefix = 'content-bundle-content-picker';
const rowSelectionType = 'single';
let gridApi: GridApi;
let currentOffset = 0;
// let activeTab = 'Dossier';
// let searchNameFilter = '';

class ContentBundleContentPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeTab: HomeScreenHomeObjectType.DOSSIER,
      selectedObject: {},
      searchNameFilter: ''
    }
  }
  bundleContentPickerDataSource(server: any) {
    return {
      getRows: function (params: IServerSideGetRowsParams) {
        console.log('[Datasource] - rows requested by grid: ', params.request);
        var response = server.getData(params);
        setTimeout(function () {
          if (response?.success) {
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } else {
            // params.fail();
          }
        }, 200);
      },
    };
  }

  bundleContentPickerServer() {
    return {
        getData:  (params: IServerSideGetRowsParams) => {
          const isDossier = this.state.activeTab === 'Dossier';
          let results: any[] = [];
          let lastRow: number = -1;
          let limit: number = 1000;
          let dossiers = selectAllDossiers(store.getState() as RootState);
          let documents = selectAllDocuments(store.getState() as RootState);
          let loadFinished = selectLoadingDossiersFinish(store.getState() as RootState);

          var startRow = params.request.startRow;
          var endRow = params.request.endRow;
          if (params.request.sortModel && params.request.sortModel.length > 0) {
            const { sort, colId } = params.request.sortModel[0];
            if (loadFinished) {
                lastRow = isDossier ? dossiers.length : documents.length;
                results = isDossier ? _.orderBy(dossiers, [colId], [sort]): _.orderBy(documents, [colId], [sort]);
                results = _.slice(results, startRow, lastRow);
                results = results.map((content: any) => {
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
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
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
                });
                params.successCallback(results, lastRow);
              });
            }
          } else {
          if(this.state.searchNameFilter !== '') {
            api.loadSearchedDossierDocuments(this.state.searchNameFilter).then((response: {dossiers: any, documents: any, totalCount: any}) => {
              lastRow = isDossier ? response.dossiers.length : response.documents.length;
              results = isDossier ? _.slice(response.dossiers, startRow, lastRow) : _.slice(response.documents, startRow, lastRow);
              results = results.map((content: any) => {
                return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
              });
              params.successCallback(results, lastRow);
            });
          } else {
            if (loadFinished) {
              lastRow = isDossier ? dossiers.length : documents.length;
              results = isDossier ? _.slice(dossiers, startRow, lastRow) : _.slice(documents, startRow, lastRow);
              results = results.map((content: any) => {
                return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
              });
              params.successCallback(results, lastRow);
            } else {
              var currentLength = isDossier ? dossiers.length : documents.length;
              if (endRow < currentLength) {
                results = isDossier ? _.slice(dossiers, startRow, endRow) : _.slice(documents, startRow, endRow);
                results = results.map((content: any) => {
                  return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
                });
                params.successCallback(results, lastRow);
              } else {
                var expectedCount = endRow - currentLength;
                (function loop(count) {
                  if (count > 0) {
                    api.loadBatchDossierDocuments(currentOffset, limit).then((response: {dossiers: any, documents: any, totalCount: any}) => {
                      dossiers = dossiers.concat(response.dossiers);
                      documents = documents.concat(response.documents);
                      if(response.totalCount <= currentOffset + limit) {// load finished
                        lastRow = isDossier ? dossiers.length : documents.length;
                        results = isDossier ? _.slice(dossiers, startRow, lastRow) : _.slice(documents, startRow, lastRow);
                        results = results.map((content: any) => {
                          return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
                        });
                        params.successCallback(results, lastRow);
                      } else {
                        var loaded = isDossier ? response.dossiers.length : response.documents.length;
                        if (loaded > expectedCount) {// loaded
                          results = isDossier ? _.slice(dossiers, startRow, endRow) : _.slice(documents, startRow, endRow);
                          results = results.map((content: any) => {
                            return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});//certifiedWithIcon: this.geCertifiedIcon(content.certifiedInfo.certified), nameWithIcon: this.getContentIconWithName(content.name, activeTab)});
                          });
                          params.successCallback(results, lastRow);
                        } else {// need to continue load
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
  componentDidMount() {
    // api.loadAllDossierDocuments();
  }

  onGridReady = (params: GridReadyEvent) => {
    gridApi = params.api;
    this.updateData();

  };
  updateData = () => {
    let fakeServer = this.bundleContentPickerServer();
    let datasource = this.bundleContentPickerDataSource(fakeServer);
    gridApi.setServerSideDatasource(datasource);
  }

  tabBarChanged = (param: any) => {
    this.setState({
      activeTab: param.key
    });
    this.handleSelectionChanged({});
    this.updateData();
    if (gridApi) {
      gridApi.deselectAll();
      gridApi.clearFocusedCell();
    }
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
    this.updateData();
      gridApi.deselectAll();
      gridApi.clearFocusedCell();
    
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
  onSortChanged = (event: SortChangedEvent) => {
    gridApi.clearFocusedCell();
  }
  getRowHeight = (params: any) => {
    return 36;
  }

  generateDisplayList = () => {
    const isDossier = this.state.activeTab === HomeScreenHomeObjectType.DOSSIER;
    const dataList = isDossier ? this.props.dossiers : this.props.documents
    return dataList.filter((content: any) => {
      if (_.isEmpty(this.state.searchNameFilter)) {
        return true;
      }
      return content.name.toLowerCase().indexOf(this.state.searchNameFilter.toLowerCase()) !== -1;
    }).map((content: any) => {
      return _.assign(content, {dateCreatedShort: _.split(content.dateCreated, 'T', 1)[0], dateModifiedShort: _.split(content.dateModified, 'T', 1)[0], key: content.id, ownerName: content.owner.name, certified: content.certifiedInfo.certified, isDossier: isDossier});
    });
  }
  render() {
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
                onChange={(e: string) => this.handleSearch(e)}
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
                    <ReactWsGrid
                        rowMultiSelectWithClick={true}
                        onSelectionChanged = {this.onSelectionChanged}
                        onSortChanged = {this.onSortChanged}
                        // @ts-ignore: RC Component Support error
                        rowSelection = {rowSelectionType}
                        rowModelType = 'serverSide'
                        serverSideStoreType = 'partial'
                        getRowHeight = {this.getRowHeight}
                        columnDefs = {[
                            {field: VC.NAME, sortable: false, headerName: localizedStrings.NAME, width: 250, cellRendererFramework: (params: any) => {
                              const data = params.data;
                              if (data.isDossier) {
                                return <>
                                        <span className={`${classNamePrefix}-grid-right-dossier-icon`} ></span>
                                        <span className={`${classNamePrefix}-grid-right-name-text`}>{data.name}</span>
                                      </>
                              } else {
                                return <>
                                        <span className={`${classNamePrefix}-grid-right-doc-icon`} ></span>
                                        <span className={`${classNamePrefix}-grid-right-name-text`}>{data.name}</span>
                                      </>
                              }
                            }},
                            {field: VC.CERTIFIED, sortable: false, headerName: localizedStrings.CERTIFIED, width: 90, cellRendererFramework: (params: any) => {
                              const data = params.data;
                              if (data.certified) {
                                  return <span className={VC.FONT_CERTIFIED} style={{color: '#f08033', fontSize: '14px'}} />
                              } else {
                                return '';
                              }}
                            },
                            {field: VC.OWNER_NAME, sortable: false, headerName: localizedStrings.OWNER, width: 120},
                            {field: VC.DATE_CREATED_SHORT, sortable: false, width: 116, headerName: localizedStrings.DATE_CREATED},
                            {field: VC.DATE_MODIFIED_SHORT, sortable: false, width: 116, headerName: localizedStrings.DATE_MODIFIED}
                        ]}
                        isLoading={this.props.loadingData}
                        defaultColDef={{
                          resizable: true
                        }}
                        noDataMessage={localizedStrings.NO_DATA_MESSAGE}
                        onGridReady={this.onGridReady}
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
