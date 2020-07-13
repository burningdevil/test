import { SelectedObjectModule, MstrObject } from '@mstr/workstation-types'
import { env, selectedObj, project, permissions } from './constants'

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
