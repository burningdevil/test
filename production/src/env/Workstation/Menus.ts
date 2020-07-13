import { MenuCallBack, MenusModule } from '@mstr/workstation-types'

declare var workstation: any

class Menus implements MenusModule {
  addHandler = (menuCommand: string,
    callback: MenuCallBack) => workstation.menus.addHandler(menuCommand, callback)

  removeHandler = (menuCommand: string,
    callback: MenuCallBack) => workstation.menus.removeHandler(menuCommand, callback)

  trigger = (menu: string) => workstation.menus.trigger(menu)
}

const menus = new Menus()
export default menus
