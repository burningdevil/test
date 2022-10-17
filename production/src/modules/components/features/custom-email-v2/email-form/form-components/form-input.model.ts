import { CustomEmailSettingType, ActionButtonInterface } from "src/types/data-model/HomeScreenConfigModels";

export interface FormInputModel {
    label: string, 
    value: string, 
    cb: Function, 
    elementId: keyof CustomEmailSettingType | string, 
    placeholder: string, 
    propertyPath: string, 
    tooltip?: boolean, 
    enableValidate?: boolean, 
    errorMessage?: string, 
    validateCb?: Function, 
    isNotEncode?: boolean, 
    tooltipStr?: any
}
export interface FormBtnColorInputModel {
    label: string, 
    value: string, 
    cb: Function, 
    elementId: keyof ActionButtonInterface, 
    placeholder: string, 
    fontColor: string, 
    fontColorCb: Function, 
    bgColor: string, 
    bgColorCb: Function
}

export interface FormMobileButtonLinkInputModel {
    label: string, 
    value: string, 
    cb: Function, 
    elementId: keyof CustomEmailSettingType | string, 
    placeholder: string, 
    propertyPath: string, 
    tooltip?: boolean, 
    enableValidate?: boolean, 
    errorMessage?: string, 
    validateCb?: Function
}

export interface FormSocialItemInputModel {
    label: string, 
    check: boolean, 
    value: string, 
    cb: Function | any, 
    cb_link: Function,  
    elementId: keyof CustomEmailSettingType | any, 
    placeholder: string, className: string, 
    propertyPath: string, 
    buttonPath: string, 
    linkPrefix: string
}