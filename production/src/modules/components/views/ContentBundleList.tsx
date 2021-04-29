import * as React from 'react';
import '../scss/ContentBundleList.scss';
import * as _ from "lodash";
import { ReactWindowGrid, MSTRWSIcon, SearchInput, SelectionStructure, Record } from '@mstr/rc';
import { ContextMenuItem } from '@mstr/rc/types/react-window-grid/type';
import { WorkstationModule, ObjectEditorSettings } from '@mstr/workstation-types';
import classNames from 'classnames';

declare var workstation: WorkstationModule;

export default class ContentBundleList extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      allBundleList: [],
      currentBundleList: []
    }
  }

  async componentDidMount() {
    this.loadData();
    const currentEnv = await workstation.environments.getCurrentEnvironment();
    console.log("Env: " + currentEnv);
    this.setState({
      currentEnv: currentEnv
    });
    
  }

  loadData = async () => {
    // const response = await HttpProxy.get('/contentBundles');
    // const bundlesList = this.constructBundleList(response);
    const bundleList = {
      contentBundles:
      [{
        "color": 100,
        "opacity" : 100,
        "emailEnabled": true,
        "id": "37BE16A411D3E48C1000E787EC6DE8A4",
        "name": "Content Bundle Name",
        "dateCreated": "2001-01-02T20:49:47.000Z",
        "dateModified": "2021-01-07T07:13:59.000Z",
        "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
        "type": 77,
        "recipients":
        [
            {
                "id": "54F3D26011D2896560009A8E67019608",
                "isGroup": true
            },
            {
                "id": "CE132A8447058084F270F5ADA3ED0433",
                "isGroup": false
            }
        ]
      },
      {
        "color": 1000,
        "opacity" : 100,
        "emailEnabled": true,
        "id": "37BE16A411D3E48C1000E787EC6DE8A5",
        "name": "Content Bundle Name2",
        "dateCreated": "2001-01-02T20:49:47.000Z",
        "dateModified": "2021-01-07T07:13:59.000Z",
        "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
        "type": 77,
        "recipients":
        [
            {
                "id": "54F3D26011D2896560009A8E67019608",
                "isGroup": true
            },
            {
                "id": "CE132A8447058084F270F5ADA3ED0433",
                "isGroup": false
            }
        ]
      },
      {
        "color": 1000,
        "opacity" : 100,
        "emailEnabled": true,
        "id": "37BE16A411D3E48C1000E787EC6DE8A6",
        "name": "Content Bundle Name3",
        "dateCreated": "2001-01-02T20:49:47.000Z",
        "dateModified": "2021-01-07T07:13:59.000Z",
        "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
        "type": 77,
        "recipients":
        [
            {
                "id": "54F3D26011D2896560009A8E67019608",
                "isGroup": true
            },
            {
                "id": "CE132A8447058084F270F5ADA3ED0433",
                "isGroup": false
            }
        ]
      },
      {
        "color": 1000,
        "opacity" : 100,
        "emailEnabled": true,
        "id": "37BE16A411D3E48C1000E787EC6DE8A7",
        "name": "Content Bundle Name4",
        "dateCreated": "2001-01-02T20:49:47.000Z",
        "dateModified": "2021-01-07T07:13:59.000Z",
        "owner": {"id": "54F3D26011D2896560009A8E67019608","name": "xyz"},
        "type": 77,
        "recipients":
        [
            {
                "id": "54F3D26011D2896560009A8E67019608",
                "isGroup": true
            },
            {
                "id": "CE132A8447058084F270F5ADA3ED0433",
                "isGroup": false
            }
        ]
      }
      ]
    };
    var contents = bundleList.contentBundles;
    this.setState({
      allBundleList: contents
    });
    this.processBundleContents(contents, this.props.includedIds, this.props.excludedIds);
    
  }

  processBundleContents(contents: [], includedIds:[], excludedIds:[]) {
    console.log('includedIds');
    console.log(includedIds);
    //filter list by ids
    if (includedIds && includedIds.length) {
      contents = contents.filter((bundle)=>{
        if(_.indexOf(includedIds, bundle.id) >= 0 ) {
          return bundle;
        }});
    }

    if (excludedIds && excludedIds.length) {
      contents = contents.filter((bundle)=>{
        if(_.indexOf(excludedIds, bundle.id) >= 0 ) {
          return bundle;
        }});
    }

    contents = contents.map((bundle) => {
      return _.assign(bundle, {nameWithIcon: this.getBundleIconWithNameColor(bundle.name, bundle.color)});
    });

    contents = contents.map((bundle) => {
      const recipients = bundle.recipients;
      const totalCount = recipients.length;
      const groups = recipients.filter(user => (user.isGroup));
      const recipientsStr = groups.length + ' Groups and ' + (totalCount - groups.length) + ' Users';
      return _.assign(bundle, {userWithIcon: this.getUserIconWithNameColor(recipientsStr)});
    });

    console.log(contents);
    this.setState({
      currentBundleList: contents
    });
  }

  componentWillReceiveProps(nextProps:{}) {
    console.log('bundle list receive props');
    if (nextProps.includedIds == this.props.includedIds){
      return;
    }
    if (nextProps.includedIds && this.props.includedIds && nextProps.includedIds.length === this.props.includedIds.length){
      return;
    }
    console.log('bundle list process');
    // if (nextProps.includedIds && nextProps.includedIds.length !== this.props.includedIds.length) {
      this.processBundleContents(this.state.allBundleList, nextProps.includedIds, nextProps.excludedIds);
    // }
  }

  getBundleIconWithNameColor = (name: string, color: number) => {
    const iconClass = classNames(
      'mstr-ws-icons-copy',
      'icon-bundle-group'
    );
    return <div className = "content-bundle-list-name-icon"><span className={iconClass} color={color.toString()}/>{name}</div>;
  }

  getUserIconWithNameColor = (name: string) => {
    const iconClass = classNames(
      'mstr-ws-icons-copy',
      'icon-user-group'
    );
    return <div className = "content-bundle-list-user-icon"><span className={iconClass}/>{name}</div>;
  }

  handleSearch = (value: string) => {
    //filter on name in allBundleList
    this.setState({
      currentBundleList: []
    });
  }

  handleSelectionChange = (selection: {}) => {
    console.log("test");
    console.log(selection);
    const selections = _.values(selection);
    console.log(selections);
    this.props.handleSelection(selections);
  }

  handleAddContent = async () => {
    console.log("Env: " + this.state.environmentURL);           
    const options: ObjectEditorSettings = {
      objectType: 'ContentBundleObject',
      environment: this.state.currentEnv
    }
    workstation.dialogs.openObjectEditor(options).catch(e =>
      workstation.dialogs.error({
          message: 'Open object editor failed with error',
          additionalInformation: JSON.stringify(e)
      })
    )
  }

  renderAddContent = () => {
    return (
      <div className = "content-bundle-add-content">
        <MSTRWSIcon
          className="content-bundle-list-add-icon"
          type="msdl-add"
          onClick={() => {
            this.handleAddContent();
          }}
        />
        <span className="content-bundle-list-add-text">
          Add Content
        </span>
      </div>
    );
  }

  render() {
    const getContextMenuItems = (selection: SelectionStructure, contextMenuTarget: Record): ContextMenuItem[] => {
      if (!this.props.allowDelete) {
        return [];
      }
      const handleClickDelete = () => {
        console.log(selection);
        console.log(contextMenuTarget);
        const selections = _.values(selection);
        this.props.handleDeletion(selections);
      };
      return [
        {
          "name": "Delete",
          "action": handleClickDelete,
        }
      ];
    };
    return (
      <div className="content-bundle-list-container">
        <div className="content-bundle-list-container-header">
          <SearchInput className="content-bundle-list-search"
              onChange={(value: string) => {
                this.handleSearch(value);
              }}/>
          {this.props.includedIds && this.props.includedIds.length > 0 && this.renderAddContent()}
        </div>
        <ReactWindowGrid
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
        />
      </div>
    )
  }
}
