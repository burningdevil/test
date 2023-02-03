import * as React from 'react';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

type SettingsPanelProps = {
    isColorSupported: boolean;
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isColorSupported }) => {
    const settingsPanelRef = React.useRef(null);

    return (
        <div className="mstr-app-theme-settings-panel" ref={settingsPanelRef}>
            <div className="settings-panel-content">
                <Logos />

                {isColorSupported && (
                    <React.Fragment>
                        <div className="mstr-divider"></div>
                        <Color settingsPanelRef={settingsPanelRef.current} />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;
