import * as React from 'react';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

const SettingsPanel: React.FC = () => {
    return (
        <div className="mstr-app-theme-settings-panel">
            <div className="settings-panel-content">
                <Logos />
                <div className="mstr-divider"></div>
                <Color />
            </div>
        </div>
    );
};

export default SettingsPanel;
