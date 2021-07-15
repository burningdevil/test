import * as React from 'react';
import { connect } from 'react-redux';
import '../scss/HomeScreenGeneral.scss';
import { env } from '../../../main';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as _ from "lodash";
import { Input } from 'antd';
import { platformType, reviewType, localizedStrings, featureFlag } from '../HomeScreenConfigConstant';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectConfigInfoList, selectCurrentConfig, selectIsConfigNameError, selectIsDuplicateConfig, selectPreviewDeviceType } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
const { TextArea } = Input;

const classNamePrefix = 'home-screen-general';
class HomeScreenGeneral extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentEnv: {name: '', url: ''},
      showBlankNameError: false,
      showDuplicateNameError: false,
      isDefaultNameFocused: false,  // auto focus default name for only once
    };
  }
  private nameInputRef = React.createRef<Input>();

  async componentDidMount() {
    const curEnv = await env.environments.getCurrentEnvironment();
    this.setState({
        currentEnv: curEnv
    });
  }

  componentDidUpdate(prevProps: any) {
    if (!this.state.isDefaultNameFocused && (!this.props.config.id || this.props.isDuplicateConfig) && prevProps.config.name !== this.props.config.name){
        if (this.nameInputRef && this.nameInputRef.current) {
            this.nameInputRef.current.select();
            this.setState({
                isDefaultNameFocused: true,  // auto focus default name for only once
            });
        }
      return;
    }
  }

  componentWillReceiveProps(nextProps: any) {
    
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nameStr = event.target.value;
      this.props.updateCurrentConfig({name: nameStr});
      const isEmptyName = !(nameStr && nameStr.trim());
      const currentConfigId = this.props.config.id;
      const isDuplicateName = this.props.configInfoList.filter((appInfo: any ) => {
        // When same name with different config id OR same name with same id and when duplicate config
        return appInfo.name.toLowerCase() === nameStr.toLowerCase() && (currentConfigId !== appInfo.id || (currentConfigId === appInfo.id && this.props.isDuplicateConfig));
      }).length > 0;
      this.setState({
          showBlankNameError: isEmptyName,
          showDuplicateNameError: isDuplicateName
      });
      this.props.setConfigNameError(isEmptyName || isDuplicateName);
  }

  handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.updateCurrentConfig({description: event.target.value});
  }

  handlePlatformChange = (event: CheckboxChangeEvent, platType: string) => {
    const { platforms } = this.props.config;
    let resultedPlatform;
    if (event.target.checked) {
        resultedPlatform = _.concat(platforms, platType);
    } else {
        resultedPlatform = _.pull(platforms, platType);
    }
    this.handlePreViewDeviceTypeInvalid(resultedPlatform)
    this.props.updateCurrentConfig({platforms: resultedPlatform});
  }

  handlePreViewDeviceTypeInvalid = (platforms: string[]) => {
    // in case previewDeviceType not valid
    let deviceType = this.props.previewDeviceType
    const availableTypes = _.concat(platforms.includes(platformType.mobile) ? [reviewType.TABLET, reviewType.PHONE] : [], platforms.includes(platformType.web) ? reviewType.WEB : [], platforms.includes(platformType.desktop) ? reviewType.DESKTOP : [])
    
    let valid = true
    switch (deviceType) {
        case reviewType.TABLET:
        case reviewType.PHONE:
            if (!platforms.includes(platformType.mobile)) {
                valid = false
            }
            break;
        case reviewType.WEB:
            if (!platforms.includes(platformType.web)) {
                valid = false
            }
            break;
        case reviewType.DESKTOP:
            if (!platforms.includes(platformType.desktop)) {
                valid = false
            }
            break;
        default:
            break;
    }
    if (!valid) {
        this.props.updateDeviceType(availableTypes.length > 0 ? availableTypes[0] : reviewType.TABLET)
    }
  }

  render() {
    const { name, description, platforms } = this.props.config;
    return (
        <div className = {`${classNamePrefix}`}>
            <div className={`${classNamePrefix}-environment`}>
                <div className={`${classNamePrefix}-environment-title`}>
                    {localizedStrings.ENVIRONMENT}
                </div>
                <div className={`${classNamePrefix}-environment-name`}>
                    {this.state.currentEnv.name}
                </div>
            </div>
            <div className={`${classNamePrefix}-name`}>
                <div className={`${classNamePrefix}-name-title`}>
                    {localizedStrings.NAME + '*'}
                </div>
                <div className={this.props.isConfigNameError ? `${classNamePrefix}-name-error` : `${classNamePrefix}-name-name`}>
                    <Input ref={this.nameInputRef} placeholder='' maxLength={250} value={name} onChange={this.handleNameChange}/>
                </div>
            </div>
            { this.state.showBlankNameError && <div className={`${classNamePrefix}-name-hint-error`}>
                    <div/>
                    <span>{localizedStrings.BLANK_APP_NAME_ERROR}</span>
                </div>
            }
            { this.state.showDuplicateNameError && <div className={`${classNamePrefix}-name-hint-error`}>
                    <div/>
                    <span>{localizedStrings.DUPLICATE_APP_NAME_ERROR}</span>
                </div>
            }
            <div className={`${classNamePrefix}-description`}>
                <div className={`${classNamePrefix}-description-title`}>
                    {localizedStrings.DESCRIPTION}
                </div>
                <div className={`${classNamePrefix}-description-name`}>
                    <TextArea className={`${classNamePrefix}-description-name-input`} placeholder='' rows={3} maxLength={250} value={description} onChange={this.handleDescChange}/>
                </div>
            </div>
            {/* <div className={`${classNamePrefix}-platform`}>
                <div className={`${classNamePrefix}-platform-title`}>
                    {localizedStrings.PLATFORMS}
                </div>
                <div className={`${classNamePrefix}-platform-name`}>
                    {featureFlag.platformEnable && <Checkbox
                        disabled={this.props.config.isDefault}
                        label={localizedStrings.MOBILE}
                        checked={platforms.includes(platformType.mobile)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, platformType.mobile)
                        }}
                    />}
                    <Checkbox
                        disabled={this.props.config.isDefault}
                        label={localizedStrings.WEB}
                        checked={platforms.includes(platformType.web)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, platformType.web)
                        }}
                    />
                    <Checkbox
                        disabled={this.props.config.isDefault}
                        label={localizedStrings.DESKTOP}
                        checked={platforms.includes(platformType.desktop)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, platformType.desktop)
                        }}
                    />
                </div>
            </div> */}
            {/* <div className="home-screen-general-url">
              <div className="home-screen-general-url-title">
                  {t('appUrl')}
              </div>
              <div className="home-screen-general-url-name">
                  {this.state.currentEnv.url + 'app/config/' + this.props.config.configId}
              </div>
            </div> */}
         </div>
    );
  }
}

const mapState = (state: RootState) => ({
  config: selectCurrentConfig(state),
  configInfoList: selectConfigInfoList(state),
  isDuplicateConfig: selectIsDuplicateConfig(state),
  isConfigNameError: selectIsConfigNameError(state),
  previewDeviceType: selectPreviewDeviceType(state), 
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig,
  updateDeviceType: Actions.updatePreviewDeviceType,
  setConfigNameError: Actions.setConfigNameError,
})

export default connector(HomeScreenGeneral)
