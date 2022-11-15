import * as _ from 'lodash';
import { DEFAULT_EMAIL_SETTING } from '../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import { HomeScreenConfigType } from '../../../../../src/types/data-model/HomeScreenConfigModels';
import { customEmailStringDict } from '../../HomeScreenConfigConstant';
var UrlParse = require('url-parse');
export function validateHttpUrl(url: string) {
    try {
        if (url.length > 0) {
            new URL(url);
        } else {
            return true
        }
    } catch (err) {
        return false;
    }

    return true
}

export function validatePortalUrl(whitelist: string[] = [], allowAll: boolean, envUrl: string, errorMsg: any,  url: string) {
    try {
        if (url?.length > 0) {
            new URL(url);
        } else {
            return true;
        }
        if(allowAll){
            return true;
        }else {
            const allUrls = envUrl ? [envUrl].concat(whitelist) : whitelist?.slice();
            const domains = allUrls?.map(v => {
                const url = new UrlParse(v);
                return url?.origin;
            })
            const currentUrl = new UrlParse(url);
            return domains.includes(currentUrl?.origin) ? true : errorMsg;
        }
    } catch (err) {
        return false;
    }
}

export function validateImageUrl(url: string){
    try {
        if (url.length > 0) {
            new URL(url);
        } else {
            return true;
        }
        // validate the suffix;
        const imageAddr = new UrlParse(url);
        const pathName = imageAddr.pathname; // strip the query params;
        return /\w.(png|jpg|jpeg|webp|bmp)$/gm.test(pathName?.toLowerCase()) ? true : customEmailStringDict.formGroup.image.invalidImageAddressTip; // exclude svg
    } catch (err) {
        return false;
    }
}

export const decodeContent = (v: string) => {
    return _.unescape(v)?.trim();
}

export const encodeContent = (v: string) => {
    return v?.trim();
}

export enum SubjectBodyEnum {
    SHARE_DOSSIER = 'SHARE_DOSSIER',
    SHARE_BOOKMARK = 'SHARE_BOOKMARK',
    MEMBER_ADDED = 'MEMBER_ADDED',
    USER_MENTION = 'USER_MENTION'
}
export enum EmailSettingKeyEnum {
    CONTENT = 'content'
}

export function validateScheme(name: string) {
    const pattern = /^[0-9a-zA-Z]+$/g;
    return pattern.test(name);  
}

export function validateEmail(email: string) 
{   // email can be set empty
    if(!email) return true;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // NOSONAR; comes from RFC 5322 Official Standard; http://emailregex.com/
    return re.test(email);
}
export function validEmailName(name: string) {
    //cannot contain any of the following characters: \"[]<>
    const SPECIAL_CHARACTER_REGEX = /[\\\[\]\"\<\>]/;
    const pattern = SPECIAL_CHARACTER_REGEX;
    const isInvalidCharacter = pattern.test(name);
    return !isInvalidCharacter;
  }
export function validateEmpty(text: string) 
{
    return text === '' ? false: true;
}
export function stripScripts(s: string) {
    return s.replace(/<script([^>]*)>([\S\s]*?)<\/script\s*>/gi, '');
}

export const filterEmailConfig = (config: HomeScreenConfigType) => {
    // filter the content default string.
    if(config.emailSettings?.content){
        let content = config?.emailSettings?.content;
        const checkPathList = [SubjectBodyEnum.SHARE_DOSSIER, SubjectBodyEnum.SHARE_BOOKMARK, SubjectBodyEnum.MEMBER_ADDED, SubjectBodyEnum.USER_MENTION]
        checkPathList.forEach(p => {
            if(content?.[p]?.subject === DEFAULT_EMAIL_SETTING['content'][p].subject || content?.[p]?.subject === ''){
                content[p].subject = null;
            }
            if(content?.[p]?.body === DEFAULT_EMAIL_SETTING['content'][p].body || content?.[p]?.body === ''){
                content[p].body = null;
            }
            if(content?.[p]?.subject === null && content?.[p]?.body === null){
                delete content[p];
            }
        })
        if(Object.keys(content)?.length === 0){
            delete config.emailSettings.content;
        }
    }
    // showDescription related
    if(!Reflect.has(config.emailSettings, 'showButtonDescription')){
        config.emailSettings.showButtonDescription = config.emailSettings.showBrowserButton && config.emailSettings.showMobileButton;
    }
    // reminder related
    if(config.emailSettings?.reminder){
        let reminder = config.emailSettings?.reminder;
        if(reminder?.text === DEFAULT_EMAIL_SETTING['reminder'].text){
            reminder.text = null;
        }
    }
    // social media default check
    const checkSocialPathList: string[] = ['facebookLink', 'twitterLink', 'linkedInLink', 'youTubeLink']
    if(config.emailSettings?.socialMedia){
        let socialMedia: any = config.emailSettings?.socialMedia;
        checkSocialPathList.forEach(p => {
            if((socialMedia[p] as string) === DEFAULT_EMAIL_SETTING['socialMedia'][p]){
                socialMedia[p] = null;
            }
        })
    }
    
    // filter the sender string.
    if(config?.emailSettings?.sender){
        let sender = config?.emailSettings?.sender;
        if(sender?.address?.trim() === ''){
            sender.address = DEFAULT_EMAIL_SETTING.sender.address;
        }
        if(sender?.displayName?.trim() === ''){
            sender.displayName = DEFAULT_EMAIL_SETTING.sender.displayName;
        }
    }
    // filter the image url
    if(config?.emailSettings?.brandingImage){
        let brandImage = config.emailSettings?.brandingImage;
        if(brandImage?.url === ''){
            brandImage.url = null;
        }
    }
    return config;
}


export const WHITE_HEX_COLOR = '#ffffff';
export const PRIMARY_BLUE_HEX_COLOR = '#3492ed';
