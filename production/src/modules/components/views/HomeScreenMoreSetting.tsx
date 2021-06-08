import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenMoreSetting.scss'
import { default as VC } from '../HomeScreenConfigConstant'
import { Button, Checkbox, Divider, Dropdown, Menu, Input, Tooltip} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { t } from '../../../i18n/i18next'

const MAX_UPDATE_INTERVAL = 2400;//100 days
const MAX_TIMEOUT = 9999;
const MAX_LOGGING_SIZE = 9999;
const MIN_METRIC_VALUE = 0;
const TOOLTIP_DISAPPEAR_TIME = 3000;
const DEFAULT_INTERVAL_HOURS = 24;
const sectionTitle = {
    DESC: t('mobileOnlyDesc'),
    SECURITY: t('security'),
    ACCESS: t('access'),
    CONNECTIVITY: t('connectivity'),
    LOGGING: t('logging'),
    CACHE: t('cache')
};
const sectionAccess = {
    ACCESS_PREFERENCE: t('allowPreference'),
    ACCESS_ADVANCED_SETTINGS: t('allowAdvancedSettings'),
    CHECK_UPDATE: t('checkUpdate'),
};
const sectionConnectivity = {
    NETWORK_TIMEOUT: t('networkTimeout'),
};
const sectionLogging = {
    MAX_LOG_SIZE: t('maxLogSize'),
    LOG_LEVEL: t('logLevel'),
};
const logLevelStr = {
    ALL: t('logAll'),
    INFO: t('logInfo'),
    WARNING: t('logWarning'),
    SEVERE: t('logServre'),
    OFF: t('logOff'),
};
const sectionCache = {
    CLEAR_CACHE_ON_CLOSE: t('clearCacheOnClose'),
    CLEAR_CACHE_ON_LOGOUT: t('clearCacheOnLogout'),
};
const metricStr = {
    HOURS: t('hours'),
    SECONDS: t('seconds'),
    ENTRIES: t('items'),
};
const tooltipStr = (min: string, max: string) => {
    return t('tooltipStr',  {min, max}) 
};

