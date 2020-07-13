import { WindowModule, WindowEvent, CommandCallBack, CommandCallBackAsync } from '@mstr/workstation-types'

class Window implements WindowModule {
  addHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => true

  removeHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => true

  close = async () => {}

  setTitle = async (title: string) => {}

  getTitle = async () => 'New Filter'

  postMessage = async (message: object) => {}
}

const window = new Window()
export default window
