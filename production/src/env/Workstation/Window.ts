import { WindowModule, WindowEvent, CommandCallBack, CommandCallBackAsync } from '@mstr/workstation-types'

declare var workstation: any

class Window implements WindowModule {
  getExtraContext(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  
  setCloseInfo = (info: string) => workstation.window.setCloseInfo(info)

  addHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => workstation.window.addHandler(event, callback)

  removeHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => workstation.window.removeHandler(event, callback)

  close = () => workstation.window.close()

  setTitle = (title: string) => workstation.window.setTitle(title)

  getTitle = () => workstation.window.getTitle()

  postMessage = (message: any) => workstation.window.postMessage(message)
}

const window = new Window()
export default window
