import * as React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Input as AntdInput } from 'antd';
import * as Actions from '../../../../../../../store/actions/ActionsCreator';
import { CustomEmailSettingType } from '../../../../../../../../src/types/data-model/HomeScreenConfigModels';
import { FormSocialItemInputModel } from '../form-input.model';
import * as _ from 'lodash';
import { customEmailStringDict } from '../../../../../HomeScreenConfigConstant';
import { encodeContent } from '../../../custom-email.util';
const classNamePrefix = 'custom-email-form-v2'
interface SocialMediaSectionInput {
    env?: any;
    validate?: Function;
    stateData: CustomEmailSettingType;
}
const SocialMediaSection: React.FC<SocialMediaSectionInput> = (props: SocialMediaSectionInput
    ) => {
        const dispatch = useDispatch();
        const {stateData} = props;
        // social media
        /*
        * if the Q3 scope enable the customize email and disable the show social media button. There should be handled in special.
        */
        const [showSocialMedia, ] = useState( Reflect.has(stateData, 'showSocialMedia') ? stateData.showSocialMedia : true);
        const [showFb, setShowFb] = useState(_.has(stateData, 'socialMedia.showFacebook') ? stateData?.socialMedia?.showFacebook : showSocialMedia);
        const [fbLink, setFbLink] = useState(_.unescape(stateData?.socialMedia?.facebookLink));
        const [showTwitter, setShowTwitter] = useState(_.has(stateData, 'socialMedia.showTwitter') ? stateData?.socialMedia?.showTwitter : showSocialMedia);
        const [twitterLink, setTwitterLink] = useState(_.unescape(stateData?.socialMedia?.twitterLink));
        const [showLinked, setShowLinked] = useState(_.has(stateData, 'socialMedia.showLinkedIn') ? stateData?.socialMedia?.showLinkedIn : showSocialMedia);
        const [linkedLink, setLinkedLink] = useState(_.unescape(stateData?.socialMedia?.linkedInLink));
        const [showYt, setShowYt] = useState(_.has(stateData, 'socialMedia.showYouTube') ? stateData?.socialMedia?.showYouTube : showSocialMedia); // yt is short for the youTube
        const [ytLink, setYtLink] = useState(_.unescape(stateData?.socialMedia?.youTubeLink));
         
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
        const renderSocialItemSection = (socialItemInput: FormSocialItemInputModel) => {
            const {label, check, value, cb, cb_link, placeholder, className, propertyPath, buttonPath, linkPrefix} = socialItemInput;
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
            {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.fb, check: showFb, value: fbLink, cb: setShowFb, cb_link: setFbLink, elementId: 'showFacebookBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-facebook-icon social-item', propertyPath: 'socialMedia.facebookLink', buttonPath: 'socialMedia.showFacebook', linkPrefix: customEmailStringDict.formGroup.socialMedia.fb_prefix})} 
            {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.twitter, check: showTwitter, value: twitterLink, cb: setShowTwitter, cb_link: setTwitterLink, elementId: 'showTwitterBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-twitter-icon social-item', propertyPath: 'socialMedia.twitterLink', buttonPath: 'socialMedia.showTwitter', linkPrefix: customEmailStringDict.formGroup.socialMedia.twitter_prefix})}
            {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.linked, check: showLinked, value: linkedLink, cb: setShowLinked, cb_link: setLinkedLink, elementId: 'showLinkedBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-linked-icon social-item', propertyPath: 'socialMedia.linkedInLink', buttonPath: 'socialMedia.showLinkedIn', linkPrefix: customEmailStringDict.formGroup.socialMedia.linked_prefix})}
            {renderSocialItemSection({label: customEmailStringDict.formGroup.socialMedia.yt, check: showYt, value: ytLink, cb: setShowYt, cb_link: setYtLink, elementId: 'showYouTubeBtn', placeholder: customEmailStringDict.formGroup.socialMedia.placeholder, className: 'font-yt-icon social-item', propertyPath: 'socialMedia.youTubeLink', buttonPath: 'socialMedia.showYouTube', linkPrefix: customEmailStringDict.formGroup.socialMedia.yt_prefix})}
            </>
            )
};

  


export default SocialMediaSection;