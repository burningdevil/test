import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenHomeSetting.scss'
import { Radio, Button, Layout, Space } from 'antd';
import { Tooltip } from '@mstr/rc';
import { env } from '../../../main'
import { RadioChangeEvent } from 'antd/lib/radio';
import * as _ from "lodash";
import ContentBundleContentPicker from './ContentBundleContentPicker'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectIsDossierAsHome, selectSelectedDocumentIcons, selectSelectedLibraryIcons } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
import HomeScreenPreviewer from './HomeScreenPreviewer';
import { default as VC, localizedStrings, previewerWidth, iconValidKey } from '../HomeScreenConfigConstant';
import * as api from '../../../services/Api';
// @ts-ignore: RC Component Support error
import selectedDossierIcon from '../images/icon_select_dossier.png';
// @ts-ignore: RC Component Support error
import selectedDocumentIcon from '../images/icon_select_document.png';

const classNamePrefixSimple = 'home-screen-home';
const classNamePrefix = `${classNamePrefixSimple}-settings`;
const appRootPath = 'app/';
const dossierUrlPath = 'homeDocument.url';

class HomeScreenHomeSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      showContentPicker: false,
      showToolTip: false,
      dossierName: '',
      isDossierSelected: true
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

  // When switch mode between Library/Dossier Home, shared notification/account settings should be sync between library/document icon list
  adjustIconStatus = (mode: number) => {
    let libraryIcons = _.concat([], this.props.selectedLibraryIcons)
    let documentIcons = _.concat([], this.props.selectedDocumentIcons)
    if (mode === VC.MODE_USE_DEFAULT_HOME_SCREEN) {
      // Switch to Library Home, move notification/accound from document list to library list
      if (documentIcons.includes(VC.ICON_NOTIFICATIONS)) {
        if (!libraryIcons.includes(VC.ICON_NOTIFICATIONS)) {
          libraryIcons = _.concat(libraryIcons, VC.ICON_NOTIFICATIONS)
        }
        _.pull(documentIcons, VC.ICON_NOTIFICATIONS)
      } else {
        if (libraryIcons.includes(VC.ICON_NOTIFICATIONS)) {
          _.pull(libraryIcons, VC.ICON_NOTIFICATIONS)
        }
      }
      if (documentIcons.includes(VC.ICON_OPTIONS)) {
        if (!libraryIcons.includes(VC.ICON_OPTIONS)) {
          libraryIcons = _.concat(libraryIcons, VC.ICON_OPTIONS)
        }
        _.pull(documentIcons, VC.ICON_OPTIONS)
      } else {
        if (libraryIcons.includes(VC.ICON_OPTIONS)) {
          _.pull(libraryIcons, VC.ICON_OPTIONS)
        }
      }
    } else {
      // Switch to Dossier Home, try to move notification/accound from library list to document list
      if (libraryIcons.includes(VC.ICON_NOTIFICATIONS)) {
        if (!documentIcons.includes(VC.ICON_NOTIFICATIONS)) {
          documentIcons = _.concat(documentIcons, VC.ICON_NOTIFICATIONS)
        }
        _.pull(libraryIcons, VC.ICON_NOTIFICATIONS)
      } else {
        if (documentIcons.includes(VC.ICON_NOTIFICATIONS)) {
          _.pull(documentIcons, VC.ICON_NOTIFICATIONS)
        }
      }
      if (libraryIcons.includes(VC.ICON_OPTIONS)) {
        if (!documentIcons.includes(VC.ICON_OPTIONS)) {
          documentIcons = _.concat(documentIcons, VC.ICON_OPTIONS)
        }
        _.pull(libraryIcons, VC.ICON_OPTIONS)
      } else {
        if (documentIcons.includes(VC.ICON_OPTIONS)) {
          _.pull(documentIcons, VC.ICON_OPTIONS)
        }
      }
    }
    const update = {
      [VC.HOME_LIBRARY]: {
        [VC.ICONS]: libraryIcons
      },
      [VC.HOME_DOCUMENT]: {
        [VC.ICONS]: documentIcons
      }
    }
    return update
  }

  handleHomeSettingChange = (event: RadioChangeEvent) => {
    const updateHomeScreenIcons = this.adjustIconStatus(event.target.value)
    this.props.updateCurrentConfig({
      homeScreen: _.merge(updateHomeScreenIcons, {[VC.MODE]: event.target.value})
    });
  }
  handleTooltip = (event: any) => {
    if(event.target?.offsetWidth < event.target?.scrollWidth){
      this.setState({
        showToolTip: true
      })
    }else {
      this.setState({
        showToolTip: false
      })
    }
  }
  hideTooltip = () => {
    this.setState({
      showToolTip: false
    })
  }
  renderPickDossier = () => {
    const { homeScreen } = this.props.config;
    const dossierUrl = _.get(homeScreen, dossierUrlPath, '');
    if (dossierUrl) {
        return (
            <div className = {`${classNamePrefix}-dossier-info`} style={this.props.isDossierHome ? {opacity: 1.0} : {opacity : 0.5}}>
                {this.state.isDossierSelected ? <img className = {`${classNamePrefix}-dossier-image`} src={selectedDossierIcon}/> 
                                              : <img className = {`${classNamePrefix}-dossier-image`} src={selectedDocumentIcon}/>}
                <Tooltip
                      title={<span>{this.state.dossierName}</span>}
                      placement='bottom'
                      visible = {this.state.showToolTip}
                      triggerMode='hover'>
                        <div onMouseEnter={this.handleTooltip} onMouseLeave={this.hideTooltip} className = {`${classNamePrefix}-dossier-name`}>
                          {this.state.dossierName}
                        </div>
                  </Tooltip>
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

  renderPickDossierErrorMsg = () => {
    const { isDossierHome, config, visitCount } = this.props;
    const dossierUrlPath = 'homeScreen.homeDocument.url';
    const dossierUrl = _.get(config, dossierUrlPath, '');
    if (isDossierHome && _.isEmpty(dossierUrl) && visitCount > 0) {
      return <div className={`${classNamePrefix}-choose-dossier-error_msg`}>
        {localizedStrings.PICKDOSSIER_ERROR_MSG}
      </div>
    }
  }

  handleDossierChange = (dossierName: string, dossierUrl: string, isDossier: boolean) => {
    this.setState({
        dossierName: dossierName,
        isDossierSelected: isDossier
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
                      <Space direction='vertical' className={`${classNamePrefix}-option-group`}>
                        <Radio className={`${classNamePrefix}-library`} value={VC.MODE_USE_DEFAULT_HOME_SCREEN}>
                                {localizedStrings.DEFAULT_HOME}
                        </Radio>
                        <Radio className={`${classNamePrefix}-dossier`} value={VC.MODE_USE_DOSSIER_AS_HOME_SCREEN}>
                            {localizedStrings.DOSSIER_HOME}
                        </Radio>
                      </Space>
                    </Radio.Group>
                </div>
                <div className={`${classNamePrefix}-hint`}>
                    {localizedStrings.DOSSIER_HOME_DESC}
                </div>
                {this.renderPickDossier()}
                {this.renderPickDossierErrorMsg()}
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
  config: selectCurrentConfig(state),
  isDossierHome: selectIsDossierAsHome(state),
  selectedLibraryIcons: selectSelectedLibraryIcons(state),
  selectedDocumentIcons: selectSelectedDocumentIcons(state), 
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(HomeScreenHomeSetting)
