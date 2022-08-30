/* eslint-disable import/prefer-default-export */
import * as compareVersions from 'compare-versions';

// Custom Application Support start from 11.3.4
const LIBRARY_SERVER_VERSION_THRESHOLD = '11.3.0400';
const ISERVER_VERSION_THRESHOLD = '11.3.0400';
const USER_MANAGE_APPLICATIONS_PRIVILEGE = 298;
const MANAGE_CONTENT_BUNDLE_PRIVILEGE = 294
export const APPLICATIONS_FOLDER_ID = '4B979645463C14EF5A32EF8A032C9AC1';
export const APPLICATIONS_FOLDER_TYPE = 8;
export const LIBRARY_SERVER_SUPPORT_DOC_TYPE_VERSION = '11.3.0500';
export const LIBRARY_SERVER_SUPPORT_CONTENT_GROUP_VERSION = '11.3.0500';
export const LIBRARY_SERVER_SUPPORT_COLOR_PALETTE_VERSION = '11.3.0600';
export const LIBRARY_SERVER_SUPPORT_APPEARANCE_EDITOR_VERSION = '11.3.0600';
export const LIBRARY_SERVER_SUPPORT_CUSTOM_EMAIL_VERSION = '11.3.0760';
export const LIBRARY_SERVER_SUPPORT_INSIGHTS_CONTROL = '11.3.0760';
export const LIBRARY_SERVER_SUPPORT_AUTH_MODE = '11.3.0760';

/**
 * a function to judge whether the version is matched requirement
 * @param {string} version the original version number, like "11.3.0100.xxxx"
 * @param {string} threshold the minimum version required
 */
export const isLibraryServerVersionMatch = (
    version: string,
    baseLineVersion: string = LIBRARY_SERVER_VERSION_THRESHOLD
) => {
    const filteredVersionNums = version.split('.');
    filteredVersionNums.pop();
    return compareVersions(filteredVersionNums.join('.'), baseLineVersion) >= 0;
};

export const isIServerVersionMatch = (version: string) => {
    const filteredVersionNums = version.split('.');
    filteredVersionNums.pop();
    return (
        compareVersions(
            filteredVersionNums.join('.'),
            ISERVER_VERSION_THRESHOLD
        ) >= 0
    );
};

export const isUserHasManageApplicationPrivilege = (privileges: number[]) => {
  return privileges?.includes(USER_MANAGE_APPLICATIONS_PRIVILEGE);
}

export const isUserHasManageContentGroupPrivilege = (privileges: number[]) => {
  return privileges?.includes(MANAGE_CONTENT_BUNDLE_PRIVILEGE);
}
