import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import { env } from '../main'
import * as Actions from '../store/actions/ActionsCreator'
import PreviewPanel from './PreviewPanel'
import SettingsPanel from './SettingsPanel'
import { WorkstationModule, WindowEvent, DialogValues } from '@mstr/workstation-types'
import Resizer from './Components/Resizer'
import './styles.scss'
import { selectTheme } from '../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationTheme } from '../types/data-model/HomeScreenConfigModels'

type ApplicationDesignEditorProps = {
  theme: ApplicationTheme
  setAppTheme: any
}

const INIT_LEFT = 320
const MIN_LEFT = 180
const MAX_LEFT = 378

declare var workstation: WorkstationModule
const ApplicationDesignEditor: React.FC<ApplicationDesignEditorProps> = ({ theme, setAppTheme }) => {
  const [settingsPanelWidth, setSettingsPanelWidth] = React.useState(INIT_LEFT)
  const useEffect = React.useEffect;

  useEffect(() => {
    async function initEditor() {
      const theme = await workstation.window.getExtraContext()
      setAppTheme(JSON.parse(theme))
    }
    initEditor();

    workstation.window.addHandler(WindowEvent.CLOSE, async () => {
      let returnVal = await workstation.dialogs.confirmation({message: 'Apply theme to Application?'});
      if (returnVal == DialogValues.YES) {
        await workstation.window.setCloseInfo(JSON.stringify({ 
          theme
        }))
      }
      env.window.close()
      return { }
    });
  }, []);


  return (
    <div className='mstr-app-design-editor'>
      <div className='title-section'>
        <div className='label' ></div>
      </div>
      <div className='content-section'>
        <SettingsPanel />
        <Resizer
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
        />
        <PreviewPanel previewStyle={{ width: 'calc(100% - ' + (settingsPanelWidth) + 'px)' }}/>
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  theme: selectTheme(state)
})

const connector = connect(mapState, {
  setAppTheme: Actions.setTheme
})

export default connector(ApplicationDesignEditor)
