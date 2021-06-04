import React from 'react'
import './style/NoAccessPage.scss'

export const NoAccessPage: React.FunctionComponent = (props: any) => {
  return (
    <div className="HomeScreenConfigMainView-no-access-page">
      <div className="warning-icon" />
        <div className="warning-title">You don’t have access to Application</div>
    </div>
  )
}

export default NoAccessPage
