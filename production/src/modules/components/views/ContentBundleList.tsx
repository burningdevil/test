import * as React from 'react';
import '../scss/ContentBundleList.scss';
import ContentBundlePicker from './ContentBundlePicker'
import * as _ from "lodash";
import { SearchInput, Input, Tooltip } from '@mstr/rc';
import { WorkstationModule } from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import {AgGridReact} from 'ag-grid-react';
import { BundleInfo, iconTypes } from '../HomeScreenConfigConstant'
import { PlusCircleOutlined, DownOutlined, FallOutlined } from '@ant-design/icons'
import { BundleRecipientType, HomeScreenBundleListDatasource, getHomeScreenBundleListGroupCellInnerRenderer } from './HomeScreenUtils'
import {
  GridReadyEvent,
  SelectionChangedEvent,
  GetContextMenuItemsParams,
  IServerSideGetRowsParams,
  CheckboxSelectionCallbackParams,
  RowNode,
  GridOptions,
  ServerSideStoreType,
} from 'ag-grid-community'
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';;
import { connect } from 'react-redux';
import { selectContentBundleList, selectDefaultGroupsName } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator'
import Constatnt from '../HomeScreenConfigConstant'
import * as api from '../../../services/api';
import { t } from '../../../i18n/i18next';

declare var workstation: WorkstationModule;
var searchName = '';

function FakeHomeScreenBundleListServer(allData: BundleInfo[]) {
  return {
      getData: function (params: IServerSideGetRowsParams) {
      var results: any[] = [];
      var filterData = searchName === '' ? allData : _.filter(allData, function(o) { return o.name.includes(searchName); });
      var lastRow: number = allData.length;
      if (params.request.groupKeys.length === 0) {
          results = filterData.map(function (d) {
          return {
              name: d.name,
              recipientStr: d.recipientStr,
              bundleId: d.id,
              color: d.color,
              id: d.id,
              expand: d.expand,
              recipientType: d.recipientType
          };
          });

          return {
          success: true,
          rows: results,
          lastRow: lastRow
          };
      } else {
          var key = params.request.groupKeys[0];
          HttpProxy.get('/contentBundles/'+ key + '/contents?projectId=B7CA92F04B9FAE8D941C3E9B7E0CD754&projectId=5FDF3E5C4CCB76AA7E3292A4C47DECB8')
          .then((response: any) => {
              let contents = response;
              if (response && response.data) {
              contents = response.data;
              }
              var arr = Object.keys(contents).reduce(function(res, v) {
              return res.concat(contents[v]);
              }, []);
              results = arr.map(function (d) {
              return {
                  name: d.name,
                  expand: false,
                  viewMedia: d.viewMedia
              };
              });
              lastRow = arr.length;
          })
          .then (()=>{
              params.successCallback(results, lastRow);
          })
          // .catch((e: any) => (console.log(e)));
      }
      },
  };
}

