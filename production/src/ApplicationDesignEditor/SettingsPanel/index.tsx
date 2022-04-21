import * as React from 'react'
import { Button, Modal } from 'antd'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { selectTheme } from '../../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationLogos, ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import * as Actions from '../../store/actions/ActionsCreator'
import { WorkstationModule } from '@mstr/workstation-types'
import './styles.scss'
import { Input }  from '@mstr/rc'
import { validateUrl } from '../ApplicationDesignHelper/urlValidationHelper'
import { localizedStrings } from '../../modules/components/HomeScreenConfigConstant';
import { t } from "../../i18n/i18next";

declare var workstation: WorkstationModule

type SettingsPanelProps = {
  theme: ApplicationTheme,
  updateTheme: (logo: { type: string, value: string}) => {},
  updateCurrentConfig: (settings: any) => {}
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme, updateTheme, updateCurrentConfig }) => {
  const [isLogoModalVisible, setIsLogoModalVisible] = React.useState(false);
  const [currLogo, setCurrLogo] = React.useState({ type: 'URL', value: '' })
  const [currLogoCategory, setCurrLogoCategory] = React.useState('')
  const [errMessage, setErrMessage] = React.useState('');
  const [urlValid, setUrlValid] = React.useState(true);

  const { 
    web = { type: 'URL', value: '' }, 
    favicon = {type: 'URL', value: '' }, 
    mobile = { type: 'URL',value: '' }
  } = (theme && theme.logos) || {}

  // list of logo types and their respective context
  const logos = [
    {
      category: 'web',
      defn: web,
      subtitle: 'Library Web', // TODO: i18n
      desc: 'Minimum 64 * 64 pixels, png and svg format' // TODO: i18n
    },
    {
      category: 'favicon',
      defn: favicon,
      subtitle: 'Library Favicon', // TODO: i18n
      desc: 'Minimum 32 * 32 pixels, png format' // TODO: i18n
    },
    {
      category: 'mobile',
      defn: mobile,
      subtitle: 'Library Mobile', // TODO: i18n
      desc: 'Minimum 75 * 75 pixels, png format' // TODO: i18n
    }
  ]

  const showModal = (logo: { type: string, value: string }, logoCategory: string) => {
    setCurrLogo(logo)
    setCurrLogoCategory(logoCategory)
    setIsLogoModalVisible(true)
  };

  const handleOk = () => {
    const logoObj: any = {
      logos: {}
    }
    logoObj.logos[currLogoCategory] = currLogo
    updateTheme(logoObj)
    setIsLogoModalVisible(false)
  };

  const handleCancel = () => {
    setIsLogoModalVisible(false)
  };

  const handleApply = () => {
    workstation.window.postMessage({ theme })
  }
 
  const isUrlValid = (url: string, currLogoCategory: string): boolean => {

    const callback = (errorState: boolean, errorMessage: string): void => {
       setErrMessage(errorMessage);
       setUrlValid(errorState);
    };

    return validateUrl(url, callback, currLogoCategory); 
  }

  return (
    <React.Fragment>
      <div className='mstr-app-theme-settings-panel'>
        <div className='settings-panel-content'>
          <div className='mstr-app-theme-logos'>
            <div className='theme-logos-title'>App Logo</div>
            {
              logos.map(logo => (
                <div className='theme-logo'>
                  <div className='logo-subtitle'>{logo.subtitle}</div>
                  <div className='theme-logo-inner-wrapper'>
                    <div className='theme-logo-box'>
                      {
                        // if user defined a logo using URL, render it instead of placeholder
                        theme && theme.logos && theme.logos[logo.category as keyof ApplicationLogos] && theme.logos[logo.category as keyof ApplicationLogos].type === 'URL'
                          ? <img className='theme-logo-img' src={theme.logos[logo.category as keyof ApplicationLogos].value} />
                          : <div className={classnames('theme-logo-icn', logo.category)} />
                      }
                    </div>
                    <div className='btn-wrapper'>
                      <Button className='btn' type='primary' onClick={() => showModal(logo.defn, logo.category)}>Upload Logo</Button>
                      <div className='desc'>{logo.desc}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Modal className='mstr-app-theme-upload-logo' 
        visible={isLogoModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={localizedStrings.SAVE}
        cancelText={localizedStrings.CANCEL}
        okButtonProps={{disabled:!urlValid}}
        cancelButtonProps={{style:{color:'#0661E0', backgroundColor:'#F2F3F5'}}}
      >
        <div className='logo-modal-label'>{t('pasteImageUrl')}</div>
        <Input
            className='logo-modal-url'
            defaultValue={'https://'}
            placeholder={'https://'}
            value= {currLogo.value}
            onChange={(e: { target: { value: any } }) => setCurrLogo({ type: 'URL', value: e.target.value })}
            onPressEnter={handleOk}
            onValidate={()=>isUrlValid(currLogo.value, currLogoCategory)&&urlValid}
            errorMessage={errMessage}
            isErrorDisplayed
        />
      </Modal>
    </React.Fragment>
  )
}

const mapState = (state: RootState) => ({
  theme: selectTheme(state)
})

const connector = connect(mapState, {
  updateTheme: Actions.updateTheme,
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(SettingsPanel)
