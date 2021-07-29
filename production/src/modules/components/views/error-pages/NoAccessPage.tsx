import * as React from 'react'
import './style/NoAccessPage.scss'
import { localizedStrings } from '../../HomeScreenConfigConstant'

const classNamePrefix = 'homeScreenConfigMainView-no-access-page';
export const NoAccessPage: React.FunctionComponent = (props: any) => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`} />
        <div className={`${classNamePrefix}-warning-title`}>{localizedStrings.USER_PRIVILEGE_ERROR_MSG}</div>
    </div>
  )
}

export default NoAccessPage
