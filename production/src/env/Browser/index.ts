import { WorkstationModule } from '@mstr/workstation-types'
import dialogs from './Dialogs'
import data from './Data'
import environments from './Environments'
import menus from './Menus'
import utils from './Util'
import window from './Window'
import selectedObject from './SelectedObject'

class BrowserEnv implements WorkstationModule {
  dialogs = dialogs;

  data = data

  environments = environments

  menus = menus

  utils = utils

  window = window

  selectedObject = selectedObject
}

const browserEnv = new BrowserEnv()

export default browserEnv
