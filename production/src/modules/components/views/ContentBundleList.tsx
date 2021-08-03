import * as React from 'react';
import '../scss/ContentBundleList.scss';
import ContentBundlePicker from './ContentBundlePicker'
import * as _ from "lodash";
import { SearchInput, Input, Tooltip } from '@mstr/rc';
import { WorkstationModule } from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import {AgGridReact} from 'ag-grid-react';
import { default as VC, BundleInfo, iconTypes, BundleRecipientType, localizedStrings } from '../HomeScreenConfigConstant'
import { PlusCircleOutlined, DownOutlined, FallOutlined } from '@ant-design/icons'
import { HomeScreenBundleListDatasource, getHomeScreenBundleListGroupCellInnerRenderer } from './HomeScreenUtils'
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
import * as api from '../../../services/Api';
import { t } from '../../../i18n/i18next';

declare var workstation: WorkstationModule;
var searchName = '';
var currentProjs: Array<string> = [];
const classNamePrefix = 'content-bundle-list-container';
const rowSelectionType = 'multiple';
const rowModelType = 'serverSide';

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
          HttpProxy.get(api.getApiPathForGetBundleContents(key, currentProjs))
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
      }
      },
  };
}

class ContentBundleList extends React.Component<any, any> {
  searchNode: any;
  constructor(props: any) {
    super(props)
    this.state = {
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
    currentProjs = currentEnv.projects.map(o=>o.id);
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
        recipientsStr = t('usersCount', {usersCount});
        mode = BundleRecipientType.USER;
      } else if (groups.length > 0 && totalCount - groups.length === 0) {
        recipientsStr = t('groupsCount', {groupsCount});
        mode = BundleRecipientType.GROUP;
      }
      return _.assign(bundle, {recipientType: mode, expand: true, recipientStr: recipientsStr});
    });

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
    if (nextProps.includedIds == this.props.includedIds){
      return;
    }
    if (nextProps.includedIds && this.props.includedIds && nextProps.includedIds.length === this.props.includedIds.length){
      return;
    }
    // if (nextProps.includedIds && nextProps.includedIds.length !== this.props.includedIds.length) {
      this.processBundleList(this.props.allBundleList, nextProps.includedIds, nextProps.excludedIds);
    // }
  }

  handleNewBundlesAdded = (selections:[]) => {
    this.props.handleAdd(selections);
    this.handleSearch('');
  }

  onSelectionChanged = (event: SelectionChangedEvent) => {
    var selections = event.api.getSelectedNodes();
    selections = selections.map(o=>o.data);
    this.props.handleSelection(selections);
  }

  getContextMenuItems = (params: GetContextMenuItemsParams) => {
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
      name: localizedStrings.REMOVE_BUNDLE,
      action: handleClickDelete
    }];
    return result;
  }

  isRowSelectable(node: RowNode) {
    return node.group;
  }

  getCheckboxEnabled(params: CheckboxSelectionCallbackParams) {
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
      field: VC.NAME,
      headerName: localizedStrings.CONTENT,
      checkboxSelection: this.getCheckboxEnabled,
      cellRenderer: 'agGroupCellRenderer',
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

    rowModelType: rowModelType,
    serverSideStoreType: ServerSideStoreType.Full,
    suppressAggFuncInHeader: true,
    rowMultiSelectWithClick: true,
    rowSelection: rowSelectionType,
    animateRows: true,
    onGridReady: this.onGridReady,
    getContextMenuItems: this.getContextMenuItems,
    onSelectionChanged: this.onSelectionChanged,
    isRowSelectable: this.isRowSelectable,
    icons: {
      // use some strings from group
      groupExpanded: `<span class='ag-icon ag-icon-small-down'/>`,
      groupContracted: `<span class='ag-icon ag-icon-small-right'/>`
    },
    pagination: false,
  
    columnDefs: [
        {field: VC.NAME, rowGroup: true, hide: true},
        {field: VC.RECIPIENT_STR, headerName: localizedStrings.RECIPIENTS, cellRenderer: (params: any) => {
          if (params.node.group) {
            if (params.node.data.recipientType === BundleRecipientType.GROUP) {
              return '<img class="content-bundle-list-container-item-group" src="../assets/images/bundleUserGroup.png"/><span style="color: #35383a;; padding: 4px; font-size: 12px; font-weight: 400">' + params.value + '</span>';
            } else if (params.node.data.recipientType === BundleRecipientType.USER) {
              return '<img class="content-bundle-list-container-item-user" src="../assets/images/bundleUser.png"/><span style="color: #35383a; padding: 4px; font-size: 12px; font-weight: 400">' + params.value + '</span>';
            } else if (params.node.data.recipientType === BundleRecipientType.BOTH) {
              return '<img class="content-bundle-list-container-item-user" src="../assets/images/bundleUser.png"/><img class="content-bundle-list-container-item-group2" src="../assets/images/bundleUserGroup.png"/><span style="color: #35383a; padding: 4px; font-size: 12px; font-weight: 400">' + params.value + '</span>';
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
    searchName = value;
    this.setState({
      nameFilter: value
    });
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.onFilterChanged();
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
      const title = <div> {localizedStrings.DEFAULT_GROUPS_TIP} </div>
      const sidebarIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.defaultGroup]
          .map( (element, index) => {
          const showAddButton = iconTypes.myGroup.key === element.key
          const showExpandIcon = iconTypes.myGroup.key === element.key || iconTypes.defaultGroup.key === element.key
          const showContent = iconTypes.defaultGroup.key === element.key
          return (
              <div style={{display: 'relative'}}>
                  <div className={`${classNamePrefix}-popover-text`}> <span className={element.iconName} key={index}/> 
                      <span>{showExpandIcon ? this.props.defaultGroupsName : element.displayText}</span> 
                      {showAddButton && <PlusCircleOutlined/>}
                      {showExpandIcon && <DownOutlined style={{fontSize: '5px', marginLeft: 'auto', marginRight: '4px'}}/>}
                  </div>
                  {showContent && <div className={`${classNamePrefix}-popover-blank`}>
                      <div className={`${classNamePrefix}-popover-blank-fill`}/>
                  </div>}
                  {showContent && <div className={`${classNamePrefix}-popover-blank`}>
                      <div className={`${classNamePrefix}-popover-blank-fill`}/>
                  </div>}
                  {showContent && <div className={`${classNamePrefix}-popover-blank`}>
                      <div className={`${classNamePrefix}-popover-blank-fill`}/>
                  </div>}
                  <FallOutlined style={{position: 'absolute', left: '100px', top: '80px', fontSize: '30px', transform: 'rotate(90deg)'}}/>
              </div> 
          )
      })
      // account for mobile
      return (
      <div className={`${classNamePrefix}-popover`}> 
          {title} 
          <div className={`${classNamePrefix}-popover-container`}> 
            {sidebarIcons}
          </div>
      </div>
      )
  }

  renderChangeNameField = () => {
    const msgInfoID = 'contentBundleListMsgInfoID'
    return (
      <div className={`${classNamePrefix}-title`}>
        {localizedStrings.DEFAULT_GROUPS_TITLE}
        <Tooltip 
          title={this.renderPopoverContent()}
          placement='rightTop'
          onVisibleChange={(visible) => 
            document.getElementById(msgInfoID).style.color =  visible ? '#3492ed' : 'gray'
          }
        >
        <span className={VC.FONT_MSG_INFO} id={msgInfoID}> </span>
        </Tooltip>
        <Input 
        placeholder={localizedStrings.DEFAULT_GROUPS}
        value={this.props.defaultGroupsName}
        onChange={(e: any) => this.handleChangeDefaultGroupsName(e.target.value)}
        />
      </div>
    )
  }

  renderAddContent = () => {
    return (
      <div className = {`${classNamePrefix}-add-content`} onClick={() => {
        this.handleAddContent();
      }}>
        <span tabIndex={0} aria-label={localizedStrings.ADD_CONTENT_BUNDLES_TEXT} className={VC.FONT_ADD_NEW}
        />
        <span className={`${classNamePrefix}-add-text`}>
          {localizedStrings.ADD_CONTENT} 
        </span>
      </div>
    );
  }

  renderEmptyView = () => {
    const bookmarksImg = require('../images/emptyFolder.png');
    return (
      <div className = {`${classNamePrefix}-empty`}>
        <img className={`${classNamePrefix}-empty-img`} src={bookmarksImg}/>
        <div className={`${classNamePrefix}-empty-desc`}>
          {localizedStrings.ADD_CONTENT_BUNDLES}
        </div>
        <div className={`${classNamePrefix}-empty-add`} onClick={this.handleAddContent}>
          <span className= {VC.FONT_ADD_NEW}/>
          <span className={`${classNamePrefix}-empty-add-text`}>
            {localizedStrings.ADD_CONTENT}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const containerHeight = this.props.allowDelete ? 'calc(100% - 60px)' : '100%'
    return (
      <div className={`${classNamePrefix}`} style={{ height: '100%'}}>
        {this.props.allowDelete && this.renderChangeNameField()}
        {this.props.allowDelete &&
          <div className={`${classNamePrefix}-header`}>
            <SearchInput value={this.state.nameFilter} className={`${classNamePrefix}-search`} placeholder={localizedStrings.SEARCH}
                onChange={(value: string) => {
                  this.handleSearch(value);
                }}
                onClear={() => {
                  this.handleSearch('');
                }}/>
            {this.renderAddContent()}
          </div>
        }
        <div style={{ width: '100%', height: containerHeight, position: 'relative' }}>
          <div id='bundleListGrid' style={{ height: '100%', width: '100%'}} className='ag-theme-alpine'>
              <AgGridReact gridOptions={this.gridOptions}>
              </AgGridReact>
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