class HomeScreenMoreSetting extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    state = {
        intervalValid: true,
        timeoutValid: true,
        loggingSizeValid: true,
    }

    resetTooltipState = (dispatchAfter: number) => {
        setTimeout(() => {
            this.setState({
                intervalValid: true,
                timeoutValid: true,
                loggingSizeValid: true,
            })
        }, dispatchAfter);
    }

    // call back
    onInputChange = (type: string, value: any) => {
        const number = Number(value)
        let update = {}
        switch (type) {
            case VC.UPDATE_INTERVAL:
                const { updateInterval } = this.props.config.general
                // const interval = updatein
                const result = updateInterval === VC.UPDATE_INTERVAL_DISABLED ? DEFAULT_INTERVAL_HOURS * 60 : VC.UPDATE_INTERVAL_DISABLED;
                update = {[type]: result}
                break;
            case VC.UPDATE_INTERVAL_TEXT:
                const intervalValid = !(isNaN(number) || number < 0 || number > MAX_UPDATE_INTERVAL)
                this.setState({
                    intervalValid: intervalValid
                })
                if (!intervalValid) {
                    this.resetTooltipState(TOOLTIP_DISAPPEAR_TIME)
                    if (number > MAX_UPDATE_INTERVAL * 60) {
                        update = {[VC.UPDATE_INTERVAL]: MAX_UPDATE_INTERVAL * 60}
                    }
                } else {
                    update = {[VC.UPDATE_INTERVAL]: number * 60}
                }
                break;
            case VC.NETWORK_TIMEOUT:
                const timeoutValid = !(isNaN(number) || number < 0 || number > MAX_TIMEOUT)
                this.setState({
                    timeoutValid: timeoutValid
                })
                if (!timeoutValid) {
                    this.resetTooltipState(TOOLTIP_DISAPPEAR_TIME)
                    if (number > MAX_TIMEOUT) {
                        update = {[type]: MAX_TIMEOUT}
                    }
                } else {
                    update = {[type]: number}
                }
                break;
            case VC.MAX_LOG_SIZE:
                const logValid = !(isNaN(number) || number < 0 || number > MAX_LOGGING_SIZE)
                this.setState({
                    loggingSizeValid: logValid
                })
                if (!logValid) {
                    this.resetTooltipState(TOOLTIP_DISAPPEAR_TIME)
                    if (number > MAX_LOGGING_SIZE) {
                        update = {[type]: MAX_LOGGING_SIZE}
                    }
                } else {
                    update = {[type]: number}
                }
                break;
            case VC.CLEAR_CACHE_ON_LOGOUT:
                update = {[type]: value}
                break;
            case VC.DISABLE_ADVANCED_SETTINGS:
            case VC.DISABLE_PREFERENCES:
                update = {[type]: !value}
                break;
            case VC.CLEAR_CACHE_ON_CLOSE:
                update = {[VC.CACHE_CLEAR_MODE]: value ? VC.CLEAR_ON_CLOSE : VC.CLEAR_AUTOMATIC}
                break;
            default:
                update = {[type]: number}
                break;
        }
        this.props.updateCurrentConfig({[VC.GENERAL]: update})
    }

    //log
    logMenu = (level: number) => {
        return (
            <Menu onClick={(e) => this.onInputChange(VC.LOG_LEVEL, e.key)} selectedKeys={[`${level}`]}>
                <Menu.Item key={VC.LOG_LEVEL_ALL}>{logLevelStr.ALL}</Menu.Item>
                <Menu.Item key={VC.LOG_LEVEL_INFO}>{logLevelStr.INFO}</Menu.Item>
                <Menu.Item key={VC.LOG_LEVEL_WARNING}>{logLevelStr.WARNING}</Menu.Item>
                <Menu.Item key={VC.LOG_LEVEL_SEVERE}>{logLevelStr.SEVERE}</Menu.Item>
                <Menu.Item key={VC.LOG_LEVEL_OFF}>{logLevelStr.OFF}</Menu.Item>
            </Menu>
        );
    };

    logLevelMappingStr = (level: number) => {
        switch (level) {
            case VC.LOG_LEVEL_ALL:
                return logLevelStr.ALL;
            case VC.LOG_LEVEL_INFO:
                return logLevelStr.INFO;
            case VC.LOG_LEVEL_WARNING:
                return logLevelStr.WARNING;
            case VC.LOG_LEVEL_SEVERE:
                return logLevelStr.SEVERE;
            case VC.LOG_LEVEL_OFF:
                return logLevelStr.OFF;
            default:
                return logLevelStr.WARNING;
        }
    };

    inputRender = (visible: boolean, maxValue: number, suffix: string, disabled: boolean, value: number, onChange: React.ChangeEventHandler<HTMLInputElement>) => {
        return <Tooltip 
            overlayClassName="home-screen-moresetting-tooltip-overlay"
            visible={visible}
            placement="topLeft"
            title={
                <span>
                    <span className="icon-error"/>
                    {`  ${tooltipStr(MIN_METRIC_VALUE.toString(), maxValue.toString())}`}
                </span>
            }>
            <Input 
                className='home-screen-moresetting-cfg-advance-input' 
                suffix={suffix} 
                disabled={disabled}
                value={value}
                onBlur={() => this.resetTooltipState(0)}
                onChange={onChange} />
        </Tooltip>
    }

    checkboxRender = (checked: boolean, value: string, title: string) => {
        return <Checkbox 
                    checked={checked}
                    onChange={(e) => this.onInputChange(value, e.target.checked)}
                >
                {title}
                </Checkbox>
    }

    sectionTitleRender = (title: string) => {
        return <div className="home-screen-moresetting-title">{title}</div>
    }

    render() {
        const {
            disableAdvancedSettings,
            disablePreferences,
            updateInterval,
            networkTimeout,
            logLevel,
            maxLogSize,
            cacheClearMode,
            clearCacheOnLogout,
        } = this.props.config.general;

        return <div className="home-screen-moresetting-cfg-advance">
                    <div className="home-screen-moresetting-desc">
                        {sectionTitle.DESC}
                    </div>

                    {/* Access section */}
                    {this.sectionTitleRender(sectionTitle.ACCESS)}
                    <div>
                        {this.checkboxRender(!disablePreferences, VC.DISABLE_PREFERENCES, sectionAccess.ACCESS_PREFERENCE)}
                    </div> 
                    <div>
                        {this.checkboxRender(!disableAdvancedSettings, VC.DISABLE_ADVANCED_SETTINGS, sectionAccess.ACCESS_ADVANCED_SETTINGS)}
                    </div>
                    <div className="home-screen-moresetting-box">
                        <span>
                            {this.checkboxRender(updateInterval !== VC.UPDATE_INTERVAL_DISABLED, VC.UPDATE_INTERVAL, sectionAccess.CHECK_UPDATE)}
                        </span>
                        <span>
                            {this.inputRender(!this.state.intervalValid, MAX_UPDATE_INTERVAL, metricStr.HOURS, updateInterval === VC.UPDATE_INTERVAL_DISABLED, updateInterval === VC.UPDATE_INTERVAL_DISABLED ? DEFAULT_INTERVAL_HOURS : parseInt(updateInterval)/60, (e) => this.onInputChange(VC.UPDATE_INTERVAL_TEXT, e.target.value))}
                        </span>
                    </div>
                    <Divider/>
                    
                    {/* Connectivity section */}
                    {this.sectionTitleRender(sectionTitle.CONNECTIVITY)}
                    <div className="home-screen-moresetting-box">
                        <span>{sectionConnectivity.NETWORK_TIMEOUT}</span>
                        {this.inputRender(!this.state.timeoutValid, MAX_TIMEOUT, metricStr.SECONDS, false, parseInt(networkTimeout), (e) => this.onInputChange(VC.NETWORK_TIMEOUT, e.target.value))}
                    </div>
                    <Divider/>
            
                    {/* Log section */}
                    {this.sectionTitleRender(sectionTitle.LOGGING)}
                    <div className="home-screen-moresetting-cfg-advance-padding">
                        <div className='home-screen-moresetting-box'>
                            <span>{sectionLogging.MAX_LOG_SIZE}</span>
                            {this.inputRender(!this.state.loggingSizeValid, MAX_LOGGING_SIZE, metricStr.ENTRIES, false, parseInt(maxLogSize), (e) => this.onInputChange(VC.MAX_LOG_SIZE, e.target.value))}
                        </div>
                    </div>

                    <div className="home-screen-moresetting-box">
                        <span>{sectionLogging.LOG_LEVEL}</span>
                        <span className='home-screen-moresetting-cfg-advance-input log-dropdown'>
                            <Dropdown overlay={this.logMenu(logLevel)}>
                                <Button>
                                    <span>
                                        {this.logLevelMappingStr(logLevel)}
                                    </span>
                                    <div>
                                        <DownOutlined />
                                    </div>
                                </Button>
                            </Dropdown>
                        </span>
                    </div>
                    <Divider/>

                    {/* Cache section */}
                    {this.sectionTitleRender(sectionTitle.CACHE)}
                    {/* // disable clearOnClose for now. iOS client hasn't expose this feature yet.
                     <div>
                        {this.checkboxRender(cacheClearMode === VC.CLEAR_ON_CLOSE, VC.CLEAR_CACHE_ON_CLOSE, sectionCache.CLEAR_CACHE_ON_CLOSE)}
                    </div> */} 
                    <div>
                        {this.checkboxRender(clearCacheOnLogout, VC.CLEAR_CACHE_ON_LOGOUT, sectionCache.CLEAR_CACHE_ON_LOGOUT)}
                    </div>
                </div>
    }
}

const mapState = (state: RootState) => ({
    config: selectCurrentConfig(state),
})
  
const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})
  
export default connector(HomeScreenMoreSetting)