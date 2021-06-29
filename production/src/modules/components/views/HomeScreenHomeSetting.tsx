import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenHomeSetting.scss'
import { Radio, Button, Layout } from 'antd';
import { env } from '../../../main'
import { RadioChangeEvent } from 'antd/lib/radio';
import * as _ from "lodash";
import ContentBundleContentPicker from './ContentBundleContentPicker'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import HomeScreenPreviewer from './HomeScreenPreviewer';
import { default as VC, localizedStrings, previewerWidth } from '../HomeScreenConfigConstant';
import * as api from '../../../services/Api';

const classNamePrefixSimple = 'home-screen-home';
const classNamePrefix = `${classNamePrefixSimple}-settings`;
const appRootPath = 'app/';
const dossierUrlPath = 'homeDocument.url';

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
    const dossierUrl = _.get(homeScreen, dossierUrlPath, '');
    if (dossierUrl) {
        const spliter = '/';
        const ids = _.split(dossierUrl, spliter);
        if (ids && ids.length > 1) {
          const projectId = ids[ids.length - 2];
          const dossierId = ids[ids.length - 1];
          const response = await api.getSingleDossierInfo(dossierId, projectId) as any;
          
          let data = response;
          if (response.data) {
            data = response.data;
          }
          this.setState({
              dossierName: data.name
          });
        }
    }
  }

  componentWillMount() {
    this.loadData();
  }

  handleDismissAdd = () => {
    this.setState({
      showContentPicker: false
    });
  }

  openDossierPickerPlugin = async () => {
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
    const dossierUrl = _.get(homeScreen, dossierUrlPath, '');
    // const dossierImg = require('../images/dossier.png');
    if (dossierUrl) {
        return (
            <div className = {`${classNamePrefix}-dossier-info`}>
                <img className = {`${classNamePrefix}-dossier-image`} src={'../assets/images/dossier.png'}/>
                <div className = {`${classNamePrefix}-dossier-name`}>
                    {this.state.dossierName}
                </div>
                <Button type='link' className = {`${classNamePrefix}-dossier-change`} disabled = {homeScreen.mode == VC.MODE_USE_DEFAULT_HOME_SCREEN} onClick={this.openDossierPickerPlugin}>
                    {localizedStrings.CHANGE}
                </Button>
            </div>
        );
    } else {
        return (
            <Button type='link' className = {`${classNamePrefix}-pick`} disabled = {homeScreen.mode == VC.MODE_USE_DEFAULT_HOME_SCREEN} onClick={this.openDossierPickerPlugin}>
              {localizedStrings.PICKDOSSIER}
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
          url: this.state.currentEnv.url + appRootPath + dossierUrl
        }
      }
    });
  }

  render() {
    const { homeScreen } = this.props.config;
    return (
        <Layout className={`${classNamePrefixSimple}`}>
            <Layout.Content className = {`${classNamePrefix}`}>
                <div className={`${classNamePrefix}-title`}>
                    {localizedStrings.SELECT_HOMESCREEN}
                </div>
                <div className={`${classNamePrefix}-option`}>
                    <Radio.Group value={ homeScreen.mode } onChange={this.handleHomeSettingChange}>
                        <Radio className={`${classNamePrefix}-library`} value={VC.MODE_USE_DEFAULT_HOME_SCREEN}>
                                {localizedStrings.DEFAULT_HOME}
                        </Radio>
                        <Radio className={`${classNamePrefix}-dossier`} value={VC.MODE_USE_DOSSIER_AS_HOME_SCREEN}>
                            {localizedStrings.DOSSIER_HOME}
                        </Radio>
                    </Radio.Group>
                </div>
                <div className={`${classNamePrefix}-hint`}>
                    {localizedStrings.DOSSIER_HOME_DESC}
                </div>
                {this.renderPickDossier()}
                <ContentBundleContentPicker visible={this.state.showContentPicker} handleClose={this.handleDismissAdd} handleChange={this.handleDossierChange}/>
            </Layout.Content>
            <Layout.Sider className={`${classNamePrefixSimple}-preview`} width={previewerWidth}>
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
