import * as React from 'react'
import { connect } from 'react-redux'
import { selectThemeId } from '../../../store/selectors/ApplicationDesignEditorSelector';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

type SettingsPanelProps = {
  id: ''
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ id }) => {
  return (
    <div>
      Settings Panel - 
    </div>
  )
}

const mapState = (state: RootState) => ({
  id: selectThemeId(state)
})

const connector = connect(mapState, {
  
})

export default connector(SettingsPanel)
