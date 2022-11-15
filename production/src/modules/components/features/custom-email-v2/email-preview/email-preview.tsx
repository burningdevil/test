import { Divider, Layout, Checkbox } from 'antd';
import * as React from 'react'
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomizeEmailSetting, selectShouldSendPreviewEmail } from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType } from '../../../../../types/data-model/HomeScreenConfigModels';
import { customEmailStringDict } from '../../../HomeScreenConfigConstant';
import './email-preview.scss';
import { DEFAULT_EMAIL_SETTING } from '../../../../../store/reducers/HomeScreenConfigEditorReducer';
import { setShouldSendPreviewEmail } from '../../../../../store/actions/ActionsCreator';
import * as _ from 'lodash';
const classNamePrefix = 'custom-email-preview-v2'
const CustomEmailPreview: React.FC<any> = () => {
    const dispatch = useDispatch();
    const emailSetting: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? DEFAULT_EMAIL_SETTING as CustomEmailSettingType;
    const shouldSendPreviewEmail: boolean = useSelector(selectShouldSendPreviewEmail) ?? false;

    const onPreviewCheckboxChange = useCallback((shouldSend: boolean) => {
        dispatch(setShouldSendPreviewEmail(shouldSend));
    }, []);
    
    const renderCheckbox = () => {
        return  (
            emailSetting.enabled && <div className={`${classNamePrefix}-checkbox`}>
                <Checkbox
                    checked={shouldSendPreviewEmail}
                    onChange={(e: any) => onPreviewCheckboxChange(e.target.checked)}
                >
                <span>{customEmailStringDict.sendPreview}</span>
                </Checkbox>
            </div>
            
            )
    }

    const renderCardContent = () => {
        return (
            <div className = {`${classNamePrefix}-card-content`}>
                <div className = {`${classNamePrefix}-card-content-1 skeleton-item`}></div>
                <div className = {`${classNamePrefix}-card-content-2 skeleton-item`}></div>
                
                {(!emailSetting.enabled || emailSetting.showBrowserButton) && <div style = {{backgroundColor: emailSetting?.button?.browserButtonStyle?.backgroundColor}} className = {getViewButtonClass()}>
                        <div style = {{'color': emailSetting?.button?.browserButtonStyle?.fontColor}}>{emailSetting?.button?.browserButtonStyle?.text ? decodeContent(emailSetting?.button?.browserButtonStyle?.text) : customEmailStringDict.formGroup.actionButton.button1_default}</div>
                </div>}
                {(!emailSetting.enabled || emailSetting.showMobileButton) && <div style = {{backgroundColor: emailSetting?.button?.mobileButtonStyle?.backgroundColor}} className = {getViewButtonClass()}>
                        <div style = {{'color': emailSetting?.button?.mobileButtonStyle?.fontColor}}>{emailSetting?.button?.mobileButtonStyle?.text ? decodeContent(emailSetting?.button?.mobileButtonStyle?.text) : customEmailStringDict.formGroup.actionButton.button2_default}</div>
                </div>}
                {(!emailSetting.enabled || emailSetting.showButtonDescription) && <div className = {`${classNamePrefix}-card-content-5 skeleton-item`}></div>}
                {(!emailSetting.enabled || emailSetting.showReminder) && <Divider/>}
                {(!emailSetting.enabled || emailSetting.showReminder) && <div className = {`${classNamePrefix}-card-content-6 skeleton-item`}></div>}
            </div>
        )
    }
    const getViewButtonClass = useCallback(() => {
        if(emailSetting.showBrowserButton && emailSetting.showMobileButton){
            return `${classNamePrefix}-card-content-3`
        }else {
            return `${classNamePrefix}-card-content-3 ${classNamePrefix}-card-content-btn`
        }
    }, [emailSetting.showBrowserButton, emailSetting.showMobileButton])
    return (
        <div
            id="custom-email-preview-v2"
            className={`${classNamePrefix}`}
        >   
                        <div style={{ position: 'relative' }}>
                            <Layout
                                className={`${classNamePrefix}-container`}
                            >
                                <Layout.Content
                                    className={`${classNamePrefix}-email`}
                                >
                                    <div className={`${classNamePrefix}-email-title`}>
                                        <div className={`${classNamePrefix}-subject`}>
                                            <span >{'Subject'}</span>
                                            <div className = {`${classNamePrefix}-subject-item skeleton-item` }></div>
                                        </div>
                                        <div className={`${classNamePrefix}-owner`}>
                                            <div></div>
                                            <span>{emailSetting?.sender?.address ? emailSetting?.sender?.address : customEmailStringDict.formGroup.emailSender.placeholder}</span>
                                        </div>
                                        <div className = {`${classNamePrefix}-card`}>
                                            {(!emailSetting.enabled || emailSetting.showBrandingImage) && <div className = {`${classNamePrefix}-card-logo-container`}>
                                                {!emailSetting?.brandingImage?.url && <div className = {`${classNamePrefix}-card-logo`}/>}
                                                {emailSetting?.brandingImage?.url && <img src={emailSetting?.brandingImage?.url} style={{'height': '100%', maxHeight: '60px', 'width': '100%','objectFit': 'contain'}}/>}    
                                                </div>
                                                
                                            }
                                            {renderCardContent()}
                                            <div className = {`${classNamePrefix}-card-footer`}>
                                            {(!emailSetting.enabled || emailSetting.showSentBy) && <div className = {`${classNamePrefix}-card-sender`}>
                                                {`Sent by ${(!emailSetting.enabled || !emailSetting.sentByText) ?  DEFAULT_EMAIL_SETTING.sentByText : decodeContent(emailSetting.sentByText)}`}
                                            </div>}
                                            {<div className = {`${classNamePrefix}-card-social`}>
                                                {(!emailSetting.enabled || (emailSetting?.showSocialMedia && !_.has(emailSetting,'socialMedia.showFacebook')) || (emailSetting?.socialMedia?.showFacebook)) && <div className={`${classNamePrefix}-card-social-item font-facebook-icon`}/>}
                                                {(!emailSetting.enabled || (emailSetting?.showSocialMedia && !_.has(emailSetting,'socialMedia.showTwitter')) || (emailSetting?.socialMedia?.showTwitter)) && <div className={`${classNamePrefix}-card-social-item font-twitter-icon`}/>}
                                                {(!emailSetting.enabled || (emailSetting?.showSocialMedia && !_.has(emailSetting,'socialMedia.showLinkedIn')) || (emailSetting?.socialMedia?.showLinkedIn)) && <div className={`${classNamePrefix}-card-social-item font-linked-icon`}/>}
                                                {(!emailSetting.enabled || (emailSetting?.showSocialMedia && !_.has(emailSetting,'socialMedia.showYouTube')) || (emailSetting?.socialMedia?.showYouTube)) && <div className={`${classNamePrefix}-card-social-item font-yt-icon`}/>}
                                                </div>}
                                            </div>
                                            
                                        </div>
                                    </div>
                                </Layout.Content>
                            </Layout>
                        </div>
                        {renderCheckbox()}
                    </div>
    );
};

export default CustomEmailPreview;