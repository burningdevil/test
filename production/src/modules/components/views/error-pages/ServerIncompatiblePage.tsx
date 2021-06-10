import * as React from 'react'
import './style/ServerIncompatiblePage.scss'

const classNamePrefix = 'homeScreenConfigMainView-server-incompatible-page';
export const ServerIncompatiblePage: React.FunctionComponent = (props: any) => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`} />
      { props.needUpgradeMD && <div className={`${classNamePrefix}-warning-title`}>You need a newer Metadata version to use this feature</div> }
      { props.needUpgradeLibraryServer && (<>
          <div className={`${classNamePrefix}-warning-title`}>You need a newer enviornment version to use this feature</div>
          <div className={`${classNamePrefix}-warning-detail`}>You are connecting to an older version of Library Server, some features may not work as expected</div>
        </>)}
      { props.needIServerUpgrade && (<>
        <div className={`${classNamePrefix}-warning-title`}>You need a newer enviornment version to use this feature</div>
        <div className={`${classNamePrefix}-warning-detail`}>You are connecting to an older version of IServer, some features may not work as expected</div>
      </>)}
    </div>
  )
}

export default ServerIncompatiblePage
