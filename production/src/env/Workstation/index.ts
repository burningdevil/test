import { MessengerModule, PythonModule, StorageModule, WorkstationModule } from '@mstr/workstation-types'
import dialogs from './Dialogs'
import data from './Data'
import environments from './Environments'
import menus from './Menus'
import utils from './Util'
import window from './Window'
import selectedObject from './SelectedObject'

class WorkstationEnv implements WorkstationModule {
  storage: StorageModule
  messenger: MessengerModule
  python: PythonModule
  dialogs = dialogs;

  data = data

  environments = environments

  menus = menus

  utils = utils

  window = window

  selectedObject = selectedObject
}

const workstationEnv = new WorkstationEnv()

export default workstationEnv
