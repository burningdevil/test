import * as React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { ApplicationLogos } from '../../../types/data-model/HomeScreenConfigModels'
import * as Actions from '../../../store/actions/ActionsCreator'
import './styles.scss'
import { Input }  from '@mstr/rc'
import { validateUrl } from '../../utils/urlValidationHelper'
// import { localizedStrings } from '../../../modules/components/HomeScreenConfigConstant';
// import { t } from "../../../i18n/i18next";

type LogoUploaderProps = {
  logo: any,
  updateTheme: (logo: { type: string, value: string}) => {}
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, updateTheme }) => {
  const [currLogo, setCurrLogo] = React.useState({ type: 'URL', value: '' })
  const [errMessage, setErrMessage] = React.useState('');
  const [urlValid, setUrlValid] = React.useState(true);
  console.log('render logo uploader ' + logo.category);

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
        console.log('callback called')
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
                placeholder={'Paste an image URL'}
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

export default LogoUploader
