/* eslint-disable import/prefer-default-export */
import * as compareVersions from 'compare-versions';

//TODO: replaced below config value.
const LIBRARY_SERVER_VERSION_THRESHOLD = '11.3.0200';
const ISERVER_VERSION_THRESHOLD = '11.3.0200';
const USER_MANAGE_APPLICATIONS_PRIVILEGE = 1; //to do 0708: need to change to 298
export const DEFAULT_CONFIG_ID = 'xxxxxxxxxxxxxxxxx';

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
