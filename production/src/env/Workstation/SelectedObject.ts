import { SelectedObjectModule, MstrObject } from '@mstr/workstation-types'

declare var workstation: any

class SelectedObject implements SelectedObjectModule {
  getAdditionalInformation = () => workstation.selectedObject.getAdditionalInformation()

  getCurrentEnvironment = () => workstation.selectedObject.getCurrentEnvironment()

  getCurrentProject = () => workstation.selectedObject.getCurrentProject()

  getCurrent = () => workstation.selectedObject.getCurrent()

  refreshObject = (updatedObject?: MstrObject) => workstation.selectedObject.refreshObject(updatedObject)

  getAccessPermissions = () => workstation.selectedObject.getAccessPermissions()

  getIsReadOnly = () => workstation.selectedObject.getIsReadOnly()

  // Custom methods
  getSelectedObject = () => this.getCurrent()
}

const selectedObject = new SelectedObject()
export default selectedObject
