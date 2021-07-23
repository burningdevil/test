import * as React from 'react'
import './style/DisconnectedPage.scss'

const classNamePrefix = 'homeScreenConfigMainView-disconnected-page';
export const DisconnectedPage: React.FunctionComponent = () => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`}/>
      <div className={`${classNamePrefix}-warning-title`}>The selected environment is disconnected.</div>
      <div className={`${classNamePrefix}-warning-detail`}>Please check your environment connection and try again.</div>
    </div>
  )
}

export default DisconnectedPage
