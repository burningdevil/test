import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import { env } from '../main'
import * as Actions from '../store/actions/ActionsCreator'
import PreviewPanel from './PreviewPanel'
import SettingsPanel from './SettingsPanel'
import DesignStudioToolbar from './DesignStudioToolbar'
import { WorkstationModule, WindowEvent, DialogValues } from '@mstr/workstation-types'
import './styles.scss'
import { selectDesignStudioTheme } from '../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationTheme, HomeScreenConfigType } from '../types/data-model/HomeScreenConfigModels'

type ApplicationDesignEditorProps = {
  currStudioTheme: ApplicationTheme;
  setCurrStudioTheme: (theme: ApplicationTheme) => {};
  setCurrConfig: (config: HomeScreenConfigType) => {};
}

declare var workstation: WorkstationModule

const ApplicationDesignEditor: React.FC<ApplicationDesignEditorProps> = ({ currStudioTheme, setCurrStudioTheme, setCurrConfig }) => {
  React.useEffect(() => {
    async function initEditor() {
      const stringifiedExtraContext = await workstation.window.getExtraContext()
      const { theme: prevTheme, config: prevConfig } = JSON.parse(stringifiedExtraContext) 
      setCurrStudioTheme(prevTheme)
      setCurrConfig(prevConfig)
      await env.window.setTitle(`${prevConfig.name} - Appearance`)
    }
    initEditor();

    env.window.addHandler(WindowEvent.CLOSE, async () => {
      let returnVal = await env.dialogs.confirmation({message: 'Apply theme to Application?'});
      if (returnVal === DialogValues.YES) {
        await env.window.setCloseInfo(JSON.stringify({ 
          currStudioTheme
        }))
      } else if (returnVal === DialogValues.CANCEL) {
        return false
      }
      env.window.close()
      return true
    });
  }, []);


  return (
    <div className='mstr-app-design-editor'>
      <DesignStudioToolbar theme={currStudioTheme} />
      <div className='content-section'>
        <SettingsPanel theme={currStudioTheme} />
        <PreviewPanel theme={currStudioTheme} />
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  currStudioTheme: selectDesignStudioTheme(state)
})

const connector = connect(mapState, {
  setCurrStudioTheme: Actions.setTheme,
  setCurrConfig: Actions.setCurrentConfig
})

export default connector(ApplicationDesignEditor)
