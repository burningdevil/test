import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import { env } from '../main'
import * as Actions from '../store/actions/ActionsCreator';
import PreviewPanel from './Components/PreviewPanel'
import SettingsPanel from './Components/SettingsPanel'

type ApplicationDesignEditorProps = {
  setAppTheme: any 
    
}

const ApplicationDesignEditor: React.FC<ApplicationDesignEditorProps> = ({ setAppTheme }) => {
  const useEffect = React.useEffect;

  useEffect(() => {
    async function initEditor() {
      const theme = await env.window.getExtraContext()
      setAppTheme(JSON.parse(theme))
    }
    initEditor();
  },[]);
  

  return (
    <div className='mstr-app-design-editor-content'>
      <div className='title-section'>
        <div className='label' >Application Design Editor</div>
      </div>
      <div className='content-section'>
        <SettingsPanel /> 
        <PreviewPanel />
      </div> 
    </div>
  )
}

const mapState = (state: RootState) => ({
  
})

const connector = connect(mapState, {
  setAppTheme: Actions.setTheme
})

export default connector(ApplicationDesignEditor)
