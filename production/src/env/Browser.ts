import { EnvironmentChangeArg, MstrObject, WindowEvent, CommandCallBack, CommandCallBackAsync } from '@mstr/workstation-types'

interface confirmationOptions {
  message: string;
  additionalInformation?: string;
  onOptionYes?: Function;
  onOptionNo?: Function;
  onOptionCancel?: Function;
}

const env = {
  id: '2D357C22-2AF2-494A-B8AF-7F077BBF8733',
  name: 'Test Env',
  status: 2,
  subType: -1,
  type: -1,
  url: 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/',
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

const project = { id: "B19DEDCC11D4E0EFC000EB9495D0F44F", name: "MicroStrategy Tutorial", type: 32, subType: 8192 }
const selectedObject = { id: "78CE13C64CD815C05BCB828475AE2A8F", name: "Untitled Filter", type: 1, subType: 256 }

class BrowserEnv {
  getSelectedObject = async () => selectedObject

  getCurrentProject = async () => project

  getPermissions = async () => permissions

  getCurrentEnvironment = async () => env

  setTitle = (title: string) => { console.log(title) }

  refreshObject = (object: MstrObject) => {}

  onEnvironmentChange = (callback: (data: EnvironmentChangeArg) => void) => {}

  error = async (errObj: any) => {
    console.log(errObj)
  }

  close = () => {
    console.log('Closing')
  }

  addHandler = (windowEvent: WindowEvent, callback: CommandCallBack | CommandCallBackAsync) => true

  removeHandler = (windowEvent: WindowEvent, callback: CommandCallBack | CommandCallBackAsync) => true

  showConfirmation = (options: confirmationOptions) => {
    const { message } = options
    console.log(message)
  }
}

const browserEnv = new BrowserEnv()

export default browserEnv
