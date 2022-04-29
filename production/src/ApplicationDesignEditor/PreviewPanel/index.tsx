import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import './styles.scss'
 
type PreviewPanelProps = {
  theme: ApplicationTheme
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ theme }) => {
  
  return (
    <div className='mstr-app-theme-preview-panel'>
      <pre >
        <code>
        {JSON.stringify(theme, null, 2) }
        </code>
      </pre>
    </div>
  )
}

const connector = connect(null, {})

export default connector(PreviewPanel)
