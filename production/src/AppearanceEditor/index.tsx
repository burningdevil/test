import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import * as Actions from '../store/actions/ActionsCreator'
import PreviewPanel from './PreviewPanel'
import SettingsPanel from './SettingsPanel'
import AppearanceEditorToolbar from './AppearanceEditorToolbar'
import { WorkstationModule, WindowEvent, DialogValues } from '@mstr/workstation-types'
import { t } from '../i18n/i18next';
import { selectCurrentConfigTheme } from '../store/selectors/HomeScreenConfigEditorSelector'
import { selectAppearanceEditorTheme } from '../store/selectors/AppearanceEditorSelector'
import { ApplicationTheme, HomeScreenConfigType } from '../types/data-model/HomeScreenConfigModels'
import { 
  LIBRARY_SERVER_SUPPORT_APP_THEME_COLOR_VERSION,
  checkFeatureEnable
} from '../utils';
import './styles.scss'

type AppearanceEditorProps = {
  savedConfigTheme: ApplicationTheme;
  currEditorTheme: ApplicationTheme;
  setCurrEditorTheme: (theme: ApplicationTheme) => {};
  setCurrConfig: (config: HomeScreenConfigType) => {};
}

declare var workstation: WorkstationModule;

/*window.workstation = {
  window: {
    close: () => {},
    setCloseInfo: () => {},
    setTitle: () => {},
    addHandler: () => {},
    getExtraContext: () => {}
  },
  dialogs: {
    confirmation: () => {}
  }

};*/

const AppearanceEditor: React.FC<AppearanceEditorProps> = ({ savedConfigTheme, currEditorTheme, setCurrEditorTheme, setCurrConfig }) => {
  // use refs so our confirmBeforeClosing function can be used as a callback without worrying about referencing stale variables
  const savedConfigThemeRef = React.useRef(savedConfigTheme);
  const currEditorThemeRef = React.useRef(currEditorTheme);
  const currApplicationName = React.useRef('');
  const [isAppThemeColorSupported, setIsAppThemeColorSupported] = React.useState(false);
  savedConfigThemeRef.current = savedConfigTheme;
  currEditorThemeRef.current = currEditorTheme;

  // if saved config (aka previous config) is different from curr config, prompt user to save on close
  const confirmBeforeClosing = async () => {
    const isThemeDirty = !_.isEqual(savedConfigThemeRef, currEditorThemeRef);
    if (isThemeDirty) {
      let res = await workstation.dialogs.confirmation({message: t('applyThemeConfirmationStr').replace('{{application}}', currApplicationName.current)});
      if (res === DialogValues.YES) {
        // yes
        await workstation.window.setCloseInfo(JSON.stringify(currEditorThemeRef.current));
        workstation.window.close();
      } else if (res === DialogValues.NO) {
        // no
        workstation.window.close();
      } else {
        // cancel
        return;
      }
    } else {
      workstation.window.close();
    }
  };

  React.useEffect(() => {
    // initiate Redux Store with information passed from Config Editor window
    async function initEditor() {
      const stringifiedExtraContext = await workstation.window.getExtraContext();
      const { theme: prevTheme, config: prevConfig } = JSON.parse(stringifiedExtraContext);
      currApplicationName.current = prevConfig.name;
      setCurrEditorTheme(prevTheme);
      setCurrConfig(prevConfig);
      const currentEnv = await workstation.environments.getCurrentEnvironment();    
      const isColorSupported = checkFeatureEnable(currentEnv, LIBRARY_SERVER_SUPPORT_APP_THEME_COLOR_VERSION);
      setIsAppThemeColorSupported(isColorSupported);
      await workstation.window.setTitle(t('appearanceEditorWindowTitle').replace('{{application}}', currApplicationName.current));
    }
    initEditor();


    // add handler so when parent window (Config Editor) closes, we should also close this window
    workstation.window.addHandler(WindowEvent.ONPARENTCLOSE, async () => {
      // TODO: should it prompt user to save when parent window closes or should it force close without warning? currently, we cannot save the config
      // due to parent window already being closed by the time this callback is called. therefore, updating the config won't make a difference since
      // we can't save to the server from the Appearance Editor window.
      workstation.window.close();
    });

    workstation.window.addHandler(WindowEvent.CLOSE, confirmBeforeClosing);
  }, []);

  return (
    <div className='mstr-appearance-editor'>
      <AppearanceEditorToolbar theme={currEditorTheme} handleClose={confirmBeforeClosing} />
      <div className='content-section'>
        <SettingsPanel isColorSupported={isAppThemeColorSupported} />
        <PreviewPanel theme={currEditorTheme} />
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  savedConfigTheme: selectCurrentConfigTheme(state),
  currEditorTheme: selectAppearanceEditorTheme(state)
})

const connector = connect(mapState, {
  setCurrEditorTheme: Actions.setTheme,
  setCurrConfig: Actions.setCurrentConfig
})

export default connector(AppearanceEditor)