class ContentBundleList extends React.Component<any, any> {
  searchNode: any;
  constructor(props: any) {
    super(props)
    this.state = {
      // allBundleList: [],
      currentBundleList: [],
      showBundlePicker: false,
      nameFilter: ''
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
    api.loadContentBundleList();
    this.processBundleList(this.props.allBundleList, this.props.includedIds, this.props.excludedIds);
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    console.log("Env: " + currentEnv);
    this.setState({
      currentEnv: currentEnv
    });
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

    bundles = bundles.map((bundle) => {
      const recipients = bundle.recipients;
      const totalCount = recipients.length;
      const groups = recipients.filter(user => (user.group));
      let mode = BundleRecipientType.BOTH;
      const groupsCount = groups.length
      const usersCount = totalCount - groupsCount
      let recipientsStr = t('recipentsStr', {groupsCount, usersCount});
      if (groups.length === 0 && totalCount - groups.length === 0) {
         recipientsStr = '';
         mode = BundleRecipientType.NONE;
      } else if (groups.length === 0 && totalCount - groups.length > 0) {
        recipientsStr = t('recipentsStrOnlyUsers', {usersCount});
        mode = BundleRecipientType.USER;
      } else if (groups.length > 0 && totalCount - groups.length === 0) {
        recipientsStr = t('recipentsStrOnlyGroups', {groupsCount});
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
    if (nextProps.nameFilter !== this.props.nameFilter){
      this.handleSearch(nextProps.nameFilter);
      return;
    }
    if (nextProps.allBundleList && this.props.allBundleList && nextProps.allBundleList.length !== this.props.allBundleList.length){
      this.processBundleList(nextProps.allBundleList, nextProps.includedIds, nextProps.excludedIds);
      return;
    }
    console.log('bundle list receive props');
    if (nextProps.includedIds == this.props.includedIds){
      return;
    }
    if (nextProps.includedIds && this.props.includedIds && nextProps.includedIds.length === this.props.includedIds.length){
      return;
    }
    console.log('bundle list process');
    // if (nextProps.includedIds && nextProps.includedIds.length !== this.props.includedIds.length) {
      this.processBundleList(this.props.allBundleList, nextProps.includedIds, nextProps.excludedIds);
    // }
  }

  handleNewBundlesAdded = (selections:[]) => {
    this.props.handleAdd(selections);
    this.handleSearch('');
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

  gridOptions: GridOptions = {
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
      headerName: t('content'),
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
    serverSideStoreType: ServerSideStoreType.Full,
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
    pagination: false,
  
    columnDefs: [
        {field: 'name', rowGroup: true, hide: true},
        {field: 'recipientStr', headerName: t('recipients'), cellRenderer: (params: any) => {
          if (params.node.group) {
            if (params.node.data.recipientType === BundleRecipientType.GROUP) {
              return '<img class="content-bundle-list-container-item-group" src="../assets/images/bundleUserGroup.png"/><span style="color: #35383a;; padding: 4px; font-size: 12px">' + params.value + '</span>';
            } else if (params.node.data.recipientType === BundleRecipientType.USER) {
              return '<img class="content-bundle-list-container-item-user" src="../assets/images/bundleUser.png"/><span style="color: #35383a; padding: 4px; font-size: 12px">' + params.value + '</span>';
            } else if (params.node.data.recipientType === BundleRecipientType.BOTH) {
              return '<img class="content-bundle-list-container-item-user" src="../assets/images/bundleUser.png"/><img class="content-bundle-list-container-item-group2" src="../assets/images/bundleUserGroup.png"/><span style="color: #35383a; padding: 4px; font-size: 12px">' + params.value + '</span>';
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
    searchName = '';
  }

  handleSearch = (value: string) => {
    //filter on name in allBundleList
    searchName = value;
    this.setState({
      nameFilter: value
    });
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.onFilterChanged();
    // this.setState({
    //   currentBundleList: []
    // });
  }

  handleClosePicker = () => {
    this.setState({
      showBundlePicker: false
    });
  }

  handleChangeDefaultGroupsName = (name: string) => {
    let update = {}
    update = {[Constatnt.DEFAULT_GROUPS_NAME]: name} 
    update = {[Constatnt.HOME_LIBRARY]: update}
    update = {[Constatnt.HOME_SCREEN]: update}
    this.props.updateCurrentConfig(update)
  }

  renderPopoverContent = () => {
      const title = <div> {t('tipOfDefaultGroups')} </div>
      const sidebarIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup]
          .map( (element, index) => {
          const showAddButton = iconTypes.myGroup.key === element.key
          const showExpandIcon = iconTypes.myGroup.key === element.key || iconTypes.defaultGroup.key === element.key
          const showContent = iconTypes.defaultGroup.key === element.key
          return (
              <div style={{display: 'relative'}}>
                  <div className="content-bundle-list-container-popover-text"> <span className={element.iconName} key={index}/> 
                      <span>{element.displayText}</span> 
                      {showAddButton && <PlusCircleOutlined/>}
                      {showExpandIcon && <DownOutlined style={{fontSize: '5px', marginLeft: 'auto', marginRight: '4px'}}/>}
                  </div>
                  {showContent && <div className="content-bundle-list-container-popover-blank">
                      <div className="content-bundle-list-container-popover-blank-fill"/>
                  </div>}
                  {showContent && <div className="content-bundle-list-container-popover-blank">
                      <div className="content-bundle-list-container-popover-blank-fill"/>
                  </div>}
                  {showContent && <div className="content-bundle-list-container-popover-blank">
                      <div className="content-bundle-list-container-popover-blank-fill"/>
                  </div>}
                  <FallOutlined style={{position: 'absolute', left: '110px', top: '100px', fontSize: '30px'}}/>
              </div> 
          )
      })
      // account for mobile
      return (
      <div className='content-bundle-list-container-popover'> 
          {title} 
          <div className="content-bundle-list-container-popover-container"> 
          {sidebarIcons} </div>
      </div>
      )
  }

  renderChangeNameField = () => {
    const msgInfoID = 'contentBundleListMsgInfoID'
    return (
      <div className='content-bundle-list-container-title'>
        {t('defaultGroupsSectionTitle')}
        <Tooltip 
          title={this.renderPopoverContent()}
          placement="rightTop"
          onVisibleChange={(visible) => 
            document.getElementById(msgInfoID).style.color =  visible ? '#3892ed' : 'gray'
          }
        >
        <span className='icon-msg_info' id={msgInfoID}> </span>
        </Tooltip>
        <Input 
        placeholder={t('defaultGroups')}
        value={this.props.defaultGroupsName}
        onChange={(e: any) => this.handleChangeDefaultGroupsName(e.target.value)}
        />
      </div>
    )
  }

  renderAddContent = () => {
    return (
      <div className = "content-bundle-list-container-add-content">
        <span tabIndex={0} aria-label={t('addContentBundlesBtn')} className="icon-pnl_add-new"
          onClick={() => {
            this.handleAddContent();
          }}
        />
        <span className="content-bundle-list-container-add-text">
          {t('addContent')} 
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
          {t('addContentBundles')}
        </div>
        <div className="content-bundle-list-container-empty-add">
          <span className= "icon-pnl_add-new" onClick={this.handleAddContent}/>
          <span className="content-bundle-list-container-empty-add-text">
            {t('addContent')}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const containerHeight = this.props.allowDelete ? 'calc(100% - 60px)' : '100%'
    return (
      <div className="content-bundle-list-container" style={{ height: '100%'}}>
        {this.props.allowDelete && this.renderChangeNameField()}
        {this.props.allowDelete &&
          <div className="content-bundle-list-container-header">
            <SearchInput value={this.state.nameFilter} className="content-bundle-list-container-search" placeholder={t('search')}
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}/>
            {this.renderAddContent()}
          </div>
        }
        <div style={{ width: '100%', height: containerHeight, position: 'relative' }}>
          <div id="myGrid" style={{ height: '100%', width: '100%'}} className="ag-theme-alpine">
              <AgGridReact gridOptions={this.gridOptions}>
              </AgGridReact>
              {/* <ReactWsGrid gridOptions={gridOptions} columnDefs={gridOptions.columnDefs}/> */}
              {this.props.allowDelete && this.state.currentBundleList && this.state.currentBundleList.length === 0 && this.renderEmptyView()}
          </div>
        </div>
        <ContentBundlePicker handleClose={this.handleClosePicker} visible={this.state.showBundlePicker} handleBundlesAdd={this.handleNewBundlesAdded}/>
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  allBundleList: selectContentBundleList(state),
  defaultGroupsName: selectDefaultGroupsName(state),
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(ContentBundleList)
