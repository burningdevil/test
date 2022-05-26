import * as React from 'react'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import { t } from "../../i18n/i18next"
import LogoCustomizer from './LogoCustomizer'
import './styles.scss'

type SettingsPanelProps = {
  theme: ApplicationTheme
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme }) => {
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
              logos.map((logo, index) => <LogoCustomizer logo={logo} key={index}/>)
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SettingsPanel
