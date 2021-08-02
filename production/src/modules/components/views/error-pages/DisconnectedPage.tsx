import * as React from 'react'
import './style/DisconnectedPage.scss'
import { localizedStrings } from '../../HomeScreenConfigConstant'

const classNamePrefix = 'homeScreenConfigMainView-disconnected-page';
export const DisconnectedPage: React.FunctionComponent = () => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`}/>
      <div className={`${classNamePrefix}-warning-title`}>{localizedStrings.ENVIRONTMENT_DISCONNECT_ERROR_TITLE_MSG}</div>
      <div className={`${classNamePrefix}-warning-detail`}>{localizedStrings.ENVIRONTMENT_DISCONNECT_ERROR_DETAIL_MSG}</div>
    </div>
  )
}

export default DisconnectedPage
