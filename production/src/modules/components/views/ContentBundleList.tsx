import * as React from 'react';
import '../scss/ContentBundleList.scss';
import ContentBundlePicker from './ContentBundlePicker'
import * as _ from "lodash";
import { SearchInput, Input, Tooltip } from '@mstr/rc';
import { ObjectEditorSettings, PropertiesSettings, WorkstationModule } from '@mstr/workstation-types';
import { HttpProxy } from '../../../main';
import { AgGridReact } from 'ag-grid-react';
import CONSTANTS, { default as VC, BundleInfo, iconTypes, BundleRecipientType, localizedStrings, CONTENT_BUNDLE_DEFAULT_GROUP_NAME } from '../HomeScreenConfigConstant'
import { PlusCircleOutlined, DownOutlined, EnterOutlined } from '@ant-design/icons'
import { HomeScreenBundleListDatasource, getHomeScreenBundleListGroupCellInnerRenderer, validName } from './HomeScreenUtils'
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
import { selectContentBundleList, selectContentLoadingFinish, selectDefaultGroupsName } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator'
import Constatnt from '../HomeScreenConfigConstant'
import * as api from '../../../services/Api';
import { t } from '../../../i18n/i18next';
import CustomHeader from '../common-components/ag-grid-components/custom-header/custom-header';

declare var workstation: WorkstationModule;
var searchName = '';
var currentProjs: Array<string> = [];
const classNamePrefix = 'content-bundle-list-container';
const rowSelectionType = 'multiple';
const rowModelType = 'serverSide';
const imgUser = require('../images/bundleUser.png');
const imgGroup = require('../images/bundleUserGroup.png');

function FakeHomeScreenBundleListServer(allData: BundleInfo[]) {
  return {
    getData: function (params: IServerSideGetRowsParams) {
      var results: any[] = [];
      var filterData = searchName === '' ? allData : _.filter(allData, function (o) { return o.name.toLocaleLowerCase?.().includes(searchName?.toLocaleLowerCase?.()); });
      var lastRow: number = filterData.length;
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
            var arr = Object.keys(contents).reduce(function (res, v) {
              return res.concat(contents[v]);
            }, []);
            results = arr.map(function (d) {
              return {
                name: d.name,
                expand: false,
                viewMedia: d.viewMedia,
                certified: d.isCertified
              };
            });
            lastRow = arr.length;
          })
          .then(() => {
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
      showEmptyView: false,
      nameFilter: '',
      currentEnv: null
    };
  }

  updateData = (data: BundleInfo[], params: any) => {
    var fakeServer = FakeHomeScreenBundleListServer(data);
    var datasource = HomeScreenBundleListDatasource(fakeServer);
    params.api.setServerSideDatasource(datasource);
  };

  onGridReady = (params: GridReadyEvent) => {
    this.updateData(this.state.currentBundleList, params);
    window.addEventListener('scroll', () => {
      if(this.gridOptions?.api){
        this.gridOptions.api.hidePopupMenu();
      }
    })
  };

  async componentDidMount() {
    api.loadContentBundleList();
    this.processBundleList(this.props.allBundleList, this.props.includedIds, this.props.excludedIds);
    
    const loadProjects = async () => {
      const projects = await api.loadAllProjects();
      currentProjs = projects?.map((o: any) => o.id);
    }
    const loadSelectedProjects = async (err: any) => {
      console.info('loaded all projects failed, so using the selected projects instead');
      const currentEnv = await workstation.environments.getCurrentEnvironment();
      currentProjs = currentEnv.projects.map(o => o.id);
    }
    loadProjects().catch(loadSelectedProjects);
    const currentEnv = await workstation.environments.getCurrentEnvironment();
      this.setState({
        currentEnv
      })
    
    

  }

  processBundleList(bundles: BundleInfo[], includedIds: string[], excludedIds: string[]) {
    if (includedIds && this.props.allowDelete) {
      bundles = bundles.filter((bundle) => {
        if (_.indexOf(includedIds, bundle.id) >= 0) {
          return bundle;
        }
      });
    }

    if (excludedIds?.length) {
      bundles = bundles.filter(bundle => !excludedIds.includes(bundle.id));
    }

    bundles = bundles.map((bundle) => {
      const recipients = bundle.recipients;
      const totalCount = recipients.length;
      const groups = recipients.filter(user => (user.group));
      let mode = BundleRecipientType.BOTH;
      const groupsCount = groups.length
      const usersCount = totalCount - groupsCount
      let recipientsStr = '';
      if (groups.length === 0 && totalCount - groups.length === 0) {
        mode = BundleRecipientType.NONE;
      } else if (groups.length === 0 && totalCount - groups.length > 0) {
        recipientsStr = t('usersCount', { count: usersCount });
        mode = BundleRecipientType.USER;
      } else if (groups.length > 0 && totalCount - groups.length === 0) {
        recipientsStr = t('groupsCount', { count: groupsCount });
        mode = BundleRecipientType.GROUP;
      } else {
        recipientsStr = `${t('groupsCount', { count: groupsCount })} ${localizedStrings.AND} ${t('usersCount', { count: usersCount })}`
      }
      return _.assign(bundle, { recipientType: mode, expand: true, recipientStr: recipientsStr });
    });

    this.setState({
      currentBundleList: bundles
    });
    this.gridOptions.cacheBlockSize = Math.max(this.gridOptions.cacheBlockSize, bundles.length);
    this.updateData(bundles, this.gridOptions);
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.nameFilter !== this.props.nameFilter) {
      this.handleSearch(nextProps.nameFilter);
      return;
    }
    if (nextProps.allBundleList && this.props.allBundleList && nextProps.allBundleList.length !== this.props.allBundleList.length) {
      this.processBundleList(nextProps.allBundleList, nextProps.includedIds, nextProps.excludedIds);
      return;
    }
    if (nextProps.includedIds == this.props.includedIds) {
      return;
    }
    if (nextProps.includedIds && this.props.includedIds && nextProps.includedIds.length === this.props.includedIds.length) {
      return;
    }
    // if (nextProps.includedIds && nextProps.includedIds.length !== this.props.includedIds.length) {
    this.processBundleList(this.props.allBundleList, nextProps.includedIds, nextProps.excludedIds);
    // }
  }

  handleNewBundlesAdded = (selections: []) => {
    this.props.handleAdd(selections);
    this.handleSearch('');
  }

  onSelectionChanged = (event: SelectionChangedEvent) => {
    var selections = event.api.getSelectedNodes();
    selections = selections.map(o => o.data);
    this.props.handleSelection(selections);
  }

  getContextMenuItems = (params: GetContextMenuItemsParams) => {
    if(!params.node?.isSelected() && params.api?.getSelectedNodes().length > 0){
      params.api?.getSelectedNodes().forEach(node => node.setSelected(false));
    }
    if (!this.props.allowDelete || !params.node || !params.node.group) {
      return [];
    }

    const handleClickDelete = () => {
      var selections = params.api.getSelectedNodes();
      selections = selections.map(o => o.data);
      if(selections?.length === 0){
        selections = [params.node.data];
      }
      this.props.handleDeletion(selections);
      params.api.deselectAll();
      params.api.clearFocusedCell();
    };
    const handleEditContentGroup = () => {
      
      const contextMenuTarget = params.node.data;
      const objType = CONSTANTS.CONTENT_EDITOR_OBJTYPE;
      const bundles = this.props.allBundleList.map((bundle: BundleInfo) => ({
        id: bundle.id,
        name: bundle.name
      }));
      const allProjects = this.state.currentEnv?.projects?.reduce((acc: { [key: string]: any }, cur: any) => {
        acc[cur.id] = { id: cur.id, name: cur.name }
        return acc
      }, {})
      let options: ObjectEditorSettings = {
        objectId: contextMenuTarget.id,
        objectType: objType,
        environment: this.state.currentEnv,
        extraContext: JSON.stringify({ bundles, allProjects })
      }

      workstation.dialogs.openObjectEditor(options).catch(e => workstation.dialogs.error({
        message: t('openContentGroupEditorError'),
        additionalInformation: JSON.stringify(e)
      }))
    }
    const handleClickInfo = () => {
      const contextMenuTarget = params.node.data;
      const bundleObject: any = {
        id: contextMenuTarget.id,
        name: contextMenuTarget.name,
        type: 77,
        subType: 19712 // DssSubTypeContentBundle = 0x4d00
      }
      const options: PropertiesSettings = {
        objects: [bundleObject],
        environment: this.state.currentEnv,
        tabId: '0'
      }

      workstation.dialogs.openProperties(options).catch((e) =>
          workstation.dialogs.error({
              message: t('openObjectPropertiesError'),
              additionalInformation: JSON.stringify(e),
          })
      );
  };
    var result: any[] = [
      {
        name: localizedStrings.REMOVE_BUNDLE,
        action: handleClickDelete
      }
    ];
    if(params.api.getSelectedNodes().length > 1){
      result.unshift(
        {
          name: t('selectedStr', { bundlesCount: params.api.getSelectedNodes().length}),
          action: () => {},
          disabled: true
        }
      )
    }else{
      result = [
        {
          name: localizedStrings.EDIT,
          action: handleEditContentGroup
        },
        {
          name: localizedStrings.PROPERTIES,
          action: handleClickInfo
        }
      ].concat(result)
    }
    return result;
  }

  isRowSelectable(node: RowNode) {
    return node.group;
  }

  getCheckboxEnabled(params: CheckboxSelectionCallbackParams) {
    return params.node.group === true;
  }

  gridOptions: GridOptions = {
    frameworkComponents: {agColumnHeader: CustomHeader},
    rowHeight: 35,
    headerHeight: 35,
    defaultColDef: {
      flex: 1,
      minWidth: 120,
      resizable: false,
      sortable: false,
      menuTabs: [] as string[]
    },

    autoGroupColumnDef: {
      flex: 3,
      minWidth: 280,
      field: VC.NAME,
      resizable: true,
      headerName: localizedStrings.CONTENT,
      checkboxSelection: this.getCheckboxEnabled,
      headerComponentParams: { enableCheck: true },
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: getHomeScreenBundleListGroupCellInnerRenderer,
      }
    },
    treeData: true,
    cacheBlockSize: 100,
    isServerSideGroup: function (dataItem: any) {
      // indicate if node is a group
      return dataItem.expand;
    },

    getServerSideGroupKey: function (dataItem: any) {
      // specify which group key to use
      return dataItem.bundleId;
    },

    rowModelType: rowModelType,
    serverSideStoreType: ServerSideStoreType.Partial,
    suppressAggFuncInHeader: true,
    rowMultiSelectWithClick: true,
    rowSelection: rowSelectionType,
    animateRows: true,
    onGridReady: this.onGridReady,
    getContextMenuItems: this.getContextMenuItems,
    onSelectionChanged: this.onSelectionChanged,
    isRowSelectable: this.isRowSelectable,
    onBodyScroll: () => {this.gridOptions.api.hidePopupMenu()},
    icons: {
      // use some strings from group
      groupExpanded: `<span class='ag-icon ag-icon-small-down'/>`,
      groupContracted: `<span class='ag-icon ag-icon-small-right'/>`
    },
    pagination: false,

    columnDefs: [
      { field: VC.NAME, rowGroup: true, hide: true },
      {
        field: VC.CERTIFIED,
        sortable: false,
        maxWidth: 100,
        headerName: localizedStrings.CERTIFIED,
        cellRendererFramework: (params: any) => {
          const data = params.data;
          if (data.certified) {
            return (
              <span
                className={VC.FONT_CERTIFIED}
                style={{ color: '#FF6214', fontSize: '14px' }}
              />
            );
          } else {
            return '';
          }
        },
      },
      {
        field: VC.RECIPIENT_STR, headerName: localizedStrings.RECIPIENTS, 
        cellRendererFramework: (params: any) => {
          const d = params.data;
          if (!params.node.group){
            return '    - -';
          }
          if (params.node.data.recipientType === BundleRecipientType.GROUP) {
            return (
              <span>
                  <img className="content-bundle-list-container-item-group" src={imgGroup}/>
                  <span className="content-bundle-list-container-item-text">{params.value}
                  </span>
              </span>
              
            )
          } else if(params.node.data.recipientType === BundleRecipientType.USER){
            return (
              <span>
                  <img className="content-bundle-list-container-item-user" src={imgUser}/>
                  <span className="content-bundle-list-container-item-text">{params.value}
                  </span>
              </span>
            )
          } else if(params.node.data.recipientType === BundleRecipientType.BOTH) {
            return (
              <span>
                <img className="content-bundle-list-container-item-user" src={imgUser}/>
                <img className="content-bundle-list-container-item-group2" src={imgGroup}/>
                <span className="content-bundle-list-container-item-text">{params.value}</span>
            </span>
            )
          } else {
            return ''
          }
        },
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
    let update = {};
    update = { [Constatnt.DEFAULT_GROUPS_NAME]: name }
    update = { [Constatnt.HOME_LIBRARY]: update }
    update = { [Constatnt.HOME_SCREEN]: update }
    this.props.updateCurrentConfig(update)
  }

  renderPopoverContent = () => {
    const title = <div> {localizedStrings.DEFAULT_GROUPS_TIP} </div>
    const sidebarIcons = [iconTypes.all, iconTypes.favorites, iconTypes.recents, iconTypes.mySubscribe, iconTypes.defaultGroup]
      .map((element, index) => {
        const showAddButton = iconTypes.myGroup.key === element.key
        const showExpandIcon = iconTypes.myGroup.key === element.key || iconTypes.defaultGroup.key === element.key
        const showContent = iconTypes.defaultGroup.key === element.key;
        let defaultGroupName = localizedStrings.DEFAULT_GROUPS;
        if(this.props.defaultGroupsName && this.props.defaultGroupsName !== CONTENT_BUNDLE_DEFAULT_GROUP_NAME){
          defaultGroupName = this.props.defaultGroupsName
        }
        return (
          <div style={{ display: 'relative' }}>
            <div className={`${classNamePrefix}-popover-text`}> <span className={element.iconName} key={index} />
              <span className = 'overflow'>{showExpandIcon ? defaultGroupName : element.displayText}</span>
              {showAddButton && <PlusCircleOutlined />}
              {showExpandIcon && <DownOutlined style={{ fontSize: '5px', marginLeft: 'auto', marginRight: '4px' }} />}
            </div>
            {showContent && <div className={`${classNamePrefix}-popover-blank`}>
              <div className={`${classNamePrefix}-popover-blank-fill`} />
            </div>}
            {showContent && <div className={`${classNamePrefix}-popover-blank`}>
              <div className={`${classNamePrefix}-popover-blank-fill`} />
            </div>}
            {showContent && <div className={`${classNamePrefix}-popover-blank`}>
              <div className={`${classNamePrefix}-popover-blank-fill`} />
            </div>}
            <EnterOutlined style={{ position: 'absolute', left: '120px', top: '110px', fontSize: '30px', color: 'gray' }} />
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
    const msgInfoID = 'contentBundleListMsgInfoID';
    const defaultGroupName = this.props.defaultGroupsName === CONTENT_BUNDLE_DEFAULT_GROUP_NAME ? localizedStrings.DEFAULT_GROUPS : this.props.defaultGroupsName;
    return (
      <div className={`${classNamePrefix}-title`}>
        {localizedStrings.DEFAULT_GROUPS_TITLE}
        <Tooltip
          title={this.renderPopoverContent()}
          placement='rightTop'
          onVisibleChange={(visible) =>
            document.getElementById(msgInfoID).style.color = visible ? '#3492ed' : 'gray'
          }
        >
          <span className={VC.FONT_MSG_INFO} id={msgInfoID}> </span>
        </Tooltip>
        <Input
          placeholder={localizedStrings.DEFAULT_GROUPS}
          value={defaultGroupName}
          onValidate = {(e: string) => {
            return validName(e);
          }}
          maxLength={80}
          errorMessage = {localizedStrings.INVALID_CHARACTER_APP_NAME_ERROR}
          isErrorDisplayed = 'true'
          onChange={(e: any) => this.handleChangeDefaultGroupsName(e.target.value)}
        />
      </div>
    )
  }
  renderAddContent = () => {
    return (
      <div className={`${classNamePrefix}-add-content unselectable`} onClick={() => {
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
      <div className={`${classNamePrefix}-empty`}>
        <img className={`${classNamePrefix}-empty-img`} src={bookmarksImg} />
        <div className={`${classNamePrefix}-empty-desc`}>
          {localizedStrings.ADD_CONTENT_BUNDLES}
        </div>
        <div className={`${classNamePrefix}-empty-add`} onClick={this.handleAddContent}>
          <span className={VC.FONT_ADD_NEW} />
          <span className={`${classNamePrefix}-empty-add-text`}>
            {localizedStrings.ADD_CONTENT}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const containerHeight = this.props.allowDelete ? 'calc(100% - 100px)' : '100%'
    return (
      <div className={`${classNamePrefix}`} style={{ height: '100%' }}>
        {this.props.allowDelete && this.renderChangeNameField()}
        {this.props.allowDelete &&
          <div className={`${classNamePrefix}-header`}>
            <SearchInput value={this.state.nameFilter} className={`${classNamePrefix}-search`} placeholder={localizedStrings.SEARCH}
              onChange={(value: string) => {
                this.handleSearch(value);
              }}
              onClear={() => {
                this.handleSearch('');
              }} />
            {this.renderAddContent()}
          </div>
        }
        <div style={{ width: '100%', height: containerHeight, position: 'relative' }}>
          <div id='bundleListGrid' style={{ height: '100%', width: '100%' }} className='ag-theme-alpine'>
            <AgGridReact gridOptions={this.gridOptions}>
            </AgGridReact>
            {this.props.allowDelete && this.props.loadFinished  && !this.state.currentBundleList?.length && this.renderEmptyView()}
          </div>
        </div>
        <ContentBundlePicker handleClose={this.handleClosePicker} visible={this.state.showBundlePicker} handleBundlesAdd={this.handleNewBundlesAdded} />
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  allBundleList: selectContentBundleList(state),
  defaultGroupsName: selectDefaultGroupsName(state),
  loadFinished: selectContentLoadingFinish(state)
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(ContentBundleList)
