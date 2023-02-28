import * as React from 'react'
import { connect } from 'react-redux'
import '../scss/HomeScreenMoreSetting.scss'
import { default as VC, sectionAccess, sectionCache, sectionConnectivity, sectionLogging, sectionTitle, logLevelStr, tooltipStr, metricStr, sectionFeedback, localizedStrings } from '../HomeScreenConfigConstant'
import { Button, Checkbox, Divider, Dropdown, Menu, Input, Tooltip, Form} from 'antd';
import {Input as MstrInput} from '@mstr/rc';
import { DownOutlined } from '@ant-design/icons'
import { RootState } from '../../../types/redux-state/HomeScreenConfigState'
import { selectCurrentConfig } from '../../../store/selectors/HomeScreenConfigEditorSelector'
import * as Actions from '../../../store/actions/ActionsCreator'
import { WebVersionContext } from './HomeScreenConfigEditor'
import { LIBRARY_SERVER_VERSION_THRESHOLD, LIBRARY_SUPPORT_GRANULAR_CONTROL, isLibraryServerVersionMatch } from '../../../../src/utils'
import * as _ from 'lodash';
import { validateEmail } from '../features/custom-email-v2/custom-email.util';
import { ICON_KEY_ENUM } from './home-screen-components/icon-key-enum';

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
        reportProblemAddress: ''
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
        const currentConfig = this.props.config;
        const customizedItems = _.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`);
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
            case ICON_KEY_ENUM.mobile_helpAndLegal_reportProblem_addr:
                _.set(currentConfig, ICON_KEY_ENUM.mobile_helpAndLegal_reportProblem_addr, value);
                this.props.updateCurrentConfig(currentConfig);
                break;
            case VC.CACHE_SMART_DOWNLOAD:
                // const customizedItems = _.get(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`);
                customizedItems[VC.CACHE_SMART_DOWNLOAD] = value;
                _.set(currentConfig, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}`, customizedItems);
                this.props.updateCurrentConfig(currentConfig);
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
    validateInputRender = (disabled: boolean, value: string, onChange: React.ChangeEventHandler<HTMLInputElement>, placeholder?: string, enableValid?: boolean, errorMsg?: string) => {
        return <div className={`${classNamePrefix}-cfg-advance-email`}><MstrInput 
            disabled={disabled}
            value={value}
            placeholder= {placeholder}
            onValidate={
                (e: string) => {
                    return validateEmail(e);
                }
            }
            isErrorDisplayed= {true}
            errorMessage={localizedStrings.INVALID_EMAIL_ADDRESS}
            onBlur={() => this.resetTooltipState(0)}
            onChange={onChange} /> </div>
    
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
    renderGlobalSetting = () => {
        const reportEmailAddress = _.get(this.props.config, ICON_KEY_ENUM.mobile_helpAndLegal_reportProblem_addr) 
        return (
            <>
                <div className={`${classNamePrefix}-desc`}>
                        {sectionTitle.GLOBAL}
                </div>
                {/* Feedback email , not supported until the granular control*/}
                    {this.sectionTitleRender(sectionTitle.FEEDBACK)}
                        <div className={`${classNamePrefix}-box`}>
                            <span>{sectionFeedback.FEEDBACK_REPORT_EMAIL}</span>
                            {this.validateInputRender(false, reportEmailAddress, (e) => this.onInputChange(ICON_KEY_ENUM.mobile_helpAndLegal_reportProblem_addr, e.target.value), 'example@example.com', true, localizedStrings.INVALID_EMAIL_ADDRESS)}
                        </div>
                    <Divider/>

            </>
        )
    }
    renderMoreSetting = (version: string) => {
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
        const smart_download  = _.get(this.props.config, `${VC.HOME_SCREEN}.${VC.HOME_LIBRARY}.${VC.CUSTOMIZED_ITEMS}.${VC.CACHE_SMART_DOWNLOAD}`, true)
        return (
        <div className={`${classNamePrefix}-cfg-advance`}>
                    
                    {isLibraryServerVersionMatch(version, LIBRARY_SUPPORT_GRANULAR_CONTROL) && this.renderGlobalSetting()}
                    <div className={`${classNamePrefix}-desc`}>
                        {sectionTitle.DESC}
                    </div>

                    {/* Access section , supported until the granular control*/}
                    {
                        !isLibraryServerVersionMatch(version, LIBRARY_SUPPORT_GRANULAR_CONTROL) && <>
                        {this.sectionTitleRender(sectionTitle.ACCESS)}
                        <div className={`${classNamePrefix}-box`}>
                            {this.checkboxRender(!disablePreferences, VC.DISABLE_PREFERENCES, sectionAccess.ACCESS_PREFERENCE)}
                        </div> 
                        <div className={`${classNamePrefix}-box`}>
                            {this.checkboxRender(!disableAdvancedSettings, VC.DISABLE_ADVANCED_SETTINGS, sectionAccess.ACCESS_ADVANCED_SETTINGS)}
                        </div>
                        <Divider/>
                        </>
                    }
                    
                    
        
                    {/* Connectivity section */}
                    {this.sectionTitleRender(sectionTitle.CONNECTIVITY)}
                    <div className={`${classNamePrefix}-box`}>
                        <span>{sectionConnectivity.NETWORK_TIMEOUT}</span>
                        {this.inputRender(!this.state.timeoutValid, MAX_TIMEOUT, metricStr.SECOND, metricStr.SECONDS, false, parseInt(networkTimeout), (e) => this.onInputChange(VC.NETWORK_TIMEOUT, e.target.value))}
                    </div>
                    <Divider/>
            
                    {/* Log section */}
                    {this.sectionTitleRender(sectionTitle.LOGGING)}
                    <div className={`${classNamePrefix}-cfg-advance-paddingmini`}>
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
                     {/* <div className={`${classNamePrefix}-box`}>
                        {this.checkboxRender(cacheClearMode === VC.CLEAR_ON_CLOSE, VC.CLEAR_CACHE_ON_CLOSE, sectionCache.CLEAR_CACHE_ON_CLOSE)}
                    </div> */}
                    <div className={`${classNamePrefix}-box`}>
                        {this.checkboxRender(clearCacheOnLogout, VC.CLEAR_CACHE_ON_LOGOUT, sectionCache.CLEAR_CACHE_ON_LOGOUT)}
                    </div>
                    <div className={`${classNamePrefix}-box`}>
                        {this.checkboxRender(smart_download, VC.CACHE_SMART_DOWNLOAD, sectionCache.SMART_DOWNLOAD)}
                    </div>
                </div>
        )
    }
    render() {
        
        return (
            <WebVersionContext.Consumer>
            {(value) => {
                return (
                    this.renderMoreSetting(value.webVersion ?? LIBRARY_SERVER_VERSION_THRESHOLD)
                );
            }}
            </WebVersionContext.Consumer> 
        )
    }
}

const mapState = (state: RootState) => ({
    config: selectCurrentConfig(state),
})
  
const connector = connect(mapState, {
    updateCurrentConfig: Actions.updateCurrentConfig
})
  
export default connector(HomeScreenMoreSetting)