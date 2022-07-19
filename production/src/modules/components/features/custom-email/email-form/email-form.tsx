import { Input, Tooltip } from '@mstr/rc';
import { Checkbox, Divider, Switch } from 'antd';
import * as React from 'react'
import { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCustomizeEmailSetting } from '../../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType } from '../../../../../../src/types/data-model/HomeScreenConfigModels';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import { default as VC, customEmailStringDict } from '../../../../../../src/modules/components/HomeScreenConfigConstant';
const classNamePrefix = 'custom-email-form'
import './email-form.scss'
import { validateHttpUrl } from '../custom-email.util';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
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
    const [sentByOwner, setSentByOwner]  = useState(stateData.sentByText);
    const inputChange = (key:  keyof CustomEmailSettingType, value: string, cb: React.Dispatch<React.SetStateAction<string>>) =>{
        cb(value);
        // valid data
        if(key === 'hostPortal'){
            const isValid = validateHttpUrl(value);
            if(!isValid) return;
        }
        (stateData as any)[key] = value;
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
                        dispatch(Actions.setCustomEmailError(true))
                    }else {
                        dispatch(Actions.setCustomEmailError(false))
                    }
                    
                    return isValid;
                }else{
                    return true
                }
            }}
            ref={() => {}}
            maxLength={250}
            placeholder = {placeholder}
            errorMessage={customEmailStringDict.subTitle.actionButton.hostInvalidTip}
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
                        if ((evt.keyCode === 13) || (evt.keyCode === 32)) {
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
            {customEmailStringDict.subTitle.actionButton.hostTooltip}
            <a 
            target = "_blank"

            href={'https://www2.microstrategy.com/producthelp/2021/EmbeddingSDK/Content/topics/use_custom_dossier_link.htm'} style = {{'marginLeft': '8px'}}>{customEmailStringDict.subTitle.actionButton.hostTooltipHelp}</a>
        </div>
    )
    const renderForms = () => {
        return (
            enableCustomEmail && <>
                {/* Image section */}
                {sectionTitleRender(customEmailStringDict.subTitle.image.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.image.label}</span>
                    {switchRender(showImage, 'showBrandingImage', setShowImage, customEmailStringDict.subTitle.image.label)}
                </div> 
                <Divider/>
    
                {/* Action button section */}
                {sectionTitleRender(customEmailStringDict.subTitle.actionButton.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.actionButton.label1}</span>
                    {switchRender(showButton1, 'showBrowserButton', setShowButton1, customEmailStringDict.subTitle.actionButton.label1)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>
                        {customEmailStringDict.subTitle.actionButton.label2}
                        <Tooltip
                            title={hostTooltip}
                            placement='rightTop'
                            onVisibleChange={(visible) =>{}}
                        >
                            <span className={VC.FONT_MSG_INFO}> </span>
                        </Tooltip>
                    </span>
                    
                    {inputRender(hostWebPortal, 'hostPortal', setHostWebPortal, customEmailStringDict.subTitle.actionButton.placeholder)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.actionButton.label3}</span>
                    {switchRender(showButton2, 'showMobileButton', setShowButton2, customEmailStringDict.subTitle.actionButton.label3)}
                </div>

                <Divider/>
        
                {/* Notification Reminder section */}
                <div className={`${classNamePrefix}-section-title`} >
                    {customEmailStringDict.subTitle.notificationReminder.title}
                    <Tooltip
                            title={customEmailStringDict.subTitle.notificationReminder.tooltip}
                            placement='rightTop'
                            onVisibleChange={(visible) =>{}}
                        >
                            <span className={VC.FONT_MSG_INFO}> </span>
                        </Tooltip>
                </div>
                
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.notificationReminder.label}</span>
                    {switchRender(showReminder, 'showReminder', setShowReminder, customEmailStringDict.subTitle.notificationReminder.label)}
                </div>

                
                <Divider/>

                {/* Send by section */}
                {sectionTitleRender(customEmailStringDict.subTitle.sentBy.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.sentBy.label1}</span>
                    {switchRender(showSendByInfo, 'showSentBy', setShowSendByInfo, customEmailStringDict.subTitle.sentBy.label1)}
                </div>
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.sentBy.label2}</span>
                    {inputRender(sentByOwner, 'sentByText', setSentByOwner, customEmailStringDict.subTitle.sentBy.defaultSender)}
                </div>
                <Divider/>
                {/* Social media section */}
                {sectionTitleRender(customEmailStringDict.subTitle.socialMedia.title)}
                <div className={`${classNamePrefix}-box`}>
                    <span>{customEmailStringDict.subTitle.socialMedia.label}</span>
                    {switchRender(showSocialMedia, 'showSocialMedia', setShowSocialMedia, customEmailStringDict.subTitle.socialMedia.label)}
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