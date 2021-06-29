import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenMoreSetting.scss'
import { default as VC, sectionAccess, sectionCache, sectionConnectivity, sectionLogging, sectionTitle, logLevelStr, tooltipStr, metricStr } from '../HomeScreenConfigConstant'
import { Button, Checkbox, Divider, Dropdown, Menu, Input, Tooltip} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'

const classNamePrefix = 'home-screen-moresetting';
const MAX_UPDATE_INTERVAL = 2400;//100 days
const MAX_TIMEOUT = 9999;
const MAX_LOGGING_SIZE = 9999;
const MIN_METRIC_VALUE = 0;
const TOOLTIP_DISAPPEAR_TIME = 3000;
const DEFAULT_INTERVAL_HOURS = 24;

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

    inputRender = (visible: boolean, maxValue: number, suffix: string, suffixPlural: string, disabled: boolean, value: number, onChange: React.ChangeEventHandler<HTMLInputElement>) => {
        return <Tooltip 
            overlayClassName={`${classNamePrefix}-tooltip-overlay`}
            visible={visible}
            placement='topLeft'
            title={
                <span>
                    <span className={VC.FONT_ERROR}/>
                    {`  ${tooltipStr(MIN_METRIC_VALUE.toString(), maxValue.toString())}`}
                </span>
            }>
            <Input 
                className={`${classNamePrefix}-cfg-advance-input`} 
                suffix={value > 1 ? suffixPlural : suffix} 
                disabled={disabled}
                value={value}
                onBlur={() => this.resetTooltipState(0)}
                onChange={onChange} />
        </Tooltip>
    }

    checkboxRender = (checked: boolean, value: string, title: string) => {
        return <Checkbox id={value}
                    checked={checked}
                    onChange={(e) => this.onInputChange(value, e.target.checked)}
                >
                {title}
                </Checkbox>
    }

    sectionTitleRender = (title: string) => {
        return <div className={`${classNamePrefix}-title`} >{title}</div>
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

        return <div className={`${classNamePrefix}-cfg-advance`}>
                    <div className={`${classNamePrefix}-desc`}>
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
                    <div className={`${classNamePrefix}-box`}>
                        <span>
                            {this.checkboxRender(updateInterval !== VC.UPDATE_INTERVAL_DISABLED, VC.UPDATE_INTERVAL, sectionAccess.CHECK_UPDATE)}
                        </span>
                        <span>
                            {this.inputRender(!this.state.intervalValid, MAX_UPDATE_INTERVAL, metricStr.HOUR, metricStr.HOURS, updateInterval === VC.UPDATE_INTERVAL_DISABLED, updateInterval === VC.UPDATE_INTERVAL_DISABLED ? DEFAULT_INTERVAL_HOURS : parseInt(updateInterval)/60, (e) => this.onInputChange(VC.UPDATE_INTERVAL_TEXT, e.target.value))}
                        </span>
                    </div>
                    <Divider/>
                    
                    {/* Connectivity section */}
                    {this.sectionTitleRender(sectionTitle.CONNECTIVITY)}
                    <div className={`${classNamePrefix}-box`}>
                        <span>{sectionConnectivity.NETWORK_TIMEOUT}</span>
                        {this.inputRender(!this.state.timeoutValid, MAX_TIMEOUT, metricStr.SECOND, metricStr.SECONDS, false, parseInt(networkTimeout), (e) => this.onInputChange(VC.NETWORK_TIMEOUT, e.target.value))}
                    </div>
                    <Divider/>
            
                    {/* Log section */}
                    {this.sectionTitleRender(sectionTitle.LOGGING)}
                    <div className={`${classNamePrefix}-cfg-advance-padding`}>
                        <div className={`${classNamePrefix}-box`}>
                            <span>{sectionLogging.MAX_LOG_SIZE}</span>
                            {this.inputRender(!this.state.loggingSizeValid, MAX_LOGGING_SIZE, metricStr.ENTRY, metricStr.ENTRIES, false, parseInt(maxLogSize), (e) => this.onInputChange(VC.MAX_LOG_SIZE, e.target.value))}
                        </div>
                    </div>

                    <div className={`${classNamePrefix}-box`}>
                        <span>{sectionLogging.LOG_LEVEL}</span>
                        <span className={`${classNamePrefix}-cfg-advance-input log-dropdown`}>
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
                     <div>
                        {this.checkboxRender(cacheClearMode === VC.CLEAR_ON_CLOSE, VC.CLEAR_CACHE_ON_CLOSE, sectionCache.CLEAR_CACHE_ON_CLOSE)}
                    </div>
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