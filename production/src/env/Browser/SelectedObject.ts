import { SelectedObjectModule, MstrObject } from '@mstr/workstation-types'

const project = { id: 'B19DEDCC11D4E0EFC000EB9495D0F44F', name: 'MicroStrategy Tutorial', type: 32, subType: 8192 }
const selectedObj = { id: '78CE13C64CD815C05BCB828475AE2A8F', name: 'Untitled Filter', type: 1, subType: 256 }
const env = {
  id: '2D357C22-2AF2-494A-B8AF-7F077BBF8733',
  name: 'Test Env',
  status: 2,
  subType: -1,
  type: -1,
  url: new URL('http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/'),
  webVersion: '11.2.0200.130358J'
}
const permissions = {
  canBrowse: true,
  canControl: true,
  canDelete: true,
  canExecute: true,
  canFullPermission: true,
  canRead: true,
  canUse: true,
  canUseExecute: true,
  canWrite: true,
}

class SelectedObject implements SelectedObjectModule {
  getAdditionalInformation = async () => selectedObj

  getCurrentEnvironment = async () => env

  getCurrentProject = async () => project

  getCurrent = async () => selectedObj

  refreshObject = (updatedObject?: MstrObject) => {}

  getAccessPermissions = async () => permissions

  getIsReadOnly = async () => false

  // Custom methods
  getSelectedObject = () => this.getCurrent()
}

const selectedObject = new SelectedObject()
export default selectedObject
