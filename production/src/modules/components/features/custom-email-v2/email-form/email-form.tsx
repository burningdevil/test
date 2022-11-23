import {Tooltip } from '@mstr/rc';
import { Checkbox, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import * as React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCustomizeEmailSetting } from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType } from '../../../../../types/data-model/HomeScreenConfigModels';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import { default as VC, customEmailStringDict, localizedStrings } from '../../../HomeScreenConfigConstant';
const classNamePrefix = 'custom-email-form-v2'
import './email-form.scss'
import { decodeContent, encodeContent, SubjectBodyEnum, validateEmail, validateImageUrl, validEmailName } from '../custom-email.util';
import { DEFAULT_EMAIL_SETTING } from '../../../../../store/reducers/HomeScreenConfigEditorReducer';
import * as _ from 'lodash';
import MacroEditor from '../macro-editor/macro-editor';
import { Macros } from '../macro-editor/macro-types';
import SubSection from './form-components/sub-section/sub-section.component';
import FormInput from './form-components/form-input/form-input.component';
import ActionButtonSection from './form-components/action-button-section/action-button-section.component';
import FormSwitch from './form-components/form-switch/form-switch.component';
import SocialMediaSection from './form-components/social-media-section/social-media-section.component';
const { Panel } = Collapse;
const CustomEmailForm: React.FC<any> = (props: any) => {
    let stateData: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING)) as CustomEmailSettingType;
    // let stateData: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? {} as CustomEmailSettingType;
    const dispatch = useDispatch();
    console.log(stateData);
    const {env, isPreviewOpen} = props;
    const actionButtonRef = React.useRef();
    const [enableCustomEmail, setEnableCustomEmail] = useState(stateData.enabled);
    // logo
    const [showImage, setShowImage] = useState(stateData.showBrandingImage);
    const [imageUrl, setImageUrl] = useState(decodeContent(stateData?.brandingImage?.url)) // default image url
    // action button
    //notification reminder
    const [showReminder, setShowReminder] = useState(stateData.showReminder);
    const [reminderContent, setReminderContent] = useState(stateData.reminder?.text ? decodeContent(stateData.reminder?.text): customEmailStringDict.formGroup.notificationReminder.defaultReminder);
    const [reminderLinkText, setReminderLinkText] =  useState(stateData.reminder?.linkText ? decodeContent(stateData.reminder?.linkText) : customEmailStringDict.formGroup.notificationReminder.defaultReminderLinkText);
    // send by
    const [showSendByInfo, setShowSendByInfo] = useState(stateData.showSentBy);
    const [sentByOwner, setSentByOwner]  = useState(decodeContent(stateData.sentByText));
    // email sender
    const [emailSenderName, setEmailSenderName] = useState(stateData.sender?.displayName ? decodeContent(stateData.sender?.displayName) : customEmailStringDict.formGroup.emailSender.defaultName);
    const [emailSenderAddr, setEmailSenderAddr] = useState(stateData.sender?.address ? decodeContent(stateData.sender?.address) : customEmailStringDict.formGroup.emailSender.placeholder);
    // subject and body
    const [resetSubAndBody, setResetSubAndBody] = useState(false);
    // share dossier
    const [shareDossierSub, setShareDossierSub] = useState(decodeContent(stateData.content?.SHARE_DOSSIER?.subject ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_DOSSIER.subject))));
    const [shareDossierBody, setShareDossierBody] = useState(decodeContent(stateData.content?.SHARE_DOSSIER?.body ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.MEMBER_ADDED.body))));
    // share bookmark
    const [shareBookmarkSub, setShareBookmarkSub] = useState(decodeContent(stateData.content?.SHARE_BOOKMARK?.subject ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_BOOKMARK.subject))));
    const [shareBookmarkBody, setShareBookmarkBody] = useState(decodeContent(stateData.content?.SHARE_BOOKMARK?.body ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_BOOKMARK.body))));
    // member add
    const [memberAddedSub, setMemberAddedSub] = useState(decodeContent(stateData.content?.MEMBER_ADDED?.subject ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.MEMBER_ADDED.subject))));
    const [memberAddedBody, setMemberAddedBody] = useState(decodeContent(stateData.content?.MEMBER_ADDED?.body ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.MEMBER_ADDED.body))));
    // user mention
    const [userMentionSub, setUserMentionSub] = useState(decodeContent(stateData.content?.USER_MENTION?.subject ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.USER_MENTION.subject))));
    const [userMentionBody, setUserMentionBody] = useState(decodeContent(stateData.content?.USER_MENTION?.body ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.USER_MENTION.body))));
    // reset icon related.
    const [resetConfirmKey, setResetConfirmKey] = useState('');
    // manual register the elementId of the validation array. To be optimise.
    const formArray: any[] = [
        {'key': 'brandingImage', 'error': false, 'dependency': stateData?.brandingImage?.url},
        {'key': 'hostPortal', 'error': false, 'dependency': stateData?.hostPortal},
        {'key': 'mobileButtonScheme', 'error': false, 'dependency': stateData?.button?.mobileButtonScheme},
        {'key': 'emailSenderName', 'error': false, 'dependency': stateData?.sender?.displayName},
        {'key': 'emailSenderAddress', 'error': false, 'dependency': stateData?.sender?.address},
        {'key': 'browserButtonStyle', 'error': false, 'dependency': stateData?.button?.browserButtonStyle?.text},
        {'key': 'mobileButtonStyle', 'error': false, 'dependency': stateData?.button?.mobileButtonStyle?.text},
    ];
    React.useEffect(()=> {
        let errorCnt = 0;
        formArray.forEach(form => {
            if(form.error){
                errorCnt += 1;
            }
        });
        dispatch(Actions.setCustomEmailNameError(errorCnt > 0 ? true : false))

    },[formArray.map(v => v.dependency)])
    
    const resetSubject : Function= () => {
        setResetSubAndBody(!resetSubAndBody);

        setShareDossierSub(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_DOSSIER.subject))));
        setShareDossierBody(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_DOSSIER.body))));

        setShareBookmarkSub(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_BOOKMARK.subject))));
        setShareBookmarkBody(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_BOOKMARK.body))));

        setMemberAddedSub(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.MEMBER_ADDED.subject))));
        setMemberAddedBody(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.MEMBER_ADDED.body))));

        setUserMentionSub(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.USER_MENTION.subject))));
        setUserMentionBody(decodeContent(JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.USER_MENTION.body))));
    }
    const resetEmailSender: Function = () => {
        setEmailSenderName(customEmailStringDict.formGroup.emailSender.defaultName);
        setEmailSenderAddr(customEmailStringDict.formGroup.emailSender.placeholder);
    }
    const resetBrandImage: Function = () => {
        setShowImage(true);
        _.set(stateData, 'showBrandingImage', true);
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
        setImageUrl('');
    }
    const resetReminder: Function = () => {
        setResetSubAndBody(!resetSubAndBody);
        setShowReminder(true);
        _.set(stateData, 'showReminder', true);
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
        setReminderContent(customEmailStringDict.formGroup.notificationReminder.defaultReminder);
        setReminderLinkText(customEmailStringDict.formGroup.notificationReminder.defaultReminderLinkText)
    }
    const checkboxChange = (value: boolean) => {
        setEnableCustomEmail(value);
        (stateData as any)['enabled'] = value;
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
    }
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
    const validate = (e: string, key: string, valid: Function) => {
        const isValid = valid(e);
        let item = formArray.find(v => v.key === key);
        if(isValid === true){
            item.error = false;
        }else {
            item.error = true;
        }
        return isValid;
    }  
    const renderSingleMacroSection = (label: string, value: string, cb: Function, placeholder: string, availableMacros?: Macros[]) => {
        return (
            <div className={`${classNamePrefix}-box`}>
                            
                        <span>{label}</span>
                        <div className="message-editor-wrapper">
                                <MacroEditor
                                    defaultValue={value}
                                    isMultiContent={true}
                                    isPreviewOpen = {isPreviewOpen}
                                    reset = {resetSubAndBody}
                                    availableMacros = {availableMacros}
                                    placeholder={placeholder}
                                    onChangeHandler={(v: any) => {
                                        cb(v.text);
                                        if(!stateData.reminder){
                                            stateData.reminder = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.reminder));
                                        }
                                        if(!stateData.reminder?.text){
                                            stateData.reminder.text = DEFAULT_EMAIL_SETTING.reminder.text;
                                        }
                                        stateData.reminder.text = encodeContent(v.text);
                                        dispatch(
                                            Actions.updateCurrentConfig({
                                                emailSettings: stateData
                                            })
                                        )
                                }}
                                />
                        </div >   
                            
                        </div> 
        )
    }
    const subjectTooltip = (
        <div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.subjectAndBody.dossierTip}
                </span>
                {`{&` + Macros.DOSSIER_NAME + `}`}
            </div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.subjectAndBody.recipientNameTip}
                </span>
                {`{&` + Macros.RECIPIENT_NAME + `}`}
            </div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.subjectAndBody.senderNameTip}
                </span>
                {`{&` + Macros.SENDER_NAME + `}`}
            </div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.subjectAndBody.bookmarkCountTip}
                </span>
                {`{&` + Macros.BOOKMARK_COUNT + `}`}
            </div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.subjectAndBody.commentDiscussionTip}
                </span>
                {`{&` + Macros.MENTION_TARGET + `}`}
            </div>
            </div>
    )
    const notificationTooltip = (
        <div>
            <div>
                <span>
                    {customEmailStringDict.formGroup.notificationReminder.notificationMsgTip}
                </span>
            </div>
            <div>
                <span className = 'tip-label'>
                    {customEmailStringDict.formGroup.notificationReminder.reminderMacroTip}
                </span>
                {`{&` + Macros.NOTIFICATION_COUNT + `}`}
            </div>
        </div>
    )
    const renderExtraHeader = (showInfo: boolean, showReset: boolean, resetKey?: keyof CustomEmailSettingType, resetCb?: Function, tooltip?: any) => {
        
        return (
            <div >
                {
                    showInfo && <Tooltip
                    title={tooltip}
                    placement='rightTop'
                >
                    <span className={VC.FONT_MSG_INFO}> </span>
                </Tooltip>
                }
                {
                    showReset && <span className = {'font-reset-icon'} onClick= {(e: any) => {
                        // prevent the panel from collapsing
                        e.preventDefault();
                        e.stopPropagation();
                        setResetConfirmKey(resetKey);
                        
                    }} />
                }
                {
                    showReset && resetConfirmKey === resetKey && <div className = {'confirm-container'}>
                        <span className = {'confirm-tip'}>
                            {customEmailStringDict.resetHeaderTip} 
                        </span>
                        <span className = {'confirm-yes'} onClick = {
                            (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                (stateData[resetKey] as any) = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING[resetKey]));
                                resetCb();
                                dispatch(
                                    Actions.updateCurrentConfig({
                                        emailSettings: JSON.parse(JSON.stringify(stateData))
                                    })
                                )
                                setResetConfirmKey('');
                            }
                        }>{localizedStrings.YES}</span>
                        <span className = {'confirm-no'} onClick = {(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResetConfirmKey('');
                        }}>{localizedStrings.NO}</span>
                    </div>
                }
            </div>
            
        )
    }
    const renderForms = () => {
        return (
            enableCustomEmail && <div className={`${classNamePrefix}-form-container`}>
                <Collapse
                    bordered={false}
                    defaultActiveKey={[]}
                    collapsible = 'header'
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse"
                >
                    {/* Subject and body section */}
                    <Panel extra = {renderExtraHeader(true, true, 'content', resetSubject, subjectTooltip)} header={customEmailStringDict.formGroup.subjectAndBody.title} key="1" className="site-collapse-custom-panel">
                        <SubSection {...{sectionObj: customEmailStringDict.formGroup.subjectAndBody.subsection1, stateKey: SubjectBodyEnum.SHARE_DOSSIER, value1: shareDossierSub, cb1: setShareDossierSub, value2: shareDossierBody, cb2: setShareDossierBody, stateData: stateData, resetSubAndBody: resetSubAndBody, availableMacros: [Macros.DOSSIER_NAME, Macros.RECIPIENT_NAME, Macros.SENDER_NAME], isPreviewOpen: isPreviewOpen}}
                        ></SubSection>
                        <SubSection {...{
                            sectionObj: customEmailStringDict.formGroup.subjectAndBody.subsection2, stateKey: SubjectBodyEnum.SHARE_BOOKMARK, value1: shareBookmarkSub, cb1: setShareBookmarkSub, value2: shareBookmarkBody, cb2: setShareBookmarkBody, stateData: stateData, resetSubAndBody: resetSubAndBody, availableMacros: [Macros.DOSSIER_NAME, Macros.RECIPIENT_NAME, Macros.SENDER_NAME, Macros.BOOKMARK_COUNT], isPreviewOpen: isPreviewOpen}}
                        ></SubSection>
                        <SubSection 
                            {...{sectionObj: customEmailStringDict.formGroup.subjectAndBody.subsection3, stateKey: SubjectBodyEnum.MEMBER_ADDED, value1: memberAddedSub, cb1: setMemberAddedSub, value2: memberAddedBody, cb2: setMemberAddedBody, stateData: stateData, resetSubAndBody: resetSubAndBody, availableMacros: [Macros.SENDER_NAME, Macros.RECIPIENT_NAME], isPreviewOpen: isPreviewOpen}}
                        ></SubSection>
                        <SubSection 
                            {...{sectionObj: customEmailStringDict.formGroup.subjectAndBody.subsection4, stateKey: SubjectBodyEnum.USER_MENTION, value1: userMentionSub, cb1: setUserMentionSub, value2: userMentionBody, cb2: setUserMentionBody, stateData: stateData, resetSubAndBody: resetSubAndBody,
                            availableMacros: [Macros.MENTION_TARGET, Macros.RECIPIENT_NAME, Macros.SENDER_NAME, Macros.DOSSIER_NAME], isPreviewOpen: isPreviewOpen}}
                        ></SubSection>
                    </Panel>
                    {/* Sender section */}
                    <Panel extra = {renderExtraHeader(false, true, 'sender',resetEmailSender)} header={customEmailStringDict.formGroup.emailSender.title} key="2" className="site-collapse-custom-panel">
                        <FormInput {...{'label': customEmailStringDict.formGroup.emailSender.labelName, 'value': emailSenderName, 'cb': setEmailSenderName,'elementId': 'emailSenderName','placeholder': '', 'propertyPath': 'sender.displayName', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.emailNameInvalidTip, 'validateCb': validEmailName, 'isNotEncode': true, 'validate': validate, 'stateData': stateData}}></FormInput>
                        <FormInput {...{'label': customEmailStringDict.formGroup.emailSender.labelAddress, 'value': emailSenderAddr, 'cb': setEmailSenderAddr,'elementId': 'emailSenderAddress','placeholder': customEmailStringDict.formGroup.emailSender.placeholder, 'propertyPath': 'sender.address', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.emailAddressInvalidTip, 'validateCb': validateEmail, 'isNotEncode': false, 'validate': validate, 'stateData': stateData}}></FormInput>
                    </Panel>
                    {/* Image section */}
                    <Panel extra = {renderExtraHeader(false, true, 'brandingImage', resetBrandImage)} header={customEmailStringDict.formGroup.image.brandImageTitle} key="3" className="site-collapse-custom-panel">
                        <FormSwitch {...{label: customEmailStringDict.formGroup.image.brandImageLabel, value: showImage, cb: setShowImage, elementId: 'showBrandingImage', stateData: stateData}}/>
                        {showImage && <FormInput {...{'label': customEmailStringDict.formGroup.image.brandImageUrl, 'value': imageUrl, 'cb': setImageUrl,'elementId': 'brandingImage','placeholder': '', 'propertyPath': 'brandingImage.url', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.formGroup.actionButton.hostInvalidTip, 'validateCb': validateImageUrl, 'isNotEncode': false, 'validate': validate, 'stateData': stateData}}></FormInput>}
                    </Panel>
                    {/* Action button section */}
                    <Panel extra = {renderExtraHeader(false, true, 'button', () => { actionButtonRef?.current?.reset()})} header={customEmailStringDict.formGroup.actionButton.title} key="4" className="site-collapse-custom-panel">
                        <ActionButtonSection ref ={actionButtonRef} {...{env: env, stateData: stateData, validate: validate}}/>
                    </Panel>
                    <Panel extra = {renderExtraHeader(true, true, 'reminder', resetReminder, notificationTooltip)} header={customEmailStringDict.formGroup.notificationReminder.title} key="5" className="site-collapse-custom-panel">
                        <FormSwitch {...{label: customEmailStringDict.formGroup.notificationReminder.label, value: showReminder, cb: setShowReminder, elementId: 'showReminder', stateData: stateData}}/>
                        {showReminder && renderSingleMacroSection(customEmailStringDict.formGroup.notificationReminder.labelReminder, reminderContent, setReminderContent, customEmailStringDict.formGroup.notificationReminder.defaultReminder, [Macros.NOTIFICATION_COUNT])}
                        {showReminder && <FormInput {...{'label': customEmailStringDict.formGroup.notificationReminder.reminderLinkText, 'value': reminderLinkText, 'cb': setReminderLinkText, 'elementId': 'reminderLinkText','placeholder': customEmailStringDict.formGroup.notificationReminder.reminderLinkText, 'propertyPath': 'reminder.linkText', 'tooltip': true, 'enableValidate': false, 'errorMessage': '', 'validateCb': null, 'isNotEncode': false, tooltipStr: customEmailStringDict.formGroup.notificationReminder.notificationLinkTip, 'validate': validate, 'stateData': stateData}}></FormInput>}
                    </Panel>
                    <Panel header={customEmailStringDict.formGroup.sentBy.title} key="6" className="site-collapse-custom-panel">
                         <FormSwitch {...{label: customEmailStringDict.formGroup.sentBy.label1, value: showSendByInfo, cb: setShowSendByInfo, elementId: 'showSentBy', stateData: stateData}}/>
                         {showSendByInfo && <FormInput {...{'label': customEmailStringDict.formGroup.sentBy.label2, 'value': sentByOwner, 'cb': setSentByOwner,'elementId': 'sendByOwner','placeholder': customEmailStringDict.formGroup.sentBy.defaultSender, 'propertyPath': 'sentByText', 'tooltip': false, 'enableValidate': false, 'errorMessage': '', 'validateCb': null, 'isNotEncode': false, 'validate': validate, 'stateData': stateData}}></FormInput>}
                    </Panel>
                    <Panel header={customEmailStringDict.formGroup.socialMedia.title} key="7" className="site-collapse-custom-panel">
                         <SocialMediaSection stateData = {stateData}/>
                    </Panel> 
                </Collapse>
            </div>
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
                    { renderForms()}
                    
        </div>
    );
};

export default CustomEmailForm;