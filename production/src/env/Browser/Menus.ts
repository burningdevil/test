import { ContextMenuResponse, ContextMenuSettings, ExecuteContextMenuSettings, MenuCallBack, MenusModule } from '@mstr/workstation-types'
import { menuRes } from './constants'

class Menus implements MenusModule {
  getContextMenu(settings: ContextMenuSettings): Promise<ContextMenuResponse> {
    throw new Error('Method not implemented.')
  }
  executeContextMenu(settings: ExecuteContextMenuSettings): Promise<void> {
    throw new Error('Method not implemented.')
  }
  addHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  removeHandler = (menuCommand: string,
    callback: MenuCallBack) => true

  trigger = async (menu: string) => menuRes
}

const menus = new Menus()
export default menus
