import * as React from 'react'
import '../scss/HomeScreenMoreSetting.scss'
import { default as VC } from '../HomeScreenConfigConstant'
import { Button, Checkbox, Divider, Dropdown, Menu, Icon, Input, Tooltip} from 'antd';
import * as _ from "lodash";

const MAX_UPDATE_INTERVAL = 2400;//100 days
const MAX_TIMEOUT = 9999;
const MAX_LOGGING_SIZE = 9999;
const MIN_METRIC_VALUE = 0;
const defaultGeneral = {
    'disableAdvancedSettings': false,
    'disablePreferences': false,
    'networkTimeout': VC.DEFAULT_NETWORK_TIMEOUT,
    'updateInterval': VC.UPDATE_INTERVAL_DISABLED,
    'maxLogSize': VC.DEFAULT_MAX_LOG_SIZE,
    'logLevel': VC.LOG_LEVEL_WARNING, // All=0, Info=10, Warning=12, Severe=14, Off=16
    'cacheClearMode': VC.CLEAR_AUTOMATIC,// clear cache on close 1-false / 2-true
    'clearCacheOnLogout': false,
};
const TOOLTIP_DISAPPEAR_TIME = 3000;
const DEFAULT_INTERVAL_HOURS = 24;
const sectionTitle = {
    SECURITY: 'Security',
    ACCESS: 'Access',
    CONNECTIVITY: 'Connectivity',
    LOGGING: 'Logging',
    CACHE: 'Cache'
};
// const sectionAuth = {
//     AUTH_MODE: 'Authentication Modes',
// };
// const authModesStr = {
//     STANDARD: 'Standard',
//     AZURE: 'MicoSoft Azure',
//     SAML: 'SAML',
//     LDAP: 'LDAP',
//     GUEST: 'Guest',
//     INTEGRATED: 'Integrated',
//     TRUESTED: 'Truested'
// };
const sectionAccess = {
    CHECK_UPDATE: 'Check and update configuration every',
};
const sectionConnectivity = {
    NETWORK_TIMEOUT: 'Network Timeout',
};
const sectionLogging = {
    MAX_LOG_SIZE: 'Maximum Log Size',
    LOG_LEVEL: 'Logging Level',
};
const logLevelStr = {
    ALL: 'All',
    INFO: 'Message',
    WARNING: 'Warning',
    SEVERE: 'Error',
    OFF: 'Off',
};
const sectionCache = {
    CLEAR_CACHE_ON_CLOSE: 'Clear Caches when the application closes',
    CLEAR_CACHE_ON_LOGOUT: 'Clear Caches on logout',
};
const metricStr = {
    HOURS: 'hours',
    SECONDS: 'seconds',
    ENTRIES: 'entries',
};
const tooltipStr = (min: number, max: number) => {
    return 'The value must be between ' +  [min] + ' and ' + [max];;
};

export default class HomeScreenMoreSetting extends React.Component<any, any> {
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

    onInputChange = (type: string, value: any) => {
        const number = Number(value)
        let update = {}
        switch (type) {
            // case authModesStr.STANDARD:
            // case authModesStr.AZURE:
            // case authModesStr.SAML:
            // case authModesStr.LDAP:
            // case authModesStr.GUEST:
            // case authModesStr.INTEGRATED:
            // case authModesStr.TRUESTED:
            //     const { auth } = this.props.general
            //     let result = number === 0 ? _.pull(auth, type) : _.concat(auth, type)
            //     update = {auth: result}
            //     break;
            case VC.UPDATE_INTERVAL:
                const { updateInterval } = this.props.general
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
            case VC.CLEAR_CACHE_ON_CLOSE:
                update = {[type]: value ? 2 : 1}
                break;
            default:
                update = {[type]: number}
                break;
        }
        this.props.handleChange({general: update})
    }

    //auth modes
    singleAuthCheckbox = (key: string, text: string, auths: [string]) => {
        return (<Checkbox key={key} checked={auths.includes(key)}
                    disabled={false}
                    onChange={(e) => this.onInputChange(key, e.target.checked)}>
                    {text}
                </Checkbox>
                )
    }

    // authModesCheckboxs = (auths: [string]) => {
    //     return (
    //         <div className="home-screen-moresetting-box-vertical">
    //             { this.singleAuthCheckbox(authModesStr.STANDARD, authModesStr.STANDARD, auths) }
    //             { this.singleAuthCheckbox(authModesStr.AZURE, authModesStr.AZURE, auths) }
    //             { this.singleAuthCheckbox(authModesStr.SAML, authModesStr.SAML, auths) }
    //             { this.singleAuthCheckbox(authModesStr.LDAP, authModesStr.LDAP, auths) }
    //             { this.singleAuthCheckbox(authModesStr.GUEST, authModesStr.GUEST, auths) }
    //             { this.singleAuthCheckbox(authModesStr.INTEGRATED, authModesStr.INTEGRATED, auths) }
    //             { this.singleAuthCheckbox(authModesStr.TRUESTED, authModesStr.TRUESTED, auths) }
    //         </div>
    //     )
    // }

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

    render() {
        const {
            updateInterval,
            networkTimeout,
            logLevel,
            maxLogSize,
            cacheClearMode,
            clearCacheOnLogout,
        } = this.props.general;

        return <div className="home-screen-moresetting-cfg-advance">
                    {/* Security section */}
                    {/* <div className="home-screen-moresetting-title">
                        {sectionTitle.SECURITY}
                        <div className="home-screen-moresetting-box-top">
                            <div className="home-screen-moresetting-text">
                                {sectionAuth.AUTH_MODE}
                            </div>
                            {this.authModesCheckboxs(auth)}
                        </div>
                    </div>

                    <Divider/> */}
                    {/* Access section */}
                    <div className="home-screen-moresetting-title">
                        {sectionTitle.ACCESS}
                    </div>
                    <div className="home-screen-moresetting-box">
                        <Checkbox
                            checked={updateInterval != VC.UPDATE_INTERVAL_DISABLED}
                            onChange={(e) => this.onInputChange(VC.UPDATE_INTERVAL, e.target.checked)}>
                            {sectionAccess.CHECK_UPDATE}
                        </Checkbox>
                        <Tooltip overlayClassName="home-screen-moresetting-tooltip-overlay"
                            visible={!this.state.intervalValid}
                            placement="topLeft"
                            title={
                                <span>
                                    <span className="icon-error"/>
                                    {`  ${tooltipStr(MIN_METRIC_VALUE, MAX_UPDATE_INTERVAL)}`}
                                </span>
                            }
                        >
                            <Input 
                                className='home-screen-moresetting-cfg-advance-input' 
                                suffix={metricStr.HOURS} 
                                disabled={updateInterval === VC.UPDATE_INTERVAL_DISABLED}
                                value={updateInterval === VC.UPDATE_INTERVAL_DISABLED ? DEFAULT_INTERVAL_HOURS : parseInt(updateInterval) / 60}
                                onBlur={() => this.resetTooltipState(0)}
                                onChange={(e) => this.onInputChange(VC.UPDATE_INTERVAL_TEXT, e.target.value)} />
                        </Tooltip>
                    </div>

                    <Divider/>
                    {/* Connectivity section */}
                    <div className = "home-screen-moresetting-cfg-advance-padding">
                        <span className="home-screen-moresetting-title">
                            {sectionTitle.CONNECTIVITY}
                        </span>
                    </div>
                    <div className="home-screen-moresetting-box">
                        <div>
                            <span>{sectionConnectivity.NETWORK_TIMEOUT}</span>
                        </div>
                        <Tooltip
                            overlayClassName="home-screen-moresetting-tooltip-overlay"
                            visible={!this.state.timeoutValid}
                            placement="topLeft"
                            title={
                                <span>
                                    <span className="icon-error"/>
                                    {`  ${tooltipStr(MIN_METRIC_VALUE, MAX_TIMEOUT)}`}
                                </span>}>
                            <Input
                                className='home-screen-moresetting-cfg-advance-input timeout-input'
                                suffix={metricStr.SECONDS}
                                disabled={false}
                                value={parseInt(networkTimeout)}
                                onBlur={() => this.resetTooltipState(0)}
                                onChange={(e) => this.onInputChange(VC.NETWORK_TIMEOUT, e.target.value)} />
                        </Tooltip>
                    </div>
                    <Divider/>
            
                    {/* Log section */}
                    <div className='home-screen-moresetting-cfg-advance-padding'>
                        <span className="home-screen-moresetting-title">{sectionTitle.LOGGING}</span>
                    </div>
                    <div className="home-screen-moresetting-box">
                        <div className='home-screen-moresetting-cfg-advance-padding'>
                            <span>{sectionLogging.MAX_LOG_SIZE}</span>
                        </div>
                        <Tooltip
                            overlayClassName="home-screen-moresetting-tooltip-overlay"
                            visible={!this.state.loggingSizeValid}
                            placement="topLeft"
                            title={
                                <span>
                                    <span className="icon-error"/>
                                    {`  ${tooltipStr(MIN_METRIC_VALUE, MAX_LOGGING_SIZE)}`}
                                </span>}>
                            <Input
                                className='home-screen-moresetting-cfg-advance-input log-input'
                                suffix={metricStr.ENTRIES}
                                disabled={false}
                                value={parseInt(maxLogSize)}
                                defaultValue={maxLogSize}
                                onBlur={() => this.resetTooltipState(0)}
                                onChange={(e) => this.onInputChange(VC.MAX_LOG_SIZE, e.target.value)} />
                        </Tooltip>
                    </div>

                    <div className="home-screen-moresetting-box">
                        <div>
                            <span>{sectionLogging.LOG_LEVEL}</span>
                        </div>
                        <div className='home-screen-moresetting-cfg-advance-input log-dropdown'>
                            <Dropdown overlay={this.logMenu(logLevel)}>
                                <Button>
                                    <span>
                                        {this.logLevelMappingStr(logLevel)}
                                    </span>
                                    <div>
                                        <Icon type="down" theme="outlined" />
                                    </div>
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                    <Divider/>

                    {/* Cache section */}
                    <div className='home-screen-moresetting-cfg-advance-padding'>
                        <span className="home-screen-moresetting-title">{sectionTitle.CACHE}</span>
                    </div>
                    <div className="home-screen-moresetting-box-vertical">
                        <Checkbox
                            defaultChecked={cacheClearMode === 2}
                            onChange={(e) => this.onInputChange(VC.CLEAR_CACHE_ON_CLOSE, e.target.checked)}>
                            {sectionCache.CLEAR_CACHE_ON_CLOSE}
                        </Checkbox>
                        <Checkbox
                            defaultChecked={clearCacheOnLogout}
                            onChange={(e) => this.onInputChange(VC.CLEAR_CACHE_ON_LOGOUT, e.target.checked)}>
                            {sectionCache.CLEAR_CACHE_ON_LOGOUT}
                        </Checkbox>
                    </div>
                </div>
    }
}