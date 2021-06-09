import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenGeneral.scss'
import { Checkbox } from '@mstr/rc';
import { env } from '../../../main'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as _ from "lodash";
import { Input } from 'antd';
import { platformType, reviewType } from '../HomeScreenConfigConstant';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';
import { selectCurrentConfig, selectPreviewDeviceType } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import * as Actions from '../../../store/actions/ActionsCreator';
const { TextArea } = Input;
import { t } from '../../../i18n/i18next';

class HomeScreenGeneral extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentEnv: {name: '', url: ''}
    };
  }

  async componentDidMount() {
    const curEnv = await env.environments.getCurrentEnvironment();
    this.setState({
        currentEnv: curEnv
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateCurrentConfig({name: event.target.value});
  }

  handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.updateCurrentConfig({description: event.target.value});
  }

  handlePlatformChange = (event: CheckboxChangeEvent, platType: string) => {
    const { platform } = this.props.config;
    let resultedPlatform;
    if (event.target.checked) {
        resultedPlatform = _.concat(platform, platType);
    } else {
        resultedPlatform = _.pull(platform, platType);
    }
    this.handlePreViewDeviceTypeInvalid(resultedPlatform)
    this.props.updateCurrentConfig({platform: resultedPlatform});
  }

  handlePreViewDeviceTypeInvalid = (platform: string[]) => {
    // in case previewDeviceType not valid
    let deviceType = this.props.previewDeviceType
    const availableTypes = _.concat(platform.includes(platformType.mobile) ? [reviewType.TABLET, reviewType.PHONE] : [], platform.includes(platformType.web) ? reviewType.WEB : [], platform.includes(platformType.desktop) ? reviewType.DESKTOP : [])
    
    let valid = true
    switch (deviceType) {
        case reviewType.TABLET:
        case reviewType.PHONE:
            if (!platform.includes(platformType.mobile)) {
                valid = false
            }
            break;
        case reviewType.WEB:
            if (!platform.includes(platformType.web)) {
                valid = false
            }
            break;
        case reviewType.DESKTOP:
            if (!platform.includes(platformType.desktop)) {
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
    const { name, description, platform} = this.props.config;
    return (
        <div className = "home-screen-general">
            <div className="home-screen-general-environment">
                <div className="home-screen-general-environment-title">
                    {t('environment')}
                </div>
                <div className="home-screen-general-environment-name">
                    {this.state.currentEnv.name}
                </div>
            </div>
            <div className="home-screen-general-name">
                <div className="home-screen-general-name-title">
                    {t('name')}
                </div>
                <div className="home-screen-general-name-name">
                    <Input placeholder="" value={name} onChange={this.handleNameChange}/>
                </div>
            </div>
            <div className="home-screen-general-description">
                <div className="home-screen-general-description-title">
                    {t('description')}
                </div>
                <div className="home-screen-general-description-name">
                    <TextArea className="home-screen-general-description-name-input" placeholder="" rows={3} value={description} onChange={this.handleDescChange}/>
                </div>
            </div>
            <div className="home-screen-general-platform">
                <div className="home-screen-general-platform-title">
                    {t('platform')}
                </div>
                <div className="home-screen-general-platform-name">
                    {this.props.config.default && <Checkbox
                        disabled={true}
                        label={t('mobile')}
                        checked={platform.includes(platformType.mobile)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, 'Mobile')
                        }}
                    />}
                    <Checkbox
                        disabled={true}
                        label={t('web')}
                        checked={platform.includes(platformType.web)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, 'Web')
                        }}
                    />
                    {this.props.config.default && <Checkbox
                        disabled={true}
                        label={t('desktop')}
                        checked={platform.includes(platformType.desktop)}
                        onChange={(event: CheckboxChangeEvent) => {
                          this.handlePlatformChange(event, 'Desktop')
                        }}
                    />}
                </div>
            </div>
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
  previewDeviceType: selectPreviewDeviceType(state), 
})

const connector = connect(mapState, {
  updateCurrentConfig: Actions.updateCurrentConfig,
  updateDeviceType: Actions.updatePreviewDeviceType,
})

export default connector(HomeScreenGeneral)
