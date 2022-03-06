import { WindowModule, WindowEvent, CommandCallBack, CommandCallBackAsync } from '@mstr/workstation-types'

class Window implements WindowModule {
  getExtraContext = async () => JSON.stringify(
    {
      id: '',
      name: '',
      settings: {}
    }
  )

  setCloseInfo(info: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  addHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => true

  removeHandler = (event: WindowEvent,
    callback: CommandCallBack | CommandCallBackAsync) => true

  close = async () => {}

  setTitle = async (title: string) => {}

  getTitle = async () => 'New Filter'

  postMessage = async (message: any) => {}
}

const window = new Window()
export default window
