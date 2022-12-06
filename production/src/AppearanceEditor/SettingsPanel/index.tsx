import * as React from 'react';
import Logos from './Logos';
import Color from './Color';
import './styles.scss';

window.AppThemeColor = {
    enabledInternal: false,
    enabledListener: function(val: any) {},
    set enabled(val) {
      this.enabledInternal = val;
      this.enabledListener(val);
    },
    get enabled() {
      return this.enabledInternal;
    },
    registerListener: function(listener: any) {
      this.enabledListener = listener;
    }
  }

const SettingsPanel: React.FC = () => {
    const settingsPanelRef = React.useRef(null);
    const [isColorComponentEnabled, setIsColorComponentEnabled] = React.useState(window.AppThemeColor.enabled);
    
    window.AppThemeColor.registerListener(function(val: boolean) {
        setIsColorComponentEnabled(val);
      });
      
    return (
        <div className="mstr-app-theme-settings-panel" ref={settingsPanelRef}>
            <div className="settings-panel-content">
                <Logos />
                { isColorComponentEnabled ? (
                    <React.Fragment>
                        <div className="mstr-divider"></div>
                        <Color settingsPanelRef={settingsPanelRef.current} />
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
};

export default SettingsPanel;
