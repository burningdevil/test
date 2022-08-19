import Window from '../basePages/Window'
import MenuBar from './MenuBar'
import Popup from './Popup'
const customapp = MAC_XPATH_GENERAL.customapp
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../utils/wsUtils/windowHelper')


// const cefDialog = MAC_XPATH_GENERAL.cefDialog

export default class AppWindow extends Window {
  // constructor
  constructor() {
    super()
  }

  async getCloseWindowButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'New Application' },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: customapp.closewindowbutton }
    })
  }

  async getConfirmCloseWindowButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'New Application' },
          { method: 'Name', value: 'No' }
        ]
      },
      mac: { xpath: customapp.confirmclosewindowbutton }
    })
  }

  async getNewApplicationWindow() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'New Application' }
        ]
      },
      mac: { xpath: customapp.newcustomappwindow }
    })
  }


  async clickCloseDialogButton() {
    const newCustomAppWindow = await this.getNewApplicationWindow();
    await this.moveToAndClick(await this.getCloseWindowButton())
    await this.app.sleep(1000)
    await switchToWindow('New Application Close Confirm')
    await this.moveToAndClick(await this.getConfirmCloseWindowButton())
    await unregisterWindow('New Application Close Confirm')

    return this.app.sleep(1000)
  }



  // locator

  // assertions

}
