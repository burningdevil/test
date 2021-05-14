import * as _ from "lodash";
const EnumDSSXMLViewMedia = {
    DssXmlViewMediaViewStatic: 0x00000001,
    DssXmlViewMediaViewAnalysis: 0x00000800,
    DssXmlViewMediaHTML5Dashboard: 0x00002000
};

enum HomeScreenHomeObjectType {
    DOCUMENT = 'Document',
    DOSSIER = 'Dossier'
}

export enum BundleRecipientType {
    NONE = 'None',
    USER = 'User',
    GROUP = 'Group',
    BOTH = 'Both'
}

export function getContentType (viewMedia: number) {
    const defModePosition = viewMedia >> 27;
    let defaultViewMedia;
    if (defModePosition == 0) {
        defaultViewMedia = 0;
    }

    defaultViewMedia = EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << defModePosition - 1;
    if (defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis || defaultViewMedia == EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard) {
        return HomeScreenHomeObjectType.DOSSIER;
    } else {
        return HomeScreenHomeObjectType.DOCUMENT;
    }
}

export function isContentTypeDossier (viewMedia: number) {
    return getContentType(viewMedia) === HomeScreenHomeObjectType.DOSSIER;
}

export function hexIntToColorStr (hexIntColor: number) {
    return  '#' + hexIntColor.toString(16).padStart(6, '0');
}

export function colorStrToHexInt (colorStr: string) {
    // const hexString = _.replace(colorStr, '#', '0x');
    // return parseInt(Number(hexString), 10);
    var hex = parseInt(colorStr.replace(/^#/, ''), 16);
    return hex;
}