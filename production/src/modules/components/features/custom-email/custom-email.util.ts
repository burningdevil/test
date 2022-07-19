import * as _ from 'lodash';

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

export function getConfigIdFromHeader(headers: any) {
    const location = headers.get('location');
    const splitLocation = location.split('/');
    return splitLocation[splitLocation.length - 1];
}

function getFirstName(fullName: string) {
    let names,
        commaIdx = fullName.indexOf(',');

    if (commaIdx > 0) {
        names = fullName.substring(commaIdx + 1, fullName.length).trim();
    } else {
        names = fullName.trim();
    }

    return names.split(' ')[0];
}

function getShareUrl(configId: string, currentEvnUrl: string, isDefaultApp: boolean) {
    return currentEvnUrl + 'app' + (isDefaultApp ? '' : '/config/' + configId);
}

function getMobileLink(configId: string, currentEvnUrl: string, isDefaultApp: boolean) {
    return 'dossier://?url=' + encodeURIComponent(currentEvnUrl + 'app' + (isDefaultApp ? '' : '/config/' + configId));
}

function getNotificationLink(configId: string, currentEvnUrl: string, isDefaultApp: boolean) {
    return currentEvnUrl + 'app' + (isDefaultApp ? '' : '/config/' + configId) + '/notification/share';
}

export function constructSendingEmailRequestBody(configId: string, userInfo: any, currentEnvUrl: string, isDefaultApp: boolean, emailSettings: any) {
    const userId = _.get(userInfo, 'id', null)
    if (userId) {
        const mobileLink = getMobileLink(configId, currentEnvUrl, isDefaultApp);
        const notificationLink = getNotificationLink(configId, currentEnvUrl, isDefaultApp);
        const fullName = _.get(userInfo, 'fullName', '');
        const firstName = getFirstName(fullName);
        let requestBody = {
            "notificationType": "DOSSIER_COMMENT",
            "userIds": [
              userId
            ],
            "template": {
              "templateName": "custom_email_preview",
              "tokens": {
                "dossierName": "[dossier name]",
                "senderName": fullName,
                "recipient": firstName,
                "mobileLink": mobileLink,
                "notificationLink": notificationLink
              }
            },
            "isHTML": "true",
            "applicationId": configId
        }
        const hostPortal = _.get(emailSettings, 'hostPortal', null);
        if (!hostPortal) {
            const shareLink = getShareUrl(configId, currentEnvUrl, isDefaultApp);
            _.set(requestBody, 'template.tokens.shareLink', shareLink);
        }
        
        return requestBody;
    } else {
        return null;
    }
}
