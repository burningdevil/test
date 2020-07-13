import { MenuCallBack, MenusModule } from '@mstr/workstation-types'
import { menuRes } from './constants'

class Menus implements MenusModule {
  addHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  removeHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  trigger = async (menu: string) => menuRes
}

const menus = new Menus()
export default menus
