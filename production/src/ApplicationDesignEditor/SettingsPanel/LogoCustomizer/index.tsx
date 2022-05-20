import * as React from 'react'
import classnames from 'classnames'
import { Input }  from '@mstr/rc'
import { validateUrl } from '../../utils/urlValidationHelper'
import { t } from "../../../i18n/i18next"
import './styles.scss'

type LogoCustomizerProps = {
  logo: any,
  updateTheme: (logo: { type: string, value: string}) => {}
}

const LogoCustomizer: React.FC<LogoCustomizerProps> = ({ logo, updateTheme }) => {
  const [currLogo, setCurrLogo] = React.useState({ type: 'URL', value: '' })
  const [errMessage, setErrMessage] = React.useState('');
  const [urlValid, setUrlValid] = React.useState(true);

  React.useEffect(() => {
    setCurrLogo(logo.defn)
  }, [logo.defn.value]);

  const onEnter = () => {
    if (!urlValid) {
        return
    }
    const logoObj: any = {
      logos: {}
    }
    logoObj.logos[logo.category] = currLogo
    updateTheme(logoObj)
  };
 
  const isUrlValid = (url: string, currLogoCategory: string): boolean => {
    const callback = (errorState: boolean, errorMessage: string): void => {
        setUrlValid(errorState);
        setErrMessage(errorMessage);
    };

    return validateUrl(url, callback, currLogoCategory); 
  }

  return (
    <div className='theme-logo'>
        <div className='logo-subtitle'>{logo.subtitle}</div>
        <div className='theme-logo-inner-wrapper'>
        <div className='theme-logo-box'>
            {
            // if user provided a logo using URL, render it instead of placeholder
            logo && logo.defn && logo.defn.type === 'URL' && logo.defn.value
                ? <img className={classnames('theme-logo-img', logo.category)} src={logo.defn.value} />
                : <div className={classnames('theme-logo-icn', logo.category)} />
            }
        </div>
        <div className='input-wrapper'>
            <Input
                autoFocus={false}
                className={`logo-modal-url-${logo.category}`}
                defaultValue={'https://'}
                placeholder={t('pasteImageUrl')}
                value={currLogo.value}
                onChange={(e: { target: { value: any } }) => {
                    setCurrLogo({ type: 'URL', value: e.target.value })
                    isUrlValid(e.target.value, logo.category)
                }}
                onPressEnter={onEnter}
                onBlur={onEnter}
                onValidate={() => urlValid}
                errorMessage={errMessage}
                isErrorDisplayed={!urlValid}
            />
            {
                // if URL is invalid, hide description to allow space for err message
                urlValid
                    ? <div className='desc'>{logo.desc}</div>
                    : null
            }
        </div>
        </div>
    </div>
  )
}

export default LogoCustomizer
