import { MenuCallBack, MenusModule } from '@mstr/workstation-types'

const res = {
  Url: 'http://tec-w-009714.labs.microstrategy.com:8100/MicroStrategyLibrary/',
  ResponseValue: true
}

class Menus implements MenusModule {
  addHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  removeHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  trigger = async (menu: string) => res
}

const menus = new Menus()
export default menus
