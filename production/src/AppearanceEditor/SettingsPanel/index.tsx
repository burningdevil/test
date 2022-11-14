import * as React from 'react';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

const SettingsPanel: React.FC = () => {
    const settingsPanelRef = React.useRef(null);

    return (
        <div className="mstr-app-theme-settings-panel" ref={settingsPanelRef}>
            <div className="settings-panel-content">
                <Logos />
                <div className="mstr-divider"></div>
                <Color settingsPanelRef={settingsPanelRef.current} />
            </div>
        </div>
    );
};

export default SettingsPanel;
