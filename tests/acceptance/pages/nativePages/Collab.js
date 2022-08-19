import { MAC_XPATH_GENERAL } from '../../utils/envUtils/constants'
import { sleep } from '../../utils/generalUtils'
import RootApp from '../basePages/RootApp'
const mainCanvas = MAC_XPATH_GENERAL.mainCanvas
const wd = require('wd')
const { mainWindow } = pageObj

export default class Collab extends RootApp {
  // ** Locators ** //

  async getExistingEnv(environmentName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Available Environments' },
          { method: 'Name', value: `${environmentName}\nRestEnvironment` }
        ]
      },
      mac: { xpath: MAC_XPATH[MAC_VIEWMODE].mainCanvas.env.existingEnv.replace(/ReplaceEnvName/g, environmentName) }
    })
  }

  async getEnvPropertyOption() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Properties' }
        ]
      },
      mac: { xpath: MAC_XPATH[MAC_VIEWMODE].mainCanvas.contextOption.replace(/ReplaceOption/g, 'Get Info') }
    })
  }

  async getLibraryTab() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Library' }
        ]
      },
      mac: { xpath: MAC_XPATH_GENERAL.pluginTab.tab.replace(/ReplaceMe/g, 'Library') }
    })
  }



  // ** Actions ** //
  async enterEnvPropertyPanel(name) {
    const existingEnv = await this.getExistingEnv(name)
    await this.moveToAndClick(existingEnv)
    await this.rightClick()
    await this.moveToAndClick(await this.getEnvPropertyOption())
  }

  async enterLibraryTabOfPropertyPanel() {
    await this.moveToAndClick(await this.getLibraryTab())
    await this.sleep(10000)
  }
}
