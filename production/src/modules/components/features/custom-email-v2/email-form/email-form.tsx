import { ColorPickerDropdown, Input, Tooltip } from '@mstr/rc';
import { Checkbox, Collapse, Switch, Select, Input as AntdInput } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import * as React from 'react'
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCustomizeEmailSetting } from '../../../../../store/selectors/HomeScreenConfigEditorSelector';
import { CustomEmailSettingType, MobileButtonLinkEnum } from '../../../../../types/data-model/HomeScreenConfigModels';
import * as Actions from '../../../../../store/actions/ActionsCreator';
import { default as VC, customEmailStringDict, localizedStrings } from '../../../HomeScreenConfigConstant';
const classNamePrefix = 'custom-email-form-v2'
import './email-form.scss'
import { colorGuideHexVals, decodeContent, SubjectBodyEnum, validateEmail, validateEmpty, validateHttpUrl, validateScheme, validEmailName } from '../custom-email.util';
import { DEFAULT_EMAIL_SETTING } from '../../../../../store/reducers/HomeScreenConfigEditorReducer';
import * as _ from 'lodash';
import MacroEditor from '../macro-editor/macro-editor';
import { Macros } from '../macro-editor/macro-types';
import SubSection from './form-components/sub-section/sub-section.component';
import MacroQuillBlot from '../macro-editor/macro-quill-blot';
import { FormBtnColorInputModel, FormInputModel, FormMobileButtonLinkInputModel, FormSocialItemInputModel } from './form-components/form-input.model';
import OverflowText from '../../../../../../src/modules/components/common-components/overflow-text/overflow-text';
const { Panel } = Collapse;
const { TextArea} = Input;
const { Option } = Select;
const CustomEmailForm: React.FC<any> = (props: any) => {
    // let stateData: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING)) as CustomEmailSettingType;
    let stateData: CustomEmailSettingType = useSelector(selectCustomizeEmailSetting) ?? {} as CustomEmailSettingType;
    const dispatch = useDispatch();
    const {env} = props;
    console.log(stateData);
    const [enableCustomEmail, setEnableCustomEmail] = useState(stateData.enabled);
    // logo
    const [showImage, setShowImage] = useState(stateData.showBrandingImage);
    const [imageUrl, setImageUrl] = useState(_.unescape(stateData?.brandingImage?.url)) // default image url
    // action button
    const [showButton1, setShowButton1] = useState(stateData.showBrowserButton);
    const [button1Text, setButton1Text] = useState(stateData?.button?.browserButtonStyle?.text ? _.unescape(stateData?.button?.browserButtonStyle?.text): customEmailStringDict.formGroup.actionButton.button1_default)
    const [button1FontColor, setButton1FontColor] = useState( stateData?.button?.browserButtonStyle?.fontColor?? customEmailStringDict.formGroup.actionButton.button1_fontColor);
    const [button1BgColor, setButton1BgColor] =  useState(stateData?.button?.browserButtonStyle?.backgroundColor ?? customEmailStringDict.formGroup.actionButton.button1_bg_color);
    const [hostWebPortal, setHostWebPortal] = useState(_.unescape(stateData.hostPortal));
    const [showButton2, setShowButton2] = useState(stateData.showMobileButton);
    const [mobileBtnLinkType, setMobileBtnLinkType] = useState(stateData?.button?.mobileButtonLinkType ? stateData?.button?.mobileButtonLinkType : MobileButtonLinkEnum.DEFAULT);
    const [mobileButtonScheme, setMobileButtonScheme] = useState(stateData?.button?.mobileButtonScheme ? stateData?.button?.mobileButtonScheme : 'dossier');
    const [mobileButtonLinkDefault, setMobileButtonLinkDefault] = useState('');
    const [button2Text, setButton2Text] = useState(stateData?.button?.mobileButtonStyle?.text ? _.unescape(stateData?.button?.mobileButtonStyle?.text) : customEmailStringDict.formGroup.actionButton.button2_default);
    const [button2FontColor, setButton2FontColor] = useState(stateData?.button?.mobileButtonStyle?.fontColor ??  customEmailStringDict.formGroup.actionButton.button2_fontColor);
    const [button2BgColor, setButton2BgColor] =  useState(stateData?.button?.mobileButtonStyle?.backgroundColor ?? customEmailStringDict.formGroup.actionButton.button2_bg_color);
    const [showDescription, setShowDescription] = useState(Reflect.has(stateData, 'showButtonDescription') ? stateData.showButtonDescription : stateData.showBrowserButton && stateData.showMobileButton);
    const [actionDescription, setActionDescription]= useState(stateData?.button?.description ?  _.unescape(stateData?.button?.description) : customEmailStringDict.formGroup.actionButton.descriptionDefaultStr);
    //notification reminder
    const [showReminder, setShowReminder] = useState(stateData.showReminder);
    const [reminderContent, setReminderContent] = useState(stateData.reminder?.text ? decodeContent(stateData.reminder?.text): customEmailStringDict.formGroup.notificationReminder.defaultReminder);
    const [reminderLinkText, setReminderLinkText] =  useState(stateData.reminder?.linkText ? _.unescape(stateData.reminder?.linkText) : customEmailStringDict.formGroup.notificationReminder.defaultReminderLinkText);
    // send by
    const [showSendByInfo, setShowSendByInfo] = useState(stateData.showSentBy);
    const [sentByOwner, setSentByOwner]  = useState(_.unescape(stateData.sentByText));
    // email sender
    const [emailSenderName, setEmailSenderName] = useState(stateData.sender?.displayName ? _.unescape(stateData.sender?.displayName) : customEmailStringDict.formGroup.emailSender.defaultName);
    const [emailSenderAddr, setEmailSenderAddr] = useState(stateData.sender?.address ? _.unescape(stateData.sender?.address) : customEmailStringDict.formGroup.emailSender.placeholder);
    // social media
    /*
    * if the Q3 scope enable the customize email and disable the show social media button. There should be handled in special.
    */
    const [showSocialMedia, ] = useState( Reflect.has(stateData, 'showSocialMedia') ? stateData.showSocialMedia : true);
    const [showFb, setShowFb] = useState(_.has(stateData, 'socialMedia.showFacebook') ? stateData?.socialMedia?.showFacebook : showSocialMedia);
    const [fbLink, setFbLink] = useState(_.unescape(stateData?.socialMedia?.facebookLink?.replace(customEmailStringDict.formGroup.socialMedia.fb_prefix, '')));
    const [showTwitter, setShowTwitter] = useState(_.has(stateData, 'socialMedia.showTwitter') ? stateData?.socialMedia?.showTwitter : showSocialMedia);
    const [twitterLink, setTwitterLink] = useState(_.unescape(stateData?.socialMedia?.twitterLink?.replace(customEmailStringDict.formGroup.socialMedia.twitter_prefix, '')));
    const [showLinked, setShowLinked] = useState(_.has(stateData, 'socialMedia.showLinkedIn') ? stateData?.socialMedia?.showLinkedIn : showSocialMedia);
    const [linkedLink, setLinkedLink] = useState(_.unescape(stateData?.socialMedia?.linkedInLink?.replace(customEmailStringDict.formGroup.socialMedia.linked_prefix, '')));
    const [showYt, setShowYt] = useState(_.has(stateData, 'socialMedia.showYouTube') ? stateData?.socialMedia?.showYouTube : showSocialMedia); // yt is short for the youTube
    const [ytLink, setYtLink] = useState(_.unescape(stateData?.socialMedia?.youTubeLink?.replace(customEmailStringDict.formGroup.socialMedia.yt_prefix, '')));
    // subject and body
    const [resetSubAndBody, setResetSubAndBody] = useState(false);
    // share dossier
    const [shareDossierSub, setShareDossierSub] = useState(decodeContent(stateData.content?.SHARE_DOSSIER?.subject ?? JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.content.SHARE_DOSSIER.subject))));
    const [shareDossierBody, setShareDossierBody] = useState(decodeContent(stateData.content?.SHARE_DOSSIER?.body ?? customEmailStringDict.formGroup.subjectAndBody.subsection1.placeholder2));
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
        {'key': 'brandingImage', 'error': false},
        {'key': 'hostPortal', 'error': false},
        {'key': 'mobileButtonScheme', 'error': false},
        {'key': 'emailSenderName', 'error': false},
        {'key': 'emailSenderAddress', 'error': false},
        {'key': 'browserButtonStyle', 'error': false},
        {'key': 'mobileButtonStyle', 'error': false},
    ];

    React.useEffect(()=> {
        let errorCnt = 0;
        formArray.forEach(form => {
            if(form.error){
                errorCnt += 1;
            }
        })
        dispatch(Actions.setCustomEmailNameError(errorCnt > 0 ? true : false))

    })
    // action button related side effect.
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
    }, [env, mobileBtnLinkType, mobileButtonScheme])
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
    }, [showButton1, showButton2])


    const resetSubject : Function= () => {
        setResetSubAndBody(!resetSubAndBody);
        setShareDossierSub(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection1.placeholder1));
        setShareDossierBody(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection1.placeholder2));

        setShareBookmarkSub(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection2.placeholder1));
        setShareBookmarkBody(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection2.placeholder2));

        setMemberAddedSub(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection3.placeholder1));
        setMemberAddedBody(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection3.placeholder2));

        setUserMentionSub(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection4.placeholder1));
        setUserMentionBody(decodeContent(customEmailStringDict.formGroup.subjectAndBody.subsection4.placeholder2));
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
    const switchChange = (key:  string, value: boolean, cb: React.Dispatch<React.SetStateAction<boolean>>) =>{
        cb(value);
        _.set(stateData, key, value);
        dispatch(
            Actions.updateCurrentConfig({
                emailSettings: stateData
            })
        )
    }
    const switchRender = (checked: any, value: string,cb: React.Dispatch<React.SetStateAction<boolean>>, ariaLabel: string) => {
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

    const hostTooltip = (
        <div>
            {customEmailStringDict.formGroup.actionButton.hostTooltip}
            <a 
            target = "_blank"

            href={'https://www2.microstrategy.com/producthelp/2021/EmbeddingSDK/Content/topics/use_custom_dossier_link.htm'} style = {{'marginLeft': '8px'}}>{customEmailStringDict.formGroup.actionButton.hostTooltipHelp}</a>
        </div>
    )
    
    const validate = (e: string, key: string, valid: Function) => {
        const isValid = valid(e);
        let item = formArray.find(v => v.key === key);
        if(!isValid){
            item.error = true;
        }else {
            item.error = false;
        }
        return isValid;
    }
    const renderInputSection = (formInput: FormInputModel) => {
        const {label, value, cb, elementId, placeholder, propertyPath, tooltip, enableValidate, errorMessage, validateCb, isNotEncode, tooltipStr} = formInput;
        return (
            <div className={`${classNamePrefix}-box`}>
                <span>{label}
                    {tooltip && <Tooltip
                                    title={tooltipStr}
                                    placement='rightTop'
                                >
                                    <span className={VC.FONT_MSG_INFO}> </span>
                                </Tooltip>}
                </span>
                
                <Input
                    value={value}
                    onValidate={(e: string) => {
                        if(enableValidate){
                            return validate(e, elementId, validateCb)
                        }else {
                            return true;
                        }
                    }}
                    errorMessage={errorMessage ?? customEmailStringDict.formGroup.actionButton.hostInvalidTip}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onBlur = {(e: React.ChangeEvent<HTMLInputElement>) => {
                        // considering the performance, change the state in the blur event.
                        // if invalid, not update the value
                        if(enableValidate && !validate(e.target.value, elementId, validateCb)){
                            return;
                        }
                        _.set(stateData, propertyPath, isNotEncode ? e.target.value : _.escape(e.target.value));
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        
                    }}
                />
            </div>
        )
        
    }
    const renderSwitchSection = (label: string, value: boolean, cb: Function | any, elementId: keyof CustomEmailSettingType | any) => {
        return (
            <div className={`${classNamePrefix}-box`}>
                <span>{label}</span>
                {switchRender(value, elementId, cb, label)}
            </div> 
        )
    }

    const renderBtnColorSection  = (formBtnColorInput: FormBtnColorInputModel) => {
        const {label, value, cb, elementId, placeholder, fontColor, fontColorCb, bgColor, bgColorCb} = formBtnColorInput;
        return (
            <div className={`${classNamePrefix}-box btn-color-box`}>
                <span>{label}</span>
                <Input
                    className = {'custom-input'}
                    value={value}
                    onValidate={(e: string) => {
                        return validate(e, elementId, validateEmpty)
                    }}
                    errorMessage={customEmailStringDict.emptyValidTip}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        if(!stateData?.button){
                            stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                        }
                        if(!stateData?.button?.[elementId]){
                            stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                        }
                        (stateData['button'][elementId] as any)['text'] = _.escape(e.target.value);
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                />
                <ColorPickerDropdown
                    value = {bgColor}
                    ariaLabel="Color Picker Dropdown"
                    className="ml8"
                    colorGuideHexVals = {colorGuideHexVals}
                    useGradient = {false}
                    useOpacity = {false}
                    onChange={
                        (v: any) => {
                            bgColorCb(v);
                            if(!stateData?.button){
                                stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                            }
                            if(!stateData?.button?.[elementId]){
                                stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                            }
                            (stateData['button'][elementId] as any)['backgroundColor'] = v;
                            dispatch(
                                Actions.updateCurrentConfig({
                                    emailSettings: stateData
                                })
                            )
                            }
                    }
                    onChangeFavorite={_.noop}
                    onChangeGradient={_.noop}
                    onChangeOpacity={_.noop}
                    onPopoverVisibleChange={_.noop}
                    />
                <ColorPickerDropdown
                    value = {fontColor}
                    ariaLabel="Color Picker Dropdown"
                    className="font-color-picker"
                    useGradient = {false}
                    useOpacity = {false}
                    colorGuideHexVals = {colorGuideHexVals}
                    onChange={(v: any) => {
                            fontColorCb(v);
                            if(!stateData?.button){
                                stateData['button'] = JSON.parse(JSON.stringify(DEFAULT_EMAIL_SETTING.button));
                            }
                            if(!stateData?.button?.[elementId]){
                                stateData['button'][elementId] = JSON.parse(JSON.stringify((DEFAULT_EMAIL_SETTING.button as any)[elementId]))
                            }
                            (stateData['button'][elementId] as any)['fontColor'] = v;
                            dispatch(
                                Actions.updateCurrentConfig({
                                    emailSettings: stateData
                                })
                            )
                            }
                    }
                    onChangeFavorite={_.noop}
                    onChangeGradient={_.noop}
                    onChangeOpacity={_.noop}
                    onPopoverVisibleChange={_.noop}
                    />
                    <div className = {'font-color-icon-container'}>
                        <p className = {'font-color-icon'}></p>
                    </div>
                

            </div> 
        )
        
    }

    const renderMobileButtonLink = (mobileButtonLinkInput: FormMobileButtonLinkInputModel) => {
        const {label, value, cb, elementId, placeholder, propertyPath, enableValidate, errorMessage, validateCb} = mobileButtonLinkInput;
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
                <Select dropdownMatchSelectWidth={130} size="small" onChange={handleChange} defaultValue= {mobileBtnLinkType} bordered={false}>
                    <Option className = {'selection-option'} value={MobileButtonLinkEnum.DEFAULT}>{customEmailStringDict.formGroup.actionButton.scheme_default}</Option>
                    <Option value={MobileButtonLinkEnum.APP_SCHEME}>{customEmailStringDict.formGroup.actionButton.scheme_app}</Option>
                    <Option value={MobileButtonLinkEnum.UNIVERSAL_LINK}>{customEmailStringDict.formGroup.actionButton.scheme_universal}</Option>
                </Select>
                {(mobileBtnLinkType === MobileButtonLinkEnum.APP_SCHEME) && <Input
                    style={{width: '68px'}}
                    value={value}
                    onValidate={(e: string) => {
                        return enableValidate ? validate(e, elementId, validateCb) : true;
                    }}
                    errorMessage={errorMessage}
                    isErrorDisplayed="true"
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onBlur = {(e: React.ChangeEvent<HTMLInputElement>) => {
                        _.set(stateData, propertyPath, _.escape(e.target.value));
                        dispatch(
                            Actions.updateCurrentConfig({
                                emailSettings: stateData
                            })
                        )
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb(e.target.value);
                        
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
                                _.set(stateData, propertyPath, _.escape(e.target.value));
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
    const renderSingleMacroSection = (label: string, value: string, cb: Function, placeholder: string, isNotificationReminder?: boolean, availableMacros?: Macros[]) => {
        return (
            <div className={`${classNamePrefix}-box`}>
                            
                        <span>{label}</span>
                        <div className="message-editor-wrapper">
                                <MacroEditor
                                    defaultValue={value}
                                    isMultiContent={true}
                                    isNotificationReminder = {isNotificationReminder}
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
                                        stateData.reminder.text = MacroQuillBlot.escapeHTMLBlot(v.text)?.replace(/(\n)/gm, '<br>').trim();
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

    const renderSocialItemSection = (socialItemInput: FormSocialItemInputModel) => {
        const {label, check, value, cb, cb_link, elementId, placeholder, className, propertyPath, buttonPath, linkPrefix} = socialItemInput;
        return (
            <div className={`${classNamePrefix}-box`}>
                
                <span>
                    <div className = {className}>
                    </div>
                    {label}
                </span>
                <span className='ml8'>
                    {switchRender(check, buttonPath, cb, label)}
                </span>
                
                <span className ={check ? 'social-url-prefix': 'social-url-prefix social-url-gray'}>
                    {linkPrefix}
                </span>
                <AntdInput
                    value={value}
                    style = {{'marginLeft': '5px', 'lineHeight': '18px'}}
                    disabled = {!check}
                    autoFocus = {false}
                    maxLength={250}
                    placeholder = {placeholder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        cb_link(e.target.value);
                        _.set(stateData, propertyPath, linkPrefix + e.target.value);
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
                        <SubSection 
                            sectionObj = {customEmailStringDict.formGroup.subjectAndBody.subsection1}
                            stateKey = {SubjectBodyEnum.SHARE_DOSSIER}
                            value1 = {shareDossierSub}
                            cb1 = {setShareDossierSub}
                            value2 = {shareDossierBody}
                            cb2 = {setShareDossierBody}
                            stateData = {stateData}
                            resetSubAndBody = {resetSubAndBody}
                            availableMacros = {[Macros.DOSSIER_NAME, Macros.RECIPIENT_NAME, Macros.SENDER_NAME]}
                        ></SubSection>
                        <SubSection 
                            sectionObj = {customEmailStringDict.formGroup.subjectAndBody.subsection2}
                            stateKey = {SubjectBodyEnum.SHARE_BOOKMARK}
                            value1 = {shareBookmarkSub}
                            cb1 = {setShareBookmarkSub}
                            value2 = {shareBookmarkBody}
                            cb2 = {setShareBookmarkBody}
                            stateData = {stateData}
                            resetSubAndBody = {resetSubAndBody}
                            availableMacros = {[Macros.DOSSIER_NAME, Macros.RECIPIENT_NAME, Macros.SENDER_NAME, Macros.BOOKMARK_COUNT]}
                        ></SubSection>
                        <SubSection 
                            sectionObj = {customEmailStringDict.formGroup.subjectAndBody.subsection3}
                            stateKey = {SubjectBodyEnum.MEMBER_ADDED}
                            value1 = {memberAddedSub}
                            cb1 = {setMemberAddedSub}
                            value2 = {memberAddedBody}
                            cb2 = {setMemberAddedBody}
                            stateData = {stateData}
                            resetSubAndBody = {resetSubAndBody}
                            availableMacros = {[Macros.SENDER_NAME, Macros.RECIPIENT_NAME]}
                        ></SubSection>
                        <SubSection 
                            sectionObj = {customEmailStringDict.formGroup.subjectAndBody.subsection4}
                            stateKey = {SubjectBodyEnum.USER_MENTION}
                            value1 = {userMentionSub}
                            cb1 = {setUserMentionSub}
                            value2 = {userMentionBody}
                            cb2 = {setUserMentionBody}
                            stateData = {stateData}
                            resetSubAndBody = {resetSubAndBody}
                            availableMacros = {[Macros.MENTION_TARGET, Macros.RECIPIENT_NAME, Macros.SENDER_NAME, Macros.DOSSIER_NAME]}
                        ></SubSection>
                    </Panel>
                    {/* Sender section */}
                    <Panel extra = {renderExtraHeader(false, true, 'sender',resetEmailSender)} header={customEmailStringDict.formGroup.emailSender.title} key="2" className="site-collapse-custom-panel">
                        {renderInputSection({'label': customEmailStringDict.formGroup.emailSender.labelName, 'value': emailSenderName, 'cb': setEmailSenderName,'elementId': 'emailSenderName','placeholder': '', 'propertyPath': 'sender.displayName', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.emailNameInvalidTip, 'validateCb': validEmailName, 'isNotEncode': true})}
                        {renderInputSection({'label': customEmailStringDict.formGroup.emailSender.labelAddress, 'value': emailSenderAddr, 'cb': setEmailSenderAddr,'elementId': 'emailSenderAddress','placeholder': customEmailStringDict.formGroup.emailSender.placeholder, 'propertyPath': 'sender.address', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.emailAddressInvalidTip, 'validateCb': validateEmail, 'isNotEncode': false})}
                    </Panel>
                    {/* Image section */}
                    <Panel extra = {renderExtraHeader(false, true, 'brandingImage', resetBrandImage)} header={customEmailStringDict.formGroup.image.brandImageTitle} key="3" className="site-collapse-custom-panel">
                        {renderSwitchSection(customEmailStringDict.formGroup.image.brandImageLabel, showImage, setShowImage, 'showBrandingImage',)}
                        {showImage && renderInputSection({'label': customEmailStringDict.formGroup.image.brandImageUrl, 'value': imageUrl, 'cb': setImageUrl,'elementId': 'brandingImage','placeholder': '', 'propertyPath': 'brandingImage.url', 'tooltip': false, 'enableValidate': true, 'errorMessage': customEmailStringDict.formGroup.actionButton.hostInvalidTip, 'validateCb': validateHttpUrl, 'isNotEncode': false})}
                    </Panel>
                    {/* Action button section */}
                    <Panel header={customEmailStringDict.formGroup.actionButton.title} key="4" className="site-collapse-custom-panel">
                        {/*button 1*/}
                        {renderSwitchSection(customEmailStringDict.formGroup.actionButton.label1, showButton1, setShowButton1, 'showBrowserButton',)}
                        
                        {showButton1 && renderBtnColorSection({label: customEmailStringDict.formGroup.actionButton.button1, value: button1Text, cb: setButton1Text, elementId: 'browserButtonStyle', placeholder: customEmailStringDict.formGroup.actionButton.button1_default, fontColor: button1FontColor, fontColorCb: setButton1FontColor, bgColor: button1BgColor, bgColorCb: setButton1BgColor})}
                        {showButton1 && renderInputSection({'label': customEmailStringDict.formGroup.actionButton.label2, 'value': hostWebPortal, 'cb': setHostWebPortal, 'elementId': 'hostPortal','placeholder': customEmailStringDict.formGroup.actionButton.placeholder, 'propertyPath': 'hostPortal', 'tooltip': true, 'enableValidate': true, 'errorMessage': customEmailStringDict.formGroup.actionButton.hostInvalidTip, 'validateCb': validateHttpUrl, 'isNotEncode': false, tooltipStr: hostTooltip})}
                        {/*button 2*/}
                        {renderSwitchSection(customEmailStringDict.formGroup.actionButton.label3, showButton2, setShowButton2, 'showMobileButton')}
                        {showButton2 && renderBtnColorSection({label: customEmailStringDict.formGroup.actionButton.button2, value: button2Text, cb: setButton2Text, elementId: 'mobileButtonStyle', placeholder: customEmailStringDict.formGroup.actionButton.button2_default, fontColor: button2FontColor, fontColorCb: setButton2FontColor, bgColor: button2BgColor, bgColorCb: setButton2BgColor})}
                        {showButton2 && renderMobileButtonLink({label: customEmailStringDict.formGroup.actionButton.button2Link, value: mobileButtonScheme, cb: setMobileButtonScheme, elementId: 'mobileButtonScheme', placeholder: customEmailStringDict.formGroup.actionButton.placeholder, propertyPath: 'button.mobileButtonScheme', enableValidate: true, errorMessage: customEmailStringDict.mobileLinkValidTip, validateCb: validateScheme})}
                        {/*button desc*/}
                        {renderSwitchSection(customEmailStringDict.formGroup.actionButton.showDescription, showDescription, setShowDescription, 'showButtonDescription')}
                        {showDescription && renderTextareaSection(actionDescription,setActionDescription, customEmailStringDict.formGroup.actionButton.descriptionDefaultStr, 'button.description')}
                    </Panel>
                    <Panel extra = {renderExtraHeader(true, true, 'reminder', resetReminder, notificationTooltip)} header={customEmailStringDict.formGroup.notificationReminder.title} key="5" className="site-collapse-custom-panel">
                        {renderSwitchSection(customEmailStringDict.formGroup.notificationReminder.label, showReminder, setShowReminder, 'showReminder')}
                        {showReminder && renderSingleMacroSection(customEmailStringDict.formGroup.notificationReminder.labelReminder, reminderContent, setReminderContent, customEmailStringDict.formGroup.notificationReminder.defaultReminder, true, [Macros.NOTIFICATION_COUNT])}
                        {showReminder && renderInputSection({'label': customEmailStringDict.formGroup.notificationReminder.reminderLinkText, 'value': reminderLinkText, 'cb': setReminderLinkText, 'elementId': 'reminderLinkText','placeholder': customEmailStringDict.formGroup.notificationReminder.reminderLinkText, 'propertyPath': 'reminder.linkText', 'tooltip': true, 'enableValidate': false, 'errorMessage': '', 'validateCb': null, 'isNotEncode': false, tooltipStr: customEmailStringDict.formGroup.notificationReminder.notificationLinkTip})}
                    </Panel>
                    <Panel header={customEmailStringDict.formGroup.sentBy.title} key="6" className="site-collapse-custom-panel">
                         {renderSwitchSection(customEmailStringDict.formGroup.sentBy.label1, showSendByInfo, setShowSendByInfo, 'showSentBy')}
                         {showSendByInfo && renderInputSection({'label': customEmailStringDict.formGroup.sentBy.label2, 'value': sentByOwner, 'cb': setSentByOwner,'elementId': 'sendByOwner','placeholder': customEmailStringDict.formGroup.sentBy.defaultSender, 'propertyPath': 'sentByText', 'tooltip': false, 'enableValidate': false, 'errorMessage': '', 'validateCb': null, 'isNotEncode': false})}
                    </Panel>
                    <Panel header={customEmailStringDict.formGroup.socialMedia.title} key="7" className="site-collapse-custom-panel">
                         {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.fb, check: showFb, value: fbLink, cb: setShowFb, cb_link: setFbLink, elementId: 'showFacebookBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-facebook-icon social-item', propertyPath: 'socialMedia.facebookLink', buttonPath: 'socialMedia.showFacebook', linkPrefix: customEmailStringDict.formGroup.socialMedia.fb_prefix})} 
                         {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.twitter, check: showTwitter, value: twitterLink, cb: setShowTwitter, cb_link: setTwitterLink, elementId: 'showTwitterBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-twitter-icon social-item', propertyPath: 'socialMedia.twitterLink', buttonPath: 'socialMedia.showTwitter', linkPrefix: customEmailStringDict.formGroup.socialMedia.twitter_prefix})}
                         {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.linked, check: showLinked, value: linkedLink, cb: setShowLinked, cb_link: setLinkedLink, elementId: 'showLinkedBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-linked-icon social-item', propertyPath: 'socialMedia.linkedInLink', buttonPath: 'socialMedia.showLinkedIn', linkPrefix: customEmailStringDict.formGroup.socialMedia.linked_prefix})}
                         {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.yt, check: showYt, value: ytLink, cb: setShowYt, cb_link: setYtLink, elementId: 'showYouTubeBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-yt-icon social-item', propertyPath: 'socialMedia.youTubeLink', buttonPath: 'socialMedia.showYouTube', linkPrefix: customEmailStringDict.formGroup.socialMedia.yt_prefix})}
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