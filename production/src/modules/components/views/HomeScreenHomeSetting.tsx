import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenHomeSetting.scss'
import { Radio, Button, Layout } from 'antd';
import { env } from '../../../main'
import { RadioChangeEvent } from 'antd/lib/radio';
import * as _ from "lodash";
import { HttpProxy } from '../../../main';
import ContentBundleContentPicker from './ContentBundleContentPicker'
import { WorkstationModule } from '@mstr/workstation-types';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import HomeScreenPreviewer from './HomeScreenPreviewer';
import { default as VC } from '../HomeScreenConfigConstant';
import { t } from '../../../i18n/i18next'

declare var workstation: WorkstationModule;

class HomeScreenHomeSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      showContentPicker: false,
      dossierName: ''
    };
  }

  loadData = async () => {
    const curEnv = await env.environments.getCurrentEnvironment()
    this.setState({
        currentEnv: curEnv
    })
    const { homeScreen } = this.props.config;
    const dossierUrl = _.get(homeScreen, 'homeDocument.url', '');
    if (dossierUrl) {
        const ids = _.split(dossierUrl, '/');
        const projectId = ids[ids.length - 2];
        const dossierId = ids[ids.length - 1];
        const response = await HttpProxy.get('/objects/' + dossierId + '?type=55', {'X-MSTR-ProjectID': projectId}).catch((e: any) => (this.setState({
          dossierName: 'Invalid Dossier'
        })));
        
        let data = response;
        if (response.data) {
          data = response.data;
        }
        this.setState({
            dossierName: data.name
        });
    }
  }

  componentWillMount() {
      this.loadData();
  }

  /* --------------- Below used for select dossier in workstation native way -----------------------*/
  // async componentDidMount() {
  //     workstation.window.addHandler(WindowEvent.POSTMESSAGE, (message: any) => {
  //       console.log(message);
  //       const response = _.get(message, 'Message.selectedHomeScreenObject', '');
  //       if (response) {
  //           const name = response.name;
  //           const id = response.projectId + '/' + response.id;
  //           this.handleDossierChange(name, id);
  //       }
  //       return {
  //           ResponseValue: true
  //       };
  //   });
  // }

  // openDossierPicker = async () => {
  //   console.log("open dossier picker" + this.state.environmentURL);
  //   const options: ObjectSelectorSettings = {
  //     types: ['Dossier', 'Document'],
  //     footerMessage: 'Select a dossier to be used as a home screen.',
  //     excludedIds: []
  //   }
  //   const response = await workstation.dialogs.objectSelector(options).catch(e =>
  //     workstation.dialogs.error({
  //         message: 'Error open object editor.',
  //         additionalInformation: JSON.stringify(e)
  //     })
  //   )
  //   if (response) {
  //     const selectedDossiers = _.get(response, 'selectedObjects', []);
  //     if (selectedDossiers.length) {
  //       const selectedDossier = selectedDossiers[0];
  //       const name = selectedDossier.name;
  //       const id = this.state.currentEnv.url + selectedDossier.projectId + '/' + selectedDossier.id;
  //       this.handleDossierChange(name, id);
  //     }
  //   }
  // }
  /* --------------- Above used for select dossier in workstation native way -----------------------*/

  handleDismissAdd = () => {
    this.setState({
      showContentPicker: false
    });
  }

  openDossierPickerPlugin = async () => {
    // console.log("open dossier picker plugin" + this.state.environmentURL);
    // const objType = 'HomeScreenObject';
    // let options: ObjectEditorSettings = {
    //   objectType: objType,
    //   environment: this.state.currentEnv
    // }
    
    // workstation.dialogs.openObjectEditor(options).catch(e =>
    //   workstation.dialogs.error({
    //       message: 'Error open object editor.',
    //       additionalInformation: JSON.stringify(e)
    //   })
    // )
    this.setState({
      showContentPicker: true
    });
  }

  handleHomeSettingChange = (event: RadioChangeEvent) => {
    this.props.updateCurrentConfig({
      homeScreen: {
        mode: event.target.value
      }
    });
  }

  renderPickDossier = () => {
    const { homeScreen } = this.props.config;
    const dossierUrl = _.get(homeScreen, 'homeDocument.url', '');
    const dossierImg = require('../images/dossier.png');
    if (dossierUrl) {
        return (
            <div className = "home-screen-home-settings-dossier-info">
                <img className = "home-screen-home-settings-dossier-image" src={dossierImg}/>
                <div className = "home-screen-home-settings-dossier-name">
                    {this.state.dossierName}
                </div>
                <Button type='link' className = "home-screen-home-settings-dossier-change" disabled = {homeScreen.mode == VC.MODE_USE_DEFAULT_HOME_SCREEN} onClick={this.openDossierPickerPlugin}>
                    {t('change')}
                </Button>
            </div>
        );
    } else {
        return (
            <Button type='link' className = "home-screen-home-settings-pick" disabled = {homeScreen.mode == VC.MODE_USE_DEFAULT_HOME_SCREEN} onClick={this.openDossierPickerPlugin}>
              {t('pickDossier')}
            </Button>
        );
    }
  }

  handleDossierChange = (dossierName: string, dossierUrl: string) => {
    this.setState({
        dossierName: dossierName
    })
    this.props.updateCurrentConfig({
      homeScreen: {
        homeDocument: {
          url: this.state.currentEnv.url + 'app/' + dossierUrl
        }
      }
    });
  }

  render() {
    const { homeScreen } = this.props.config;
    return (
        <Layout className="home-screen-home">
            <Layout.Content className = "home-screen-home-settings">
                <div className="home-screen-home-settings-title">
                    {t('selectHomeScreen')}
                </div>
                <div className="home-screen-home-settings-option">
                    <Radio.Group value={ homeScreen.mode } onChange={this.handleHomeSettingChange}>
                        <Radio className="home-screen-home-settings-library" value={VC.MODE_USE_DEFAULT_HOME_SCREEN}>
                                {t('useDefaultHome')}
                        </Radio>
                        <Radio className="home-screen-home-settings-dossier" value={VC.MODE_USE_DOSSIER_AS_HOME_SCREEN}>
                            {t('useDossierHome')}
                        </Radio>
                    </Radio.Group>
                </div>
                <div className="home-screen-home-settings-hint">
                    {t('useDossierHomeDesc')}
                </div>
                {this.renderPickDossier()}
                <ContentBundleContentPicker visible={this.state.showContentPicker} handleClose={this.handleDismissAdd} handleChange={this.handleDossierChange}/>
            </Layout.Content>
            <Layout.Sider className="home-screen-home-preview" width='274px'>
              <HomeScreenPreviewer/>
            </Layout.Sider>
        </Layout>
    );
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state)
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenHomeSetting)
