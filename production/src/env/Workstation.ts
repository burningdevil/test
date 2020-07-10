import {
  EnvironmentChangeArg, MstrObject, WindowEvent,
  CommandCallBack, CommandCallBackAsync, DialogValues
} from '@mstr/workstation-types'

declare var workstation: any

interface confirmationOptions {
  message: string;
  additionalInformation?: string;
  onOptionYes?: Function;
  onOptionNo?: Function;
  onOptionCancel?: Function;
}

class WorkstationEnv {
  getSelectedObject = async () => {
    const object = await workstation.selectedObject.getCurrent()
    return object
  }

  getCurrentProject = async () => {
    const project = await workstation.selectedObject.getCurrentProject()
    return project
  }

  getPermissions = async () => {
    const permissions = await workstation.selectedObject.getAccessPermissions()
    return permissions
  }

  getCurrentEnvironment = async () => {
    const env = await workstation.environments.getCurrentEnvironment()
    return env
  }

  setTitle = (title: string) => workstation.window.setTitle(title)

  refreshObject = (object: MstrObject) => workstation.selectedObject.refreshObject(object)

  onEnvironmentChange = (callback: (data: EnvironmentChangeArg) => void) => {
    workstation.environments.onEnvironmentChange(callback)
  }

  error = async (errObj: any) => {
    const resp = await workstation.dialogs.error(errObj)
    return resp
  }

  close = () => workstation && workstation.window.close()

  addHandler = (windowEvent: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => workstation.window.addHandler(windowEvent, callback)

  removeHandler = (windowEvent: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => workstation.window.removeHandler(windowEvent, callback)

  showConfirmation = async (options: confirmationOptions) => {
    const { message, additionalInformation, onOptionYes, onOptionNo, onOptionCancel } = options
    const clickedBtn = await workstation.dialogs.confirmation({ message, additionalInformation })
    switch (clickedBtn) {
    case DialogValues.YES:
      onOptionYes && onOptionYes()
      break
    case DialogValues.NO:
      onOptionNo && onOptionNo()
      break
    case DialogValues.CANCEL:
      onOptionCancel && onOptionCancel()
      break
    default:
    }
  }
}

const workstationEnv = new WorkstationEnv()

export default workstationEnv
