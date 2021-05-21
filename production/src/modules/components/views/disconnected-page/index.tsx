import React from 'react'
import './style/index.scss'

export const DisconnectedPage: React.FunctionComponent = () => {
  return (
    <div className="HomeScreenConfigMainView-disconnected-page">
      <div className="warning-icon" />
      <div className="warning-title">The selected environment is disconnected.</div>
      <div className="warning-detail">Please check your environment connection and try again.</div>
    </div>
  )
}

export default DisconnectedPage
