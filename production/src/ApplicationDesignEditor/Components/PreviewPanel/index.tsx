import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

type PreviewPanelProps = {
  
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ }) => {
  return (
    <div className='mstr-app-theme-preview-panel'></div>
  )
}

const mapState = (state: RootState) => ({
  
})

const connector = connect(mapState, {
  
})

export default connector(PreviewPanel)
