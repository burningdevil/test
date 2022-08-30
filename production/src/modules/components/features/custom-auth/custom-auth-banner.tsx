import * as React from 'react'
const classNamePrefix = 'custom-auth-banner'
import './custom-auth-banner.scss'
import * as _ from 'lodash';
import { serverRestartStr } from '../../HomeScreenConfigConstant';
import { Trans } from 'react-i18next';
import CustomAuth from './custom-auth';
import { i18nextInstance } from '../../../../../src/i18n/i18next';
const CustomAuthBanner: React.FC<any> = () => {
    
    const serverRestartTxt = serverRestartStr('<span class="wsicon wsicon-restart"></span>')
    
    return (
        <div
            id="custom-auth-banner"
            className={`${classNamePrefix}`}
        >   
            <span className="wsicon wsicon-info_active" />
                <span className={`${classNamePrefix}-desc`}>
                    
                    <Trans
                        i18nKey="serverRestartTip"
                        defaults="Changes made to the settings marked with <0></0> will require a server restart.>>>>>" // optional defaultValue
                        values={{icon: ''}}
                        i18n = {i18nextInstance}
                        components={[<span className="wsicon wsicon-restart"></span>]}
                        />
                        
                </span>        
                  
        </div>
    );
};

export default CustomAuthBanner;