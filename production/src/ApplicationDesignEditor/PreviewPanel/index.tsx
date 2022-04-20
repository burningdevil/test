import * as React from 'react'
import { connect } from 'react-redux'
import { selectTheme } from '../../store/selectors/ApplicationDesignEditorSelector'
import { RootState } from '../../types/redux-state/HomeScreenConfigState'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import HomeScreenPreviewer from '../../modules/components/views/HomeScreenPreviewer'
import './styles.scss'
 
interface PreviewPanelProps {
  theme: ApplicationTheme;
  previewStyle: {
    width: string
  };
  contentBundleFeatureEnable: boolean;
  defaultGroupEnable: boolean,
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ theme, previewStyle, contentBundleFeatureEnable, defaultGroupEnable }) => {
  
  return (
    <div className='mstr-app-theme-preview-panel'>
      <HomeScreenPreviewer contentBundleFeatureEnable = {contentBundleFeatureEnable} hasContent = {defaultGroupEnable}/>
    </div>
  )
}

const mapState = (state: RootState) => ({
  theme: selectTheme(state)
})

const connector = connect(mapState, {
  
})

export default connector(PreviewPanel)
