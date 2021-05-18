import * as React from 'react';
import '../scss/ContentBundleList.scss';
import ContentBundlePicker from './ContentBundlePicker'
import * as _ from "lodash";
import { ReactWindowGrid, MSTRWSIcon, SearchInput, SelectionStructure, Record } from '@mstr/rc';
import { WorkstationModule } from '@mstr/workstation-types';
import classNames from 'classnames';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { HttpProxy } from '../../../main';
import {AgGridReact} from 'ag-grid-react';
import { BundleInfo } from '../HomeScreenConfigConstant'
import { hexIntToColorStr, BundleRecipientType, HomeScreenBundleListDatasource, getHomeScreenBundleListGroupCellInnerRenderer, FakeHomeScreenBundleListServer } from './HomeScreenUtils'
import {
  GridReadyEvent,
  SelectionChangedEvent,
  GetContextMenuItemsParams,
  CheckboxSelectionCallbackParams,
  RowNode
} from 'ag-grid-community'
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// const bundleList = {
    //   contentBundles:
    //   [{
    //     "color": 100,
    //     "opacity" : 100,
    //     "emailEnabled": true,
    //     "id": "37BE16A411D3E48C1000E787EC6DE8A4",
    //     "name": "Content Bundle Name",
    //     "dateCreated": "2001-01-02T20:49:47.000Z",
    //     "dateModified": "2021-01-07T07:13:59.000Z",
    //     "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
    //     "type": 77,
    //     "recipients":
    //     [
    //         {
    //             "id": "54F3D26011D2896560009A8E67019608",
    //             "isGroup": true
    //         },
    //         {
    //             "id": "CE132A8447058084F270F5ADA3ED0433",
    //             "isGroup": false
    //         }
    //     ]
    //   },
    //   {
    //     "color": 1000,
    //     "opacity" : 100,
    //     "emailEnabled": true,
    //     "id": "37BE16A411D3E48C1000E787EC6DE8A5",
    //     "name": "Content Bundle Name2",
    //     "dateCreated": "2001-01-02T20:49:47.000Z",
    //     "dateModified": "2021-01-07T07:13:59.000Z",
    //     "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
    //     "type": 77,
    //     "recipients":
    //     [
    //         {
    //             "id": "54F3D26011D2896560009A8E67019608",
    //             "isGroup": true
    //         },
    //         {
    //             "id": "CE132A8447058084F270F5ADA3ED0433",
    //             "isGroup": false
    //         }
    //     ]
    //   },
    //   {
    //     "color": 1000,
    //     "opacity" : 100,
    //     "emailEnabled": true,
    //     "id": "37BE16A411D3E48C1000E787EC6DE8A6",
    //     "name": "Content Bundle Name3",
    //     "dateCreated": "2001-01-02T20:49:47.000Z",
    //     "dateModified": "2021-01-07T07:13:59.000Z",
    //     "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
    //     "type": 77,
    //     "recipients":
    //     [
    //         {
    //             "id": "54F3D26011D2896560009A8E67019608",
    //             "isGroup": true
    //         },
    //         {
    //             "id": "CE132A8447058084F270F5ADA3ED0433",
    //             "isGroup": false
    //         }
    //     ]
    //   },
    //   {
    //     "color": 1000,
    //     "opacity" : 100,
    //     "emailEnabled": true,
    //     "id": "37BE16A411D3E48C1000E787EC6DE8A7",
    //     "name": "Content Bundle Name4",
    //     "dateCreated": "2001-01-02T20:49:47.000Z",
    //     "dateModified": "2021-01-07T07:13:59.000Z",
    //     "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
    //     "type": 77,
    //     "recipients":
    //     [
    //         {
    //             "id": "54F3D26011D2896560009A8E67019608",
    //             "isGroup": true
    //         },
    //         {
    //             "id": "CE132A8447058084F270F5ADA3ED0433",
    //             "isGroup": false
    //         }
    //     ]
    //   }
    //   ]
    // };

    // let contents = {
    //   "DED77D324ED01C5DC719AB884D1756C3":
    //   [
    //       {
    //           "id": "46A61F2345F765F0836036B63240A0B9",
    //           "projectId": "DED77D324ED01C5DC719AB884D1756C3",
    //           "name": "dname1",
    //           "type": 55,
    //           "viewMedia": 1879072805,
    //           "dateModified": "2021-01-07T07:13:59.000Z",
    //           "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
    //           "isCertified": true
    //       },
    //       {
    //           "id": "46A61F2345F765F0836036B63240A0B1",
    //           "projectId": "DED77D324ED01C5DC719AB884D1756C3",
    //           "name": "dname1",
    //           "type": 55,
    //           "viewMedia": 1879072805,
    //           "dateModified": "2021-01-07T07:13:59.000Z",
    //           "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
    //           "isCertified": true
    //       },
    //       {
    //           "id": "46A61F2345F765F0836036B63240A0B2",
    //           "projectId": "DED77D324ED01C5DC719AB884D1756C3",
    //           "name": "dname1",
    //           "type": 55,
    //           "viewMedia": 1879072805,
    //           "dateModified": "2021-01-07T07:13:59.000Z",
    //           "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
    //           "isCertified": true
    //       },
    //       {
    //           "id": "46A61F2345F765F0836036B63240A0BA",
    //           "projectId": "DED77D324ED01C5DC719AB884D1756C3",
    //           "name": "dname2",
    //           "type": 55,
    //           "viewMedia": 1879072805,
    //           "dateModified": "2021-01-07T09:13:59.000Z",
    //           "owner": {"name": "xyz", "id":"54F3D26011D2896560009A8E67019608"},
    //           "isCertified": false
    //       }
    //   ]
    // };

