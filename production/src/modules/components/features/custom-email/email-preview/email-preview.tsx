import { Divider, Layout, Checkbox } from 'antd';
import * as React from 'react'
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomizeEmailSetting, selectShouldSendPreviewEmail } from '../../../../../../src/store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType } from '../../../../../../src/types/data-model/HomeScreenConfigModels';
import { customEmailStringDict, localizedStrings } from '../../../../../../src/modules/components/HomeScreenConfigConstant';
import './email-preview.scss';
import { DEFAULT_EMAIL_SETTING } from '../../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import { setShouldSendPreviewEmail } from '../../../../../store/actions/ActionsCreator';
import * as _ from 'lodash';
const classNamePrefix = 'custom-email-preview'
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
                
                {(!emailSetting.enabled || emailSetting.showBrowserButton) && <div className = {getViewButtonClass()}>
                        <div>{'View in Browser'}</div>
                </div>}
                {(!emailSetting.enabled || emailSetting.showMobileButton) && <div className = {getViewButtonClass()}>
                        <div>{'View in Mobile'}</div>
                </div>}
                {(!emailSetting.enabled || emailSetting.showBrowserButton) && emailSetting.showMobileButton && <div className = {`${classNamePrefix}-card-content-5 skeleton-item`}></div>}
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
            id="custom-email-preview"
            className={`${classNamePrefix}`}
        >
                    <div className={`${classNamePrefix}-title`}>
                            {localizedStrings.PREVIEW}
                        </div>
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
                                            <span>{'environment@xxx.com'}</span>
                                        </div>
                                        <div className = {`${classNamePrefix}-card`}>
                                            {(!emailSetting.enabled || emailSetting.showBrandingImage) && <div className = {`${classNamePrefix}-card-logo-container`}><div className = {`${classNamePrefix}-card-logo`}/></div>}
                                            {renderCardContent()}
                                            <div className = {`${classNamePrefix}-card-footer`}>
                                            {(!emailSetting.enabled || emailSetting.showSentBy) && <div className = {`${classNamePrefix}-card-sender`}>
                                                {`Sent by ${(!emailSetting.enabled || !emailSetting.sentByText) ?  DEFAULT_EMAIL_SETTING.sentByText : _.unescape(emailSetting.sentByText)}`}
                                            </div>}
                                            {(!emailSetting.enabled || emailSetting.showSocialMedia) && <div className = {`${classNamePrefix}-card-social`}></div>}
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