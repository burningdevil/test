import * as React from 'react'
import { connect } from 'react-redux'
import { selectTheme } from '../../store/selectors/ApplicationDesignEditorSelector'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import './styles.scss'
 
type PreviewPanelProps = {
  theme: ApplicationTheme,
  previewStyle: {
    width: string
  }
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ theme, previewStyle }) => {
  
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

const mapState = (state: RootState) => ({
  theme: selectTheme(state)
})

const connector = connect(mapState, {
  
})

export default connector(PreviewPanel)
