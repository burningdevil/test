import * as React from 'react'
import '../scss/HomeScreenObjectPicker.scss'
import { Tabs, Button} from 'antd';
import { WorkstationModule } from '@mstr/workstation-types';
import HomeScreenObjectList from './HomeScreenObjectList';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import { t } from '../../../i18n/i18next';

declare var workstation: WorkstationModule;

export const objectCountInBatch = 50;

export const navBar = {
  DOSSIER: 'Dossiers',
  DOCUMENT: 'Documents'
};

const popoverGeneral = {
  width: 1045,
  height: 700,
  headerHeight: 0,
};

export default class HomeScreenObjectPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeKey: '1',
      offset: 0,
      objectList: [],
      totalCount: 0,
      selectedObject: {}
    }
  }

  async componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const currentOffset = this.state.offset;
    const response = await HttpProxy.get('/searches/results?pattern=4&type=14081&getAncestors=false&offset=' + currentOffset + '&limit=' + objectCountInBatch + '&certifiedStatus=ALL');
    let data = response;
    if (response.data) {
      data = response.data;
    }
    if (data && data.result) {
      this.setState({
        objectList: data.result,
        offset: currentOffset + objectCountInBatch,
        totalCount: data.totalItems
      });
    }
    console.log(data);
  }

  tabBarChanged = (key: string) => {
    this.setState({
        activeKey: key
    });
  }

  buttonGroup = () => {
    return (
        <div className="object-picker-popover-btn">
            <Button key="back"
                onClick={this.handleCancel}
            >
                {t('cancel')}
            </Button>
            <Button key="Generate"
                type="primary"
                style={{marginLeft: 10}}
                onClick={this.handleSelectObjects}>
                {t('select')}
            </Button>
        </div>
    );
  };

  handleListChange = (list: []) => {
    const currentList = _.concat(this.state.objectList, list);
    this.setState({
      objectList: currentList
    });
  }

  handleSelectedObjectChange = (selected: object) => {
    this.setState({
      selectedObject: selected
    });
  }

  handleSelectObjects = async () => {
      await workstation.window.postMessage({selectedHomeScreenObject: this.state.selectedObject});
      workstation.window.close();
  }

  handleCancel = () => {
    workstation.window.close();
  }

  render() {
    const bodyHeight = popoverGeneral.height - popoverGeneral.headerHeight;
    return (
      <div className='object-picker-popover-container'>
          <Tabs
              activeKey = {this.state.activeKey}
              onChange={this.tabBarChanged}
              tabPosition="left"
              style={{height: bodyHeight}}
              >
              <Tabs.TabPane tab={navBar.DOSSIER} key="1">
                <HomeScreenObjectList objectList={this.state.objectList} handleChange = {this.handleListChange} totalCount = {this.state.totalCount} handleSelectedObjectChange = {this.handleSelectedObjectChange} objectType = {navBar.DOSSIER}/>
                {this.buttonGroup()}
              </Tabs.TabPane>
              <Tabs.TabPane tab={navBar.DOCUMENT} key="2">
                <HomeScreenObjectList objectList={this.state.objectList} handleChange = {this.handleListChange} totalCount = {this.state.totalCount} handleSelectedObjectChange = {this.handleSelectedObjectChange} objectType = {navBar.DOCUMENT}/>
                {this.buttonGroup()}
              </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
