import * as React from 'react'
import './style/ServerIncompatiblePage.scss'

const classNamePrefix = 'homeScreenConfigMainView-server-incompatible-page';
interface ServerIncompatiblePageProps {
  titleMsg: string,
  detailMsg?: string
}

export const ServerIncompatiblePage: React.FunctionComponent<ServerIncompatiblePageProps> = (props: ServerIncompatiblePageProps) => {
  return (
    <div className={`${classNamePrefix}`}>
      <div className={`${classNamePrefix}-warning-icon`} />
      {props.titleMsg && <div className={`${classNamePrefix}-warning-title`}>{props.titleMsg}</div>}
      {props.detailMsg && <div className={`${classNamePrefix}-warning-detail`}>{props.detailMsg}</div>}
    </div>
  )
}

export default ServerIncompatiblePage
