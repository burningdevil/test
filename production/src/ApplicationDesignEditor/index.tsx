import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import { env } from '../main'
import * as Actions from '../store/actions/ActionsCreator'
import PreviewPanel from './PreviewPanel'
import SettingsPanel from './SettingsPanel'
import DesignStudioToolbar from './DesignStudioToolbar'
import { WorkstationModule, WindowEvent, DialogValues } from '@mstr/workstation-types'
import Resizer from './Components/Resizer'
import './styles.scss'
import { selectTheme } from '../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationTheme, HomeScreenConfigType } from '../types/data-model/HomeScreenConfigModels'

type ApplicationDesignEditorProps = {
  theme: ApplicationTheme;
  setAppTheme: (theme: ApplicationTheme) => {};
  setConfig: (config: HomeScreenConfigType) => {};
}

const INIT_LEFT = 320
const MIN_LEFT = 180
const MAX_LEFT = 378

declare var workstation: WorkstationModule
const ApplicationDesignEditor: React.FC<ApplicationDesignEditorProps> = ({ theme, setAppTheme, setConfig }) => {
  const [settingsPanelWidth, setSettingsPanelWidth] = React.useState(INIT_LEFT)
  const useEffect = React.useEffect;

  useEffect(() => {
    async function initEditor() {
      const stringifiedExtraContext = await workstation.window.getExtraContext()
      const { theme, config } = JSON.parse(stringifiedExtraContext) 
      setAppTheme(theme)
      setConfig(config)
      await env.window.setTitle(`${config.name} - Appearance`)
    }
    initEditor();

    env.window.addHandler(WindowEvent.CLOSE, async () => {
      let returnVal = await env.dialogs.confirmation({message: 'Apply theme to Application?'});
      if (returnVal === DialogValues.YES) {
        await env.window.setCloseInfo(JSON.stringify({ 
          theme
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
      <DesignStudioToolbar theme={theme} />
      <div className='content-section'>
        <SettingsPanel theme={theme} />
        {
        // Temporarily disable resizer
        /* <Resizer
          onStop={(e: any, ui: any) => setSettingsPanelWidth(ui.x)}
          position={{
            x: settingsPanelWidth,
            y: 0
          }}
          style={{
            height: '100%',
            left: -4
          }}
          axis='x'
          bounds={{
            left: MIN_LEFT,
            right: MAX_LEFT
          }}
        /> */}
        <PreviewPanel theme={theme} previewStyle={{ width: 'calc(100% - ' + (settingsPanelWidth) + 'px)' }}/>
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  theme: selectTheme(state)
})

const connector = connect(mapState, {
  setAppTheme: Actions.setTheme,
  setConfig: Actions.setCurrentConfig
})

export default connector(ApplicationDesignEditor)
