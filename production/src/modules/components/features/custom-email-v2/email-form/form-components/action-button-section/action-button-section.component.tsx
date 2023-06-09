import * as React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@mstr/rc';
import { Select } from 'antd';
import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import { CustomEmailSettingType, MobileButtonLinkEnum } from '../../../../../../../../src/types/data-model/HomeScreenConfigModels';
import { decodeContent, encodeContent, PRIMARY_BLUE_HEX_COLOR, validateHttpUrl, validatePortalUrl, validateScheme, WHITE_HEX_COLOR } from '../../../custom-email.util';
import { FormMobileButtonLinkInputModel } from '../form-input.model';
import * as _ from 'lodash';
import { customEmailStringDict, CUSTOM_EMAIL_HOST_PORTAL_HELP_LINK, CUSTOM_EMAIL_WHITE_LIST_HELP_LINK } from '../../../../../HomeScreenConfigConstant';
import OverflowText from '../../../../../../../../src/modules/components/common-components/overflow-text/overflow-text';
import FormInput from '../form-input/form-input.component';
import FormBtnColor from '../form-btn-color/form-btn-color.component';
import FormSwitch from '../form-switch/form-switch.component';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import * as api from '../../../../../../../services/Api';
import { awaitWrap } from '../../../../../../../../src/modules/components/views/HomeScreenUtils';
const classNamePrefix = 'custom-email-form-v2'
const { Option } = Select;
const { TextArea} = Input;
interface ActionButtonSectionInput {
    env: any;
    validate: Function;
    stateData: CustomEmailSettingType;
    ref?: any;
}
const ActionButtonSection: React.FC<ActionButtonSectionInput> = React.forwardRef((props: ActionButtonSectionInput
    , ref ) => {
        const dispatch = useDispatch();
        const {env, validate, stateData} = props;
        // action button
        const [showButton1, setShowButton1] = useState(stateData.showBrowserButton);
        const [button1Text, setButton1Text] = useState(stateData?.button?.browserButtonStyle?.text ? decodeContent(stateData?.button?.browserButtonStyle?.text): customEmailStringDict.formGroup.actionButton.button1_default)
        const [button1FontColor, setButton1FontColor] = useState( stateData?.button?.browserButtonStyle?.fontColor?? WHITE_HEX_COLOR);
        const [button1BgColor, setButton1BgColor] =  useState(stateData?.button?.browserButtonStyle?.backgroundColor ?? PRIMARY_BLUE_HEX_COLOR);
        const [hostWebPortal, setHostWebPortal] = useState(decodeContent(stateData.hostPortal));
        const [showButton2, setShowButton2] = useState(stateData.showMobileButton);
        const [mobileBtnLinkType, setMobileBtnLinkType] = useState(stateData?.button?.mobileButtonLinkType ? stateData?.button?.mobileButtonLinkType : MobileButtonLinkEnum.DEFAULT);
        const [mobileButtonScheme, setMobileButtonScheme] = useState(stateData?.button?.mobileButtonScheme ? stateData?.button?.mobileButtonScheme : 'dossier');
        const [mobileButtonLinkDefault, setMobileButtonLinkDefault] = useState('');
        const [button2Text, setButton2Text] = useState(stateData?.button?.mobileButtonStyle?.text ? decodeContent(stateData?.button?.mobileButtonStyle?.text) : customEmailStringDict.formGroup.actionButton.button2_default);
        const [button2FontColor, setButton2FontColor] = useState(stateData?.button?.mobileButtonStyle?.fontColor ??  WHITE_HEX_COLOR);
        const [button2BgColor, setButton2BgColor] =  useState(stateData?.button?.mobileButtonStyle?.backgroundColor ?? PRIMARY_BLUE_HEX_COLOR);
        const [showDescription, setShowDescription] = useState(Reflect.has(stateData, 'showButtonDescription') ? stateData.showButtonDescription : stateData.showBrowserButton && stateData.showMobileButton);
        const [actionDescription, setActionDescription]= useState(stateData?.button?.description ?  decodeContent(stateData?.button?.description) : customEmailStringDict.formGroup.actionButton.descriptionDefaultStr);
        const [isWhiteListRequestLoaded, setWhiteListRequestLoaded] = useState(false);
        const [isWhiteListRequestFailed, setWhiteListRequestFailed] = useState(false);
        const [whiteListUrls, setWhiteListUrls] = useState([]);
        const [allowAllOrigins, setAllowAllOrigins] =  useState(false);
        const [showAclForbidden, setShowAclForbidden] = useState(false);
        React.useImperativeHandle(ref, () => ({

            reset() {
                
                _.set(stateData, 'showBrowserButton', true);
                _.set(stateData, 'showMobileButton', true);
                _.set(stateData, 'showButtonDescription', true);
                _.set(stateData, 'hostPortal', '');
                _.set(stateData, 'button', JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING['button'])));
                dispatch(
                    Actions.updateCurrentConfig({
                        emailSettings: stateData
                    })
                )
                // update local state
                setShowButton1(true);
                setShowButton2(true);
                setShowDescription(true);
                setButton1Text(stateData?.button?.browserButtonStyle?.text);
                setButton1FontColor(stateData?.button?.browserButtonStyle?.fontColor);
                setButton1BgColor(stateData?.button?.browserButtonStyle?.backgroundColor);
                setHostWebPortal(stateData.hostPortal);
                setMobileBtnLinkType(stateData?.button?.mobileButtonLinkType);
                setMobileButtonScheme(stateData?.button?.mobileButtonScheme);
                setButton2Text(stateData?.button?.mobileButtonStyle?.text);
                setButton2FontColor(stateData?.button?.mobileButtonStyle?.fontColor);
                setButton2BgColor(stateData?.button?.mobileButtonStyle?.backgroundColor);
                setActionDescription(stateData?.button?.description);

            }
        
          }));
        React.useEffect(() => {
            if (!isWhiteListRequestLoaded) {
                const fetchData = async () => {
                    const [error , data] = await awaitWrap(api.fetchAllWhiteListUrls());
                    if(error){
                        const statusCode = error?.statusCode;
                        if(statusCode === 403){
                            setShowAclForbidden(true);
                        }else {
                            setWhiteListRequestFailed(true);
                        }
                    }
                    /**
                     *  if the allowAllOrigins = true, means the security select all. All valid url pass
                     *  allowedOrigins: the white list
                     *  if the security select the None, the property allowedOrigins will be null. All url fail.
                     */
                    const allowAllOrigins = (data as any)?.allowAllOrigins;
                    const allowedOrigins = (data as any)?.allowedOrigins;
                    if(allowedOrigins?.length){
                        setWhiteListUrls(allowedOrigins);
                    }
                    if(allowAllOrigins){
                        setAllowAllOrigins(allowAllOrigins);
                    }
                    // make sure the api request trigger only once.
                    setWhiteListRequestLoaded(true);
                  }
                fetchData();
                
            }
        }, [])
        React.useEffect(() => {
            if(!isWhiteListRequestLoaded) return;
            // init validate the hostPortal
            const validMsg = validatePortalUrl(whiteListUrls, allowAllOrigins, env?.url, hostWhiteListTip, hostWebPortal);
            if( validMsg !== true){
                dispatch(Actions.setCustomEmailNameError(true));
            }
        }, [isWhiteListRequestLoaded])
        React.useEffect(() => {
            if(env){
                // encapsule the default url of the mobile button link. 
                let url;
                if(mobileBtnLinkType === MobileButtonLinkEnum.DEFAULT){
                    url = `dossier` + `://?url=${env.url}`
                }else if(mobileBtnLinkType === MobileButtonLinkEnum.APP_SCHEME){
                    url = `://?url=${env.url}`
                }else if(mobileBtnLinkType === MobileButtonLinkEnum.UNIVERSAL_LINK){
                    url = env.url;
                }
                setMobileButtonLinkDefault(url); 
            }
        }, [mobileBtnLinkType, mobileButtonScheme])

        // special handling
        React.useEffect(() => {
            if(!showButton1 && !showButton2){
                setShowDescription(false);
                _.set(stateData, 'showButtonDescription', false);
                dispatch(
                    Actions.updateCurrentConfig({
                        emailSettings: stateData
                    })
                )
            }
        }, [showButton1, showButton2]);
        const hostTooltip = (
            <div>
                {customEmailStringDict.formGroup.actionButton.hostTooltip}
                <br/>
                {customEmailStringDict.formGroup.actionButton.portalLinkNotInWhiteListTip1}
                <br/>
                {customEmailStringDict.formGroup.actionButton.portalLinkNotInWhiteListTip2}
                <a 
                target = "_blank"
                rel="noopener"
                href={CUSTOM_EMAIL_HOST_PORTAL_HELP_LINK} style = {{'marginLeft': '8px'}}>{customEmailStringDict.formGroup.actionButton.hostTooltipHelp}</a>
            </div>
        )
        const hostWhiteListTip = (
            <span>
                {customEmailStringDict.formGroup.actionButton.portalLinkNotInWhiteListMsg}
                <a 
                target = "_blank"
                rel="noopener"
                href={CUSTOM_EMAIL_WHITE_LIST_HELP_LINK} style = {{'marginLeft': '8px'}}>{customEmailStringDict.formGroup.actionButton.hostTooltipHelp}</a>
            </span>
        )

          const renderMobileButtonLink = (mobileButtonLinkInput: FormMobileButtonLinkInputModel) => {
            const {label, value, cb, elementId, placeholder, propertyPath, enableValidate, errorMessage, validateCb, linkType} = mobileButtonLinkInput;
            const handleChange = (val: MobileButtonLinkEnum) => {
                setMobileBtnLinkType(val);
                _.set(stateData, 'button.mobileButtonLinkType', val);
                dispatch(
                    Actions.updateCurrentConfig({
                        emailSettings: stateData
                    })
                )
              };
            return (
                <div className={`${classNamePrefix}-box mobile-link-box`}>
                    <span>{label}
                    </span>
                    <Select dropdownMatchSelectWidth={130} size="small" onChange={handleChange} defaultValue= {MobileButtonLinkEnum.DEFAULT} value = {linkType} bordered={false}>
                        <Option className = {'selection-option'} value={MobileButtonLinkEnum.DEFAULT}>{customEmailStringDict.formGroup.actionButton.scheme_default}</Option>
                        <Option value={MobileButtonLinkEnum.APP_SCHEME}>{customEmailStringDict.formGroup.actionButton.scheme_app}</Option>
                        <Option value={MobileButtonLinkEnum.UNIVERSAL_LINK}>{customEmailStringDict.formGroup.actionButton.scheme_universal}</Option>
                    </Select>
                    {(mobileBtnLinkType === MobileButtonLinkEnum.APP_SCHEME) && <Input
                        style={{width: '68px'}}
                        value={value}
                        onValidate={(e: string) => {
                            return enableValidate ? validate(e, 'mobileButtonScheme', validateCb) : true;
                        }}
                        errorMessage={errorMessage}
                        isErrorDisplayed="true"
                        autoFocus = {false}
                        maxLength={250}
                        placeholder = {''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            cb(e.target.value);
                            _.set(stateData, propertyPath, encodeContent(e.target.value));
                            dispatch(
                                Actions.updateCurrentConfig({
                                    emailSettings: stateData
                                })
                            )
                        }}
                    />}
                    <OverflowText text = {mobileButtonLinkDefault}>
                    </OverflowText>
                </div>
            )
        }
        const renderTextareaSection = ( description: string, cb: Function, placeholder: string, propertyPath: string) => {
            return (
                <div className={`${classNamePrefix}-box`}>
                    <span></span>
                    <TextArea
                                className={`${classNamePrefix}-description-name-input`}
                                placeholder={placeholder}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                maxLength={250}
                                value={description}
                                onChange={(e: any) => {
                                    cb(e.target.value);
                                    _.set(stateData, propertyPath, encodeContent(e.target.value));
                                    dispatch(
                                        Actions.updateCurrentConfig({
                                            emailSettings: stateData
                                        })
                                    )
                                }}
                            />
                </div>
    
            )
        }
        return (
            <>
            {/*button 1*/}
            <FormSwitch {...{label: customEmailStringDict.formGroup.actionButton.label1, value: showButton1, cb: setShowButton1, elementId: 'showBrowserButton', stateData: stateData}}/>
            {showButton1 && <FormBtnColor {...{label: customEmailStringDict.formGroup.actionButton.button1, value: button1Text, cb: setButton1Text, elementId: 'browserButtonStyle', placeholder: customEmailStringDict.formGroup.actionButton.button1_default, fontColor: button1FontColor, fontColorCb: setButton1FontColor, bgColor: button1BgColor, bgColorCb: setButton1BgColor, validate: validate, stateData: stateData}}></FormBtnColor>}
            {showButton1 && <FormInput {...{'label': customEmailStringDict.formGroup.actionButton.label2, 'value': hostWebPortal, 'cb': setHostWebPortal, 'elementId': 'hostPortal','placeholder': customEmailStringDict.formGroup.actionButton.placeholder, 'propertyPath': 'hostPortal', 'tooltip': true, 'enableValidate': isWhiteListRequestLoaded, 'errorMessage': customEmailStringDict.formGroup.actionButton.hostInvalidTip, 'validateCb': validatePortalUrl.bind(null, whiteListUrls, allowAllOrigins, env?.url, showAclForbidden? customEmailStringDict.formGroup.actionButton.portalLinkAclForbiddenMsg : hostWhiteListTip),disabled: isWhiteListRequestFailed, 'isNotEncode': false, tooltipStr: hostTooltip, 'validate': validate, 'stateData': stateData}}></FormInput>}
            {/*button 2*/}
            <FormSwitch {...{label: customEmailStringDict.formGroup.actionButton.label3, value: showButton2, cb: setShowButton2, elementId: 'showMobileButton', stateData: stateData}}/>
            {showButton2 && <FormBtnColor {...{label: customEmailStringDict.formGroup.actionButton.button2, value: button2Text, cb: setButton2Text, elementId: 'mobileButtonStyle', placeholder: customEmailStringDict.formGroup.actionButton.button2_default, fontColor: button2FontColor, fontColorCb: setButton2FontColor, bgColor: button2BgColor, bgColorCb: setButton2BgColor, validate: validate, stateData: stateData}}></FormBtnColor>}
            {showButton2 && renderMobileButtonLink({label: customEmailStringDict.formGroup.actionButton.button2Link, value: mobileButtonScheme, linkType: mobileBtnLinkType, cb: setMobileButtonScheme, elementId: 'mobileButtonScheme', placeholder: customEmailStringDict.formGroup.actionButton.placeholder, propertyPath: 'button.mobileButtonScheme', enableValidate: true, errorMessage: customEmailStringDict.mobileLinkValidTip, validateCb: validateScheme})}
            {/*button desc*/}
            <FormSwitch {...{label: customEmailStringDict.formGroup.actionButton.showDescription, value: showDescription, cb: setShowDescription, elementId: 'showButtonDescription', stateData: stateData}}/>
            {showDescription && renderTextareaSection(actionDescription,setActionDescription, customEmailStringDict.formGroup.actionButton.descriptionDefaultStr, 'button.description')}
            </>
            )
});

  


export default ActionButtonSection;