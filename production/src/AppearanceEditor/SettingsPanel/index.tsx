import * as React from 'react';
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

type SettingsPanelProps = {
    theme: ApplicationTheme;
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme }) => {
    console.log('theme in settings panel ->', theme);
    return (
        <React.Fragment>
            <div className="mstr-app-theme-settings-panel">
                <div className="settings-panel-content">
                    <Logos />
                    <div className="mstr-divider"></div>
                    <Color />
                </div>
            </div>
        </React.Fragment>
    );
};

export default SettingsPanel;
