import * as _ from 'lodash';
import { DEFAULT_EMAIL_SETTING } from '../../../../../src/store/reducers/HomeScreenConfigEditorReducer';
import { HomeScreenConfigType } from '../../../../../src/types/data-model/HomeScreenConfigModels';

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

export const decodeContent = (v: string) => {
    return _.unescape(v)?.replace(/(\<br\>)/gm, '\n')?.trim();
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
    const re = /\S+@\S+\.\S+/;
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

export const filterEmailConfig = (config: HomeScreenConfigType) => {
    // filter the content default string.
    if(config.emailSettings?.content){
        let content = config?.emailSettings?.content;
        const checkPathList = [SubjectBodyEnum.SHARE_DOSSIER, SubjectBodyEnum.SHARE_BOOKMARK, SubjectBodyEnum.MEMBER_ADDED, SubjectBodyEnum.USER_MENTION]
        checkPathList.forEach(p => {
            if(content?.[p]?.subject === DEFAULT_EMAIL_SETTING['content'][p].subject || content?.[p]?.subject === ''){
                content[p].subject = null;
            }
            if(content?.[p]?.body === DEFAULT_EMAIL_SETTING['content'][p].body){
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

export const colorGuideHexVals = [
    { name: 'Rose ###', color: '#FBDAD9' },
    { name: 'Peach ###', color: '#FFDEC6' },
    { name: 'Buttermilk ###', color: '#FFF3B3' },
    { name: 'Honeydew ###', color: '#E1F5C9' },
    { name: 'Mint ###', color: '#D7F6F0' },
    { name: 'Iceberg ###', color: '#DCECF1' },
    { name: 'Fog ###', color: '#DEDDFF' },
    { name: 'Lavender ###', color: '#DDCAFF' },
    { name: 'Pink ###', color: '#FDA29A' },
    { name: 'Coral ###', color: '#FFAE8B' },
    { name: 'Sweet Corn ###', color: '#FAD47F' },
    { name: 'Green Pea ###', color: '#BFE2A2' },
    { name: 'Aqua ###', color: '#AADED7' },
    { name: 'Frost ###', color: '#A6CCDD' },
    { name: 'Pale Purple ###', color: '#9D9FE0' },
    { name: 'Orchid ###', color: '#B496DD' },
    { name: 'Salmon ###', color: '#DB6657' },
    { name: 'Orange ###', color: '#D76322' },
    { name: 'Honey ###', color: '#E69912' },
    { name: 'Grass ###', color: '#83C962' },
    { name: 'Turquoise ###', color: '#55BFC3' },
    { name: 'Ocean Blue ###', color: '#1C8DD4' },
    { name: 'Royal Blue ###', color: '#4F60D6' },
    { name: 'Violet ###', color: '#834FBD' },
    { name: 'Ruby Red ###', color: '#C1292F' },
    { name: 'Rust ###', color: '#9A3A0A' },
    { name: 'Caramel ###', color: '#B27B11' },
    { name: 'Emerald ###', color: '#38AE6F' },
    { name: 'Teal ###', color: '#028F94' },
    { name: 'Indigo ###', color: '#0F6095' },
    { name: 'Sapphire ###', color: '#31329D' },
    { name: 'Plum ###', color: '#5C388C' },
    { name: 'Maroon ###', color: '#7E0F16' },
    { name: 'Chestnut ###', color: '#733413' },
    { name: 'Nutmeg ###', color: '#7B5B31' },
    { name: 'Forest ###', color: '#1D6F31' },
    { name: 'Pine Green ###', color: '#156962' },
    { name: 'Navy ###', color: '#193B67' },
    { name: 'Midnight ###', color: '#1B1575' },
    { name: 'Deep Purple ###', color: '#3A2471' },
    { name: 'Black ###', color: '#000000' },
    { name: 'Charcoal ###', color: '#35383A' },
    { name: 'Dark Gray ###', color: '#6C6C6C' },
    { name: 'Silver ###', color: '#ABABAB' },
    { name: 'Porcelain ###', color: '#DEDEDE' },
    { name: 'Mist ###', color: '#EBEBEB' },
    { name: 'Smoke White ###', color: '#F4F4F4' },
    { name: 'White ###', color: '#FFFFFF' },
];
