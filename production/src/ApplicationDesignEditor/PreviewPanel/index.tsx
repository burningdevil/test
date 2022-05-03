import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels'
import HomeScreenPreviewer from '../../modules/components/views/HomeScreenPreviewer'
import './styles.scss'
 
interface PreviewPanelProps {
  theme: ApplicationTheme;
  contentBundleFeatureEnable: boolean;
  defaultGroupEnable: boolean,
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ theme, contentBundleFeatureEnable, defaultGroupEnable }) => {
  
  return (
    <div className='mstr-app-theme-preview-panel'>
      <HomeScreenPreviewer contentBundleFeatureEnable = {contentBundleFeatureEnable} hasContent = {defaultGroupEnable}/>
    </div>
  )
}

const connector = connect(null, {})

export default connector(PreviewPanel)
