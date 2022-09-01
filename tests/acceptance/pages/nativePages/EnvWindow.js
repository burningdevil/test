import Window from '../basePages/Window'
import MenuBar from './MenuBar'
import Popup from './Popup'
const envinfo = MAC_XPATH_GENERAL.envinfo
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../utils/wsUtils/windowHelper')

export default class EnvWindow extends Window {
  // constructor
  constructor() {
    super()
  }

  async getCloseWindowButton(envName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: envName },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: envinfo.closewindowbutton.replace(/ReplaceMe/g, envName) }
    })
  }

  async getConfirmCloseWindowButton(envName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: envName },
          { method: 'Name', value: 'No' }
        ]
      },
      mac: { xpath: envinfo.confirmclosewindowbutton.replace(/ReplaceMe/g, envName) }
    })
  }

  async getEnvInfoWindow(envName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: envName }
        ]
      },
      mac: { xpath: envinfo.envinfowindow.replace(/ReplaceMe/g, envName) }
    })
  }


  async clickCloseDialogButton(envName) {
    const envInfoWindow = await this.getEnvInfoWindow(envName);
    await switchToWindow(`env ${envName} info window`)
    await this.moveToAndClick(await this.getCloseWindowButton(envName))
    await this.app.sleep(2000)
    await unregisterWindow(`env ${envName} info window`)
    await switchToWindow('Workstation Main Window')
    return this.app.sleep(1000)
  }

}
