import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { Environment, WorkstationModule } from '@mstr/workstation-types'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import Previewer from '../Components/Previewer'
import './styles.scss'
import { selectCurrentConfigContentBundleIds, selectIsDossierAsHome } from '../../store/selectors/HomeScreenConfigEditorSelector'
import { isLibraryServerVersionMatch, isUserHasManageContentGroupPrivilege, LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION } from '../../utils'
 
interface PreviewPanelProps {
  theme: ApplicationTheme;
  isDossierHome?: boolean;
  contentBundleIds?: String[];
}

declare var workstation: WorkstationModule;

const PreviewPanel: React.FC<PreviewPanelProps> = ({ theme, isDossierHome, contentBundleIds }) => {
  const [contentBundleFeatureEnable, setContentBundleFeatureEnable] = React.useState(false);
  const [defaultGroupFeatureEnable, setDefaultGroupFeatureEnable] = React.useState(false);
  
  React.useEffect(() => {
    async function initPreviewPanel() {
      const currEnv : Environment = await workstation.environments.getCurrentEnvironment();
      const contentBundleEnable = !!currEnv.webVersion && isLibraryServerVersionMatch(currEnv.webVersion, LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION) && isUserHasManageContentGroupPrivilege(currEnv.privileges);
      setContentBundleFeatureEnable(contentBundleEnable);
      if (!isDossierHome) {
        const defaultGroupEnable = !_.isEmpty(contentBundleIds) && (contentBundleIds.length > 0) && (contentBundleEnable === true);
        setDefaultGroupFeatureEnable(defaultGroupEnable);
      }
    }

    initPreviewPanel();
  }, [])

  return (
    <div className='mstr-app-theme-preview-panel'>
      <Previewer theme={theme} contentBundleFeatureEnable={contentBundleFeatureEnable} hasContent={defaultGroupFeatureEnable}/>
    </div>
  )
}

const mapState = (state: RootState) => ({
  isDossierHome: selectIsDossierAsHome(state),
  contentBundleIds: selectCurrentConfigContentBundleIds(state)
})

const connector = connect(mapState, {})

export default connector(PreviewPanel)
