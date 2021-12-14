/* eslint-disable import/prefer-default-export */
import * as compareVersions from 'compare-versions';

// Custom Application Support start from 11.3.4
const LIBRARY_SERVER_VERSION_THRESHOLD = '11.3.0400';
const ISERVER_VERSION_THRESHOLD = '11.3.0400';
const USER_MANAGE_APPLICATIONS_PRIVILEGE = 298;
export const APPLICATIONS_FOLDER_ID = '4B979645463C14EF5A32EF8A032C9AC1';
export const APPLICATIONS_FOLDER_TYPE = 8;

/**
 * a function to judge whether the version is matched requirement
 * @param {string} version the original version number, like "11.3.0100.xxxx"
 * @param {string} threshold the minimum version required
 */
export const isLibraryServerVersionMatch = (version: string) => {
  const filteredVersionNums = version.split('.')
  filteredVersionNums.pop()
  return compareVersions(filteredVersionNums.join('.'), LIBRARY_SERVER_VERSION_THRESHOLD) >= 0
}

export const isIServerVersionMatch = (version: string) => {
  const filteredVersionNums = version.split('.')
  filteredVersionNums.pop()
  return compareVersions(filteredVersionNums.join('.'), ISERVER_VERSION_THRESHOLD) >= 0
}

export const isUserHasManageApplicationPrivilege = (privileges: number[]) => {
  return privileges.includes(USER_MANAGE_APPLICATIONS_PRIVILEGE);
}
