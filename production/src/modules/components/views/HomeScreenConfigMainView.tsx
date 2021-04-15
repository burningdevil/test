import * as React from 'react';
import '../scss/HomeScreenConfigMainView.scss';
import { ReactWindowGrid, MSTRWSIcon } from '@mstr/rc';
import HomeScreenConfigEditor from './HomeScreenConfigEditor';


export default class HomeScreenConfigMainView extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      configList: [],
      configEditorVisible: false,
      isEditConfig: false
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    // TODO: Get Config List from rest server.
    this.setState({
      configList: []
    });
  }

  handleDismiss = (visible: boolean) => {
    this.setState({
      configEditorVisible: visible
    })
  }

  render() {
    return (
      <div>
        <div className="add-application-container">
          <MSTRWSIcon
            className="add-application-icon"
            type="msdl-add"
            onClick={() => {
              this.setState({
                configEditorVisible: true,
                isEditConfig: false
              });
            }}
          />
          <span className="story-icon-text">
            Add Application
          </span>
        </div>
        <ReactWindowGrid
          columnDef={[
            {
              field: 'name',
              headerName: 'Name',
              sortable: true,
              width: '10%'
            },
            {
              field: 'platform',
              headerName: 'Platform',
              sortable: true,
              width: '10%'
            },
            {
              field: 'home',
              headerName: 'Home',
              width: '10%',
              sortable: true
            },
            {
              field: 'components',
              headerName: 'Components',
              sortable: false,
              width: '30%'
            },
            {
              field: 'contentBundles',
              headerName: 'Content Bundles',
              sortable: true,
              width: '30%'
            },
            {
              field: 'lastUpdated',
              headerName: 'Date Modified',
              sortable: true,
              width: '10%'
            }
          ]}
          rowData={this.state.configList}
          isColumnConfigurable={true}
        />
        <HomeScreenConfigEditor
          visible={this.state.configEditorVisible}
          isEditConfig={this.state.isEditConfig}
          handleDismiss={this.handleDismiss}
        >
        </HomeScreenConfigEditor>
      </div>
    )
  }
}
