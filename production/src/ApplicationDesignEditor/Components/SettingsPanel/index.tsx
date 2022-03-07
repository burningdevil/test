import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

type SettingsPanelProps = {

}

const SettingsPanel: React.FC<SettingsPanelProps> = ({  }) => {
  return (
    <div className='mstr-app-theme-settings-panel'></div>
  )
}

const mapState = (state: RootState) => ({
  
})

const connector = connect(mapState, {
  
})

export default connector(SettingsPanel)
