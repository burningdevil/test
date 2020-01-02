import Editor from '../basePages/Window'
import Popup from './Popup'
const window = MAC_XPATH_GENERAL.window
const popup = MAC_XPATH_GENERAL.popup

export default class RSDWindow extends Editor {
  // constructor
  constructor() {
    super()
    this.popup = new Popup()
  }

  // Locators

  // ** Actions ** //
  async waitRSDWindow(windowName) {
    return this.nativeWaitFor({
      windows:{
        locators: [
          { method: 'Name', value: windowName },

        ]
      },
      mac: { xpath: window.close }
    })
  }

  async confirmCloseRSDWindow() {
    await this.nativeWaitFor({
      windows:{
        locators: [
          { method: 'Name', value: 'MicroStrategy Workstation' },
          { method: 'Name', value: 'Yes' }
        ]
      },
      mac: { xpath: popup.button.replace(/ReplaceBtnName/g, 'Yes') }
    })
    const confirmBtn = await this.popup.getButton('Yes')
    this.moveToAndClick(confirmBtn)

    return this.sleep(1000)
  }
}
