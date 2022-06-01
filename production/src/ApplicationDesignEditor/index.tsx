import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { RootState } from '../types/redux-state/HomeScreenConfigState'
import { env } from '../main'
import * as Actions from '../store/actions/ActionsCreator'
import PreviewPanel from './PreviewPanel'
import SettingsPanel from './SettingsPanel'
import DesignStudioToolbar from './DesignStudioToolbar'
import { WorkstationModule, WindowEvent, DialogValues } from '@mstr/workstation-types'
import { t } from '../i18n/i18next';
import { selectCurrentConfigTheme } from '../store/selectors/HomeScreenConfigEditorSelector'
import { selectDesignStudioTheme } from '../store/selectors/ApplicationDesignEditorSelector'
import { ApplicationTheme, HomeScreenConfigType } from '../types/data-model/HomeScreenConfigModels'
import './styles.scss'

type ApplicationDesignEditorProps = {
  savedConfigTheme: ApplicationTheme;
  currStudioTheme: ApplicationTheme;
  setCurrStudioTheme: (theme: ApplicationTheme) => {};
  setCurrConfig: (config: HomeScreenConfigType) => {};
}

declare var workstation: WorkstationModule;

const ApplicationDesignEditor: React.FC<ApplicationDesignEditorProps> = ({ savedConfigTheme, currStudioTheme, setCurrStudioTheme, setCurrConfig }) => {
  // use refs so our confirmBeforeClosing function can be used as a callback without worrying about referencing stale variables
  const savedConfigThemeRef = React.useRef(savedConfigTheme);
  const currStudioThemeRef = React.useRef(currStudioTheme);
  const currApplicationName = React.useRef('');
  savedConfigThemeRef.current = savedConfigTheme;
  currStudioThemeRef.current = currStudioTheme;

  // if saved config (aka previous config) is different from curr config, prompt user to save on close
  const confirmBeforeClosing = async () => {
    const isThemeDirty = !_.isEqual(savedConfigThemeRef, currStudioThemeRef);
    if (isThemeDirty) {
      let res = await env.dialogs.confirmation({message: t('applyThemeConfirmationStr').replace('{{application}}', currApplicationName.current)});
      if (res === DialogValues.YES) {
        // yes
        await env.window.setCloseInfo(JSON.stringify(currStudioThemeRef.current));
        env.window.close();
      } else if (res === DialogValues.NO) {
        // no
        env.window.close();
      } else {
        // cancel
        return;
      }
    } else {
      env.window.close();
    }
  };
  
  React.useEffect(() => {
    // initiate Redux Store with information passed from Config Editor window
    async function initEditor() {
      const stringifiedExtraContext = await workstation.window.getExtraContext();
      const { theme: prevTheme, config: prevConfig } = JSON.parse(stringifiedExtraContext);
      currApplicationName.current = prevConfig.name;
      setCurrStudioTheme(prevTheme);
      setCurrConfig(prevConfig);
      await env.window.setTitle(t('designStudioWindowTitle').replace('{{application}}', currApplicationName.current));
    }
    initEditor();

    // add handler so when parent window (Config Editor) closes, we should also close this window
    env.window.addHandler(WindowEvent.ONPARENTCLOSE, async () => {
      // TODO: should it prompt user to save when parent window closes or should it force close without warning? currently, we cannot save the config
      // due to parent window already being closed by the time this callback is called. therefore, updating the config won't make a difference since
      // we can't save to the server from the Design Studio window.
      env.window.close();
    });
    
    env.window.addHandler(WindowEvent.CLOSE, confirmBeforeClosing);
  }, []);

  return (
    <div className='mstr-app-design-editor'>
      <DesignStudioToolbar theme={currStudioTheme} handleClose={confirmBeforeClosing} />
      <div className='content-section'>
        <SettingsPanel theme={currStudioTheme} />
        <PreviewPanel theme={currStudioTheme} />
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  savedConfigTheme: selectCurrentConfigTheme(state),
  currStudioTheme: selectDesignStudioTheme(state)
})

const connector = connect(mapState, {
  setCurrStudioTheme: Actions.setTheme,
  setCurrConfig: Actions.setCurrentConfig
})

export default connector(ApplicationDesignEditor)
