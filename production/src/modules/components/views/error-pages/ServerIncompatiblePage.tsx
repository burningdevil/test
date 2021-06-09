import * as React from 'react'
import './style/ServerIncompatiblePage.scss'

export const ServerIncompatiblePage: React.FunctionComponent = (props: any) => {
  return (
    <div className="HomeScreenConfigMainView-server-incompatible-page">
      <div className="warning-icon" />
      { props.needUpgradeMD && <div className="warning-title">You need a newer Metadata version to use this feature</div> }
      { props.needUpgradeLibraryServer && (<>
          <div className="warning-title">You need a newer enviornment version to use this feature</div>
          <div className="warning-detail">You are connecting to an older version of Library Server, some features may not work as expected</div>
        </>)}
      { props.needIServerUpgrade && (<>
        <div className="warning-title">You need a newer enviornment version to use this feature</div>
        <div className="warning-detail">You are connecting to an older version of IServer, some features may not work as expected</div>
      </>)}
    </div>
  )
}

export default ServerIncompatiblePage
