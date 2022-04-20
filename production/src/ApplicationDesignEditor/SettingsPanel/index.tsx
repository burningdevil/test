import * as React from 'react'
import { Button, Modal } from 'antd'
import { connect } from 'react-redux'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { selectCurrentTheme } from '../../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
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
    <div>
      <div className='mstr-app-theme-settings-panel'>
        <div className='settings-panel-content'>
          <div className='mstr-app-theme-logos'>
        <div className='theme-logos-title'>
          App Logo
        </div>
        <div className='theme-logo'>
          <div className='logo-caption'>Library Web</div> 
          <Button type="primary" onClick={()=>{showModal(web, 'web')}}>Upload Logo</Button>
        </div>
        <div className='theme-logo'>
          <div className='logo-caption'>Library Favicon</div> 
          <Button type="primary" onClick={()=>{showModal(favicon, 'favicon')}}>Upload Logo</Button>
        </div>
        <div className='theme-logo'>
          <div className='logo-caption'>Library Mobile</div> 
          <Button type="primary" onClick={()=>{showModal(mobile, 'mobile')}}>Upload Logo</Button>
        </div>
          </div>
        </div>
        <div className='settings-panel-footer'>
          <div className='apply-btn'>
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
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
            onChange={(e) => setCurrLogo({ type: 'URL', value: e.target.value })}
            onPressEnter={handleOk}
            onValidate={()=>isUrlValid(currLogo.value, currLogoCategory)&&urlValid}
            errorMessage={errMessage}
            isErrorDisplayed
        />
      </Modal>
    </div>
    
  )
}

const mapState = (state: RootState) => ({
  theme: selectCurrentTheme(state)
})

const connector = connect(mapState, {
  updateTheme: Actions.updateTheme,
  updateCurrentConfig: Actions.updateCurrentConfig
})

export default connector(SettingsPanel)
