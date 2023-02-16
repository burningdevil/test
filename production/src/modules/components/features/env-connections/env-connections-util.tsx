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
            const isCustomAppsSupported =  isIServerVersionMatch(iServerVersion) && isLibraryServerVersionMatch(webVersion)
            if (isCustomAppsSupported) {
                const response = await api.fetchAllApplicationsForOtherEnv(envBaseUrl);
                const { applications: fetchedEnvApplicationList } = response;
                envApplicationList = fetchedEnvApplicationList.map((app: HomeScreenConfigType) => ({ name: app.name, id: app.id, isDefault: app.isDefault, logo: app.homeScreen?.theme?.logos?.web }));
            } else {
                errorObject.errorMessage =  localizedStrings.CUSTOM_APPS_NOT_SUPPORTED_MSG;
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