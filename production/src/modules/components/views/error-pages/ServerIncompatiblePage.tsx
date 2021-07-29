import * as React from 'react'
import './style/ServerIncompatiblePage.scss'
import { localizedStrings } from '../../HomeScreenConfigConstant'

const classNamePrefix = 'homeScreenConfigMainView-server-incompatible-page';

interface ServerIncompatiblePageProps {
  needUpgradeMD: boolean,
  needUpgradeLibraryServer: boolean,
  needIServerUpgrade:boolean
}

export const ServerIncompatiblePage: React.FunctionComponent<ServerIncompatiblePageProps> = (props: any) => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`} />
      { props.needUpgradeMD && <div className={`${classNamePrefix}-warning-title`}>{localizedStrings.MD_VERSION_ERROR_MSG}</div> }
      { props.needUpgradeLibraryServer && (<>
          <div className={`${classNamePrefix}-warning-title`}>{localizedStrings.SERVER_VERSION_ERROR_TITLE_MSG}</div>
          <div className={`${classNamePrefix}-warning-detail`}>{localizedStrings.SERVER_VERSION_ERROR_DETAIL_MSG}</div>
        </>)}
      { props.needIServerUpgrade && (<>
        <div className={`${classNamePrefix}-warning-title`}>{localizedStrings.SERVER_VERSION_ERROR_TITLE_MSG}</div>
        <div className={`${classNamePrefix}-warning-detail`}>{localizedStrings.SERVER_VERSION_ERROR_DETAIL_MSG}</div>
      </>)}
    </div>
  )
}

export default ServerIncompatiblePage