declare var workstation: WorkstationModule;

export default class ContentBundleList extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      allBundleList: [],
      currentBundleList: [],
      showBundlePicker: false
    }
  }

  updateData = (data: BundleInfo[], params: any) => {
    var fakeServer = FakeHomeScreenBundleListServer(data);
    var datasource = HomeScreenBundleListDatasource(fakeServer);
    params.api.setServerSideDatasource(datasource);
  };

  onGridReady = (params: GridReadyEvent) => {
    this.updateData(this.state.currentBundleList, params);
  };

  async componentDidMount() {
    this.loadData();
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    console.log("Env: " + currentEnv);
    this.setState({
      currentEnv: currentEnv
    });
    
  }

  loadData = async () => {
    const response = await HttpProxy.get('/contentBundles').catch((e: any) => (console.log(e)));
    let bundleList = response;
    if (response && response.data) {
      bundleList = response.data;
    }
    var bundles = bundleList.contentBundles;
    this.setState({
      allBundleList: bundles
    });
    this.processBundleList(bundles, this.props.includedIds, this.props.excludedIds);
  }

  processBundleList(bundles: BundleInfo[], includedIds:[], excludedIds:[]) {
    if (includedIds && this.props.allowDelete) {
      bundles = bundles.filter((bundle)=>{
        if(_.indexOf(includedIds, bundle.id) >= 0 ) {
          return bundle;
        }});
    }

    if (excludedIds) {
      bundles = bundles.filter((bundle)=>{
        if(_.indexOf(excludedIds, bundle.id) >= 0 ) {
          return bundle;
        }});
    }
    // bundles = bundles.map((bundle) => {
    //   return _.assign(bundle, {nameWithIcon: this.getBundleIconWithNameColor(bundle.name, bundle.color)});
    // });

    bundles = bundles.map((bundle) => {
      const recipients = bundle.recipients;
      const totalCount = recipients.length;
      const groups = recipients.filter(user => (user.group));
      let mode = BundleRecipientType.BOTH;
      let recipientsStr = groups.length + ' Groups and ' + (totalCount - groups.length) + ' Users';
      if (groups.length === 0 && totalCount - groups.length === 0) {
         recipientsStr = '';
         mode = BundleRecipientType.NONE;
      } else if (groups.length === 0 && totalCount - groups.length > 0) {
        recipientsStr = (totalCount - groups.length) + ' Users';
        mode = BundleRecipientType.USER;
      } else if (groups.length > 0 && totalCount - groups.length === 0) {
        recipientsStr = groups.length + ' Groups';
        mode = BundleRecipientType.GROUP;
      }
      return _.assign(bundle, {recipientType: mode, expand: true, recipientStr: recipientsStr});
    });

    console.log(bundles);
    this.setState({
      currentBundleList: bundles
    });

    this.updateData(bundles, this.gridOptions);
  }

  componentWillReceiveProps(nextProps: any) {
    console.log('bundle list receive props');
    if (nextProps.includedIds == this.props.includedIds){
      return;
    }
    if (nextProps.includedIds && this.props.includedIds && nextProps.includedIds.length === this.props.includedIds.length){
      return;
    }
    console.log('bundle list process');
    // if (nextProps.includedIds && nextProps.includedIds.length !== this.props.includedIds.length) {
      this.processBundleList(this.state.allBundleList, nextProps.includedIds, nextProps.excludedIds);
    // }
  }

  handleNewBundlesAdded = (selections:[]) => {
    this.props.handleAdd(selections);
  }

  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log(event.api.getSelectedNodes());
    var selections = event.api.getSelectedNodes();
    selections = selections.map(o=>o.data);
    this.props.handleSelection(selections);
  }

  getContextMenuItems = (params: GetContextMenuItemsParams) => {
    console.log(params);
    if (!this.props.allowDelete || params.api.getSelectedNodes().length === 0) {
      return [];
    }

    const handleClickDelete = () => {
      var selections = params.api.getSelectedNodes();
      selections = selections.map(o=>o.data);
      this.props.handleDeletion(selections);
    };

    var result = [
    {
      name: 'Remove from application',
      action: handleClickDelete
    }];
    return result;
  }

  isRowSelectable(node: RowNode) {
    return node.group;
  }

  getCheckboxEnabled(params: CheckboxSelectionCallbackParams) {
    console.log(params);
    return params.node.group === true;
  }

  gridOptions = {
    components: { bundleGroupCellInnerRenderer: getHomeScreenBundleListGroupCellInnerRenderer()},
    rowHeight: 35,
    headerHeight:35,
    defaultColDef: {
      flex: 0,
      minWidth: 120,
      resizable: false,
      sortable: true,
      menuTabs: [] as string[]
    },

    autoGroupColumnDef: {
      flex: 1,
      minWidth: 280,
      field: 'name',
      headerName: 'Content',
      checkboxSelection: this.getCheckboxEnabled,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        innerRenderer: 'bundleGroupCellInnerRenderer',
    }},
    treeData: true,

    isServerSideGroup: function (dataItem: any) {
      // indicate if node is a group
      return dataItem.expand;
    },

    getServerSideGroupKey: function (dataItem: any) {
      // specify which group key to use
      return dataItem.bundleId;
    },

    rowModelType: 'serverSide',
    serverSideStoreType: 'full',
    suppressAggFuncInHeader: true,
    rowMultiSelectWithClick: true,
    rowSelection: 'multiple',
    animateRows: true,
    onGridReady: this.onGridReady,
    getContextMenuItems: this.getContextMenuItems,
    onSelectionChanged: this.onSelectionChanged,
    isRowSelectable: this.isRowSelectable,
    icons: {
      // use some strings from group
      groupExpanded: '<span class="ag-icon ag-icon-small-down"/>',
      groupContracted: '<span class="ag-icon ag-icon-small-right"/>'
    },
  
    columnDefs: [
        {field: 'name', rowGroup: true, hide: true},
        {field: 'recipientStr', headerName: 'Recipients', cellRenderer: (params: any) => {
          const userGroupImg = require('../images/bundleUserGroup.png');
          const userImg = require('../images/bundleUser.png');
          if (params.node.group) {
            if (params.node.data.recipientType === BundleRecipientType.GROUP) {
              return `<img class="content-bundle-list-container-item-group" src=${userGroupImg}/><span style="color: #35383a;; padding: 4px; font-size: 12px">${params.value}</span>`;
              // return `<span class="icon-group2" style="color: #3492ed; font-size: 11px" /><span style="color: #35383a;; padding: 8px; font-size: 12px">${params.value}</span>`;
            } else if (params.node.data.recipientType === BundleRecipientType.USER) {
              return `<img class="content-bundle-list-container-item-user" src=${userImg}/><span style="color: #35383a; padding: 4px; font-size: 12px">${params.value}</span>`;
              // return `<span class="icon-user-profile" style="color: #3492ed; font-size: 14px" /><span style="color: #35383a; padding: 6px; font-size: 12px">${params.value}</span>`;
            } else if (params.node.data.recipientType === BundleRecipientType.BOTH) {
              return `<img class="content-bundle-list-container-item-user" src=${userImg}/><img class="content-bundle-list-container-item-group2" src=${userGroupImg}/><span style="color: #35383a; padding: 4px; font-size: 12px">${params.value}</span>`;
              // return `<span class="icon-user-profile" style="color: #3492ed; font-size: 14px" /><span class="icon-user-profile" style="color: #3492ed; font-size: 14px" /><span style="color: #35383a; padding: 6px; font-size: 12px">${params.value}</span>`;
            } else {
              return '';
            }
          } else {
            return '    - -';
          }}
        }
    ]
  };

  handleAddContent = () => {
    this.setState({
      showBundlePicker: true
    });
  }

  handleSearch = (value: string) => {
    //filter on name in allBundleList
    this.setState({
      currentBundleList: []
    });
  }

  handleClosePicker = () => {
    this.setState({
      showBundlePicker: false
    });
  }

  // getBundleIconWithNameColor = (name: string, color: number) => {
  //   const iconClass = classNames(
  //     'mstr-ws-icons-copy',
  //     'icon-bundle-group'
  //   );
  //   return <div className = "content-bundle-list-name-icon"><span className={iconClass} color={color.toString()}/>{name}</div>;
  // }

  // getUserIconWithNameColor = (name: string) => {
  //   const iconClass = classNames(
  //     'mstr-ws-icons-copy',
  //     'icon-user-group'
  //   );
  //   return <div className = "content-bundle-list-user-icon"><span className={iconClass}/>{name}</div>;
  // }

  // handleSelectionChange = (selection: {}) => {
  //   console.log("test");
  //   console.log(selection);
  //   const selections = _.values(selection);
  //   console.log(selections);
  //   this.props.handleSelection(selections);
  // }

  renderAddContent = () => {
    return (
      <div className = "content-bundle-list-container-add-content">
        <span className="icon-pnl_add-new"
          onClick={() => {
            this.handleAddContent();
          }}
        />
        <span className="content-bundle-list-container-add-text">
          Add Content
        </span>
      </div>
    );
  }

  renderEmptyView = () => {
    const bookmarksImg = require('../images/emptyFolder.png');
    return (
      <div className = "content-bundle-list-container-empty">
        <img className="content-bundle-list-container-empty-img" src={bookmarksImg}/>
        <div className="content-bundle-list-container-empty-desc">
          Add content bundles to this application
        </div>
        <div className="content-bundle-list-container-empty-add">
          <span className= "icon-pnl_add-new" onClick={this.handleAddContent}/>
          <span className="content-bundle-list-container-empty-add-text">
            Add Content
          </span>
        </div>
      </div>
    );
  }

  render() {
    // const getContextMenuItems1 = (selection: SelectionStructure, contextMenuTarget: Record): ContextMenuItem[] => {
    //   if (!this.props.allowDelete) {
    //     return [];
    //   }
    //   const handleClickDelete = () => {
    //     console.log(selection);
    //     console.log(contextMenuTarget);
    //     const selections = _.values(selection);
    //     this.props.handleDeletion(selections);
    //   };
    //   return [
    //     {
    //       "name": "Delete",
    //       "action": handleClickDelete,
    //     }
    //   ];
    // };
    return (
      <div className="content-bundle-list-container" style={{ height: '100%'}}>
        {this.props.allowDelete &&
          <div className="content-bundle-list-container-header">
            <SearchInput className="content-bundle-list-container-search" placeholder="Search"
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}/>
            {this.renderAddContent()}
          </div>
        }
        <div style={{ width: '100%', height: '100%' }}>
          <div id="myGrid" style={{ height: '100%', width: '100%'}} className="ag-theme-alpine">
              <AgGridReact gridOptions={this.gridOptions}>
              </AgGridReact>
              {/* <ReactWsGrid gridOptions={gridOptions} columnDefs={gridOptions.columnDefs}/> */}
          </div>
        </div>
        <ContentBundlePicker handleClose={this.handleClosePicker} visible={this.state.showBundlePicker} handleBundlesAdd={this.handleNewBundlesAdded}/>
        {this.props.allowDelete && this.state.currentBundleList && this.state.currentBundleList.length === 0 && this.renderEmptyView()}
        {/* <ReactWindowGrid
          columnDef={[
            {
              field: 'nameWithIcon',
              headerName: 'Content',
              sortable: false,
              width: '65%'
            },
            {
              field: 'userWithIcon',
              headerName: 'Recipients',
              width: '35%',
              sortable: false
            }
          ]}
          rowData={this.state.currentBundleList}
          isColumnConfigurable={false}
          onSelectionChanged={this.handleSelectionChange}
          rowSelectable
          getContextMenuItems={getContextMenuItems}
        /> */}
      </div>
    )
  }
}
