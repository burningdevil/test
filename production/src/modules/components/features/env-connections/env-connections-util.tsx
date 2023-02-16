import * as React from 'react';
import { message } from 'antd';
import * as api from '../../../../services/Api';
import { RestApiError } from '../../../../server/RestApiError';
import { EnvironmentConnectionApplicationType, HomeScreenConfigType } from "src/types/data-model/HomeScreenConfigModels";
import { isLibraryServerVersionMatch, isIServerVersionMatch } from '../../../../utils';
import { localizedStrings } from '../../HomeScreenConfigConstant';

export const envConnectionsUrlCustomAppPath = 'app/config/';
export const envConnectionsClassNamePrefix = 'mstr-env-connection';

// returns base url/domain parsed from passed url
export const getBaseUrl = (url: string) => {
    return url.split(envConnectionsUrlCustomAppPath)[0];
}

// returns application id (if any) parsed from passed url
export const getApplicationIdFromUrl = (url: string) => {
    return url.split(envConnectionsUrlCustomAppPath)[1];
}

const processErrorResponse = (error: RestApiError, envName: string) => {
    message.error({
        content: (<div className='error-msg-wrapper'>
            <span className='error-env-name'>{envName} : </span>
            <span className='error-msg-content'>{error.errorMsg}</span>
        </div>),
        className: 'mstr-env-connections-error-notice',
        duration: 0.7
    });
}

/**
 * Fetches the list of applications for a linked environment from the server 
 * if the following conditions are met
 * 1. The environment is connected
 * 2. The environment webVersion and iServerVersion are atleast the minimum base required to support custom application
 * 
 * The error object is updated if an error is encountered
 * 
 * @param envBaseUrl - url of linked environment
 * @param envName - name of linked environment
 * @param isEnvConnected - connected status of environment
 * @param errorObject - empty error object to be set incase errors are envountered
 * @returns envApplicationList
*/
export const getApplicationListFromServer = async (envBaseUrl: string, envName: string, isEnvConnected: boolean, errorObject: { errorMessage?: string }) => {
    let envApplicationList: Array<EnvironmentConnectionApplicationType> = [];

    if (isEnvConnected) {
        try {
            const { webVersion, iServerVersion } = await api.getServerStatus(getBaseUrl(envBaseUrl));
            const isCustomAppsSupported = isIServerVersionMatch(iServerVersion) && isLibraryServerVersionMatch(webVersion)
            if (isCustomAppsSupported) {
                const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                const { applications: fetchedEnvApplicationList } = response;
                envApplicationList = fetchedEnvApplicationList.map((app: HomeScreenConfigType) => ({ name: app.name, id: app.id, isDefault: app.isDefault, logo: app.homeScreen?.theme?.logos?.web }));
            } else {
                errorObject.errorMessage = localizedStrings.CUSTOM_APPS_NOT_SUPPORTED_MSG;
            }
        } catch (e: any) {
            const isRestApiError = e instanceof RestApiError;
            if (isRestApiError) {
                processErrorResponse(e, envName);
            }
            errorObject.errorMessage = isRestApiError ? e.errorMsg : e.message;
        }
    } else {
        errorObject.errorMessage = localizedStrings.CONNECT_TO_ENV_MSG;
    }

    return envApplicationList;
}

/**
 * Checks whether the currently configured application has been deleted on the server 
 * OR if the user does not have read access to the application 
 * @param envUrl - environment url containing the current application
 * @param isEnvConnected - boolean value to indicate the connected status of the env
 * @param applicationList - list of applications on the env
 * @returns 
*/
export const isCurrAppDeletedOrAccessLimited = async (envUrl: string, isEnvConnected: boolean, applicationList: Array<EnvironmentConnectionApplicationType>) => {
    let isCurrentAppDeleted = false;
    let isCurrentAppAccessLimited = false;
    const currentApplicationId = getApplicationIdFromUrl(envUrl);

    // if current application id is undefined it is the default application
    // we assume isCurrentAppAccessLimited as true
    if (!currentApplicationId) {
        return { isCurrentAppDeleted, isCurrentAppAccessLimited: true };
    }

    // if the current application is not present in the application list and the environemnt is connected
    // Try to retrieve the application using /v2/applications/{applicationId}
    if (!applicationList.find(app => app.id === currentApplicationId) && isEnvConnected) {
        try {
            const envBaseUrl = getBaseUrl(envUrl);
            await api.loadConfig(currentApplicationId, envBaseUrl);
        } catch (err) {
            if (err instanceof RestApiError) {
                const { errorCode } = err;
                isCurrentAppDeleted = errorCode === 'ERR004'; // Application has been deleted
                isCurrentAppAccessLimited = errorCode === 'ERR017'; // Application cannot be read as user lacks read privileges
            }
        }
    }

    return { isCurrentAppDeleted, isCurrentAppAccessLimited };
}
