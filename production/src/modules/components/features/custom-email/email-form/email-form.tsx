import { Input, Tooltip } from '@mstr/rc';
import { Checkbox, Divider, Switch } from 'antd';
import * as React from 'react'
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCustomizeEmailSetting } from '../../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType } from '../../../../../../src/types/data-model/HomeScreenConfigModels';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import { default as VC, customEmailStringDict, CUSTOM_EMAIL_HOST_PORTAL_HELP_LINK } from '../../../../../../src/modules/components/HomeScreenConfigConstant';
const classNamePrefix = 'custom-email-form'
import './email-form.scss'
import { validateHttpUrl } from '../custom-email.util';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import * as _ from 'lodash';
const CustomEmailForm: React.FC<any> = () => {
    let stateData: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? DEFAULT_EMAIL_SETTING as CustomEmailSettingType;
    const dispatch = useDispatch();

    const [enableCustomEmail, setEnableCustomEmail] = useState(stateData.enabled);

    const [showImage, setShowImage] = useState(stateData.showBrandingImage);
    const [showButton1, setShowButton1] = useState(stateData.showBrowserButton);
    const [showButton2, setShowButton2] = useState(stateData.showMobileButton);
    const [showReminder, setShowReminder] = useState(stateData.showReminder);
    const [showSendByInfo, setShowSendByInfo] = useState(stateData.showSentBy);
    const [showSocialMedia, setShowSocialMedia] = useState(stateData.showSocialMedia);
    const [hostWebPortal, setHostWebPortal] = useState(stateData.hostPortal);
    const [sentByOwner, setSentByOwner]  = useState(_.unescape(stateData.sentByText));
    const inputChange = (key:  keyof CustomEmailSettingType, value: string, cb: React.Dispatch<React.SetStateAction<string>>) =>{
        cb(value);
        // valid data
        if(key === 'hostPortal'){
            const isValid = validateHttpUrl(value);
            if(!isValid) return;
        }
        (stateData as any)[key] = value;
        if(key === 'sentByText'){
            (stateData as any)[key] = _.escape(value);
        }
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
    }
    const inputRender = (value: string, key: keyof CustomEmailSettingType, cb: React.Dispatch<React.SetStateAction<string>>, placeholder: string) => {
        return <Input
            value={value}
            onValidate={(e: string) => {
                if(key === 'hostPortal'){
                    const isValid = validateHttpUrl(e);
                    if(!isValid){
                        dispatch(Actions.setCustomEmailNameError(true))
                    }else {
                        dispatch(Actions.setCustomEmailNameError(false))
                    }
                    return isValid;
                }else{
                    return true
                }
            }}
            autoFocus = {false}
            maxLength={250}
            placeholder = {placeholder}
            errorMessage={customEmailStringDict.formGroup.actionButton.hostInvalidTip}
            isErrorDisplayed="true"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {inputChange(key, e.target.value, cb)}}
    />
    }
    const switchChange = (key:  keyof CustomEmailSettingType, value: boolean, cb: React.Dispatch<React.SetStateAction<boolean>>) =>{
        cb(value);
        (stateData as any)[key] = value;
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
    }
    const switchRender = (checked: any, value: keyof CustomEmailSettingType,cb: React.Dispatch<React.SetStateAction<boolean>>, ariaLabel: string) => {
        return <Switch
                    element-id = {value}
                    aria-label = {ariaLabel}
                    checked={checked}
                    onChange={(e: any) => switchChange(value,e, cb)}
                    size = 'small'
                />
    }
    const checkboxChange = useCallback((value: boolean) => {
        setEnableCustomEmail(value);
        (stateData as any)['enabled'] = value;
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
    }, [stateData])
    const renderCheckbox = () => {
        return  (
            <div className={`${classNamePrefix}-checkbox`}>
                <Checkbox
                    checked={enableCustomEmail}
                    tabIndex = {0}
                    onKeyDown = {evt => {
                        if ((evt.key === 'Enter') || (evt.key === 'Space')) {
                            checkboxChange(!enableCustomEmail);
                        }
                    }}
                    onChange={(e: any) => checkboxChange(e.target.checked)}
                >
                <span>{customEmailStringDict.featureFlag}</span>
                </Checkbox>
            </div>
            
            )
    }

    const sectionTitleRender = (title: string) => {
        return <div className={`${classNamePrefix}-section-title`} >{title}</div>
    }
    const hostTooltip = (
        <div>
            {customEmailStringDict.formGroup.actionButton.hostTooltip}
            <a 
            target = "_blank"

            href={CUSTOM_EMAIL_HOST_PORTAL_HELP_LINK} style = {{'marginLeft': '8px'}}>{customEmailStringDict.formGroup.actionButton.hostTooltipHelp}</a>
        </div>
    )
    const renderForms = () => {
        return (
            enableCustomEmail && <>
                {/* Image section */}
                {sectionTitleRender(customEmailStringDict.formGroup.image.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.image.label}</span>
                    {switchRender(showImage, 'showBrandingImage', setShowImage, customEmailStringDict.formGroup.image.label)}
                </div> 
                <Divider/>
    
                {/* Action button section */}
                {sectionTitleRender(customEmailStringDict.formGroup.actionButton.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.actionButton.label1}</span>
                    {switchRender(showButton1, 'showBrowserButton', setShowButton1, customEmailStringDict.formGroup.actionButton.label1)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>
                        {customEmailStringDict.formGroup.actionButton.label2}
                        <Tooltip
                            title={hostTooltip}
                            placement='rightTop'
                        >
                            <span className={VC.FONT_MSG_INFO}> </span>
                        </Tooltip>
                    </span>
                    
                    {inputRender(hostWebPortal, 'hostPortal', setHostWebPortal, customEmailStringDict.formGroup.actionButton.placeholder)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.actionButton.label3}</span>
                    {switchRender(showButton2, 'showMobileButton', setShowButton2, customEmailStringDict.formGroup.actionButton.label3)}
                </div>

                <Divider/>
        
                {/* Notification Reminder section */}
                <div className={`${classNamePrefix}-section-title`} >
                    {customEmailStringDict.formGroup.notificationReminder.title}
                    <Tooltip
                            title={customEmailStringDict.formGroup.notificationReminder.tooltip}
                            placement='rightTop'
                        >
                            <span className={VC.FONT_MSG_INFO}> </span>
                        </Tooltip>
                </div>
                
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.notificationReminder.label}</span>
                    {switchRender(showReminder, 'showReminder', setShowReminder, customEmailStringDict.formGroup.notificationReminder.label)}
                </div>

                
                <Divider/>

                {/* Send by section */}
                {sectionTitleRender(customEmailStringDict.formGroup.sentBy.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.sentBy.label1}</span>
                    {switchRender(showSendByInfo, 'showSentBy', setShowSendByInfo, customEmailStringDict.formGroup.sentBy.label1)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.sentBy.label2}</span>
                    {inputRender(sentByOwner, 'sentByText', setSentByOwner, customEmailStringDict.formGroup.sentBy.defaultSender)}
                </div>
                <Divider/>
                {/* Social media section */}
                {sectionTitleRender(customEmailStringDict.formGroup.socialMedia.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.formGroup.socialMedia.label}</span>
                    {switchRender(showSocialMedia, 'showSocialMedia', setShowSocialMedia, customEmailStringDict.formGroup.socialMedia.label)}
                </div>
            </>
        )
    }
    return (
        <div
            id="custom-email-form"
            className={`${classNamePrefix}`}
        >
                    <div className={`${classNamePrefix}-title`}>
                        {customEmailStringDict.title}
                    </div>
                    <div className={`${classNamePrefix}-desc`}>
                        {customEmailStringDict.desc}
                    </div>
                    { renderCheckbox()}

                    {renderForms()}
                    
        </div>
    );
};

export default CustomEmailForm;