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

  async getCloseWindowButton(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: customapp.closewindowbutton.replace(/ReplaceMe/g, name) }
    })
  }

  async getConfirmCloseWindowButton(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name },
          { method: 'Name', value: 'No' }
        ]
      },
      mac: { xpath: customapp.confirmclosewindowbutton.replace(/ReplaceMe/g, name) }
    })
  }

  async getApplicationEditorWindow(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name }
        ]
      },
      mac: { xpath: customapp.newcustomappwindow.replace(/ReplaceMe/g, name) }
    })
  }


  async clickCloseDialogButton(name) {
    const customAppEditorWindow = await this.getApplicationEditorWindow(name);
    await this.moveToAndClick(await this.getCloseWindowButton(name))
    await this.app.sleep(1000)
    await switchToWindow(`${name} Close Confirm`)
    await this.moveToAndClick(await this.getConfirmCloseWindowButton(name))
    await unregisterWindow(`${name} Close Confirm`)
    return this.app.sleep(1000)
  }



  // locator

  // assertions

}
