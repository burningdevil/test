import * as React from 'react';
import { ApplicationTheme } from '../../types/data-model/HomeScreenConfigModels';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

const SettingsPanel: React.FC = () => {
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
