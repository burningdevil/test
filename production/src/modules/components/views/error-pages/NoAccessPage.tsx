import * as React from 'react'
import './style/NoAccessPage.scss'

const classNamePrefix = 'homeScreenConfigMainView-no-access-page';
export const NoAccessPage: React.FunctionComponent = (props: any) => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`} />
        <div className={`${classNamePrefix}-warning-title`}>You don’t have access to Applications</div>
    </div>
  )
}

export default NoAccessPage
