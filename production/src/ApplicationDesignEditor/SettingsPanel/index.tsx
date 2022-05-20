import * as React from 'react'
import { Button, Modal } from 'antd'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { ApplicationLogos, ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import * as Actions from '../../store/actions/ActionsCreator'
import './styles.scss'
import { Input }  from '@mstr/rc'
import { validateUrl } from '../utils/urlValidationHelper'
import { localizedStrings } from '../../modules/components/HomeScreenConfigConstant';
import { t } from "../../i18n/i18next";
import LogoUploader from './LogoUploader'

type SettingsPanelProps = {
  theme: ApplicationTheme,
  updateTheme: (logo: { type: string, value: string}) => {}
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme, updateTheme }) => {
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
      subtitle: t('libraryWebSubtitle'),
      desc: t('libraryWebDesc')
    },
    {
      category: 'favicon',
      defn: favicon,
      subtitle: t('libraryFaviconSubtitle'),
      desc: t('libraryFaviconDesc')
    },
    {
      category: 'mobile',
      defn: mobile,
      subtitle: t('libraryMobileSubtitle'),
      desc: t('libraryMobileDesc')
    }
  ]

  return (
    <React.Fragment>
      <div className='mstr-app-theme-settings-panel'>
        <div className='settings-panel-content'>
          <div className='mstr-app-theme-logos'>
            <div className='theme-logos-title'>{t('appLogoTitle')}</div>
            {
              logos.map((logo, index) => (
                <LogoUploader logo={logo} updateTheme={updateTheme} key={index}/>
              ))
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const connector = connect(null, {
  updateTheme: Actions.updateTheme
})

export default connector(SettingsPanel)
