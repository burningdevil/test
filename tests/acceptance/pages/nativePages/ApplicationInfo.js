import { sleep } from '../../utils/generalUtils'
import RootApp from '../basePages/RootApp'
const appInfo = MAC_XPATH_GENERAL.applicationinfo
const wd = require('wd')
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../utils/wsUtils/windowHelper')

export default class ApplicationInfo extends RootApp {
  // ** Locators ** //
  async getTabByName(tabName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'ClassName', value: 'ListBox' },
          { method: 'Name', value: tabName }

        ]
      },
      mac: { xpath: appInfo.smarttab.replace(/ReplaceMe/g, tabName) }
    })
  }

  async getUserOrUserGroupByName(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name },
          { method: 'ClassName', value: 'TextBlock' }
        ]
      },
      mac: { xpath: appInfo.userorusergroup.replace(/ReplaceMe/g, name) }
    })
  }

  async getRemoveUserOrUserGroupButton(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name },
          { method: 'AccessibilityId', value: 'RemoveUserOrUserGroupButton' },
          { method: 'ClassName', value: 'Image' }
        ]
      },
      mac: { xpath: appInfo.removeuserorusergroup }
    })
  }

  async getAddUserOrUserGroupButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: '' },
          { method: 'ClassName', value: '' }
        ]
      },
      mac: { xpath: appInfo.adduserorusergroup }
    })
  }

  async getSaveButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'OK' },
          { method: 'ClassName', value: 'TextBlock' }
        ]
      },
      mac: { xpath: appInfo.savebutton }
    })
  }

  async getCancelButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'ClassName', value: 'Button' },
          { method: 'Name', value: 'Cancel' }
        ]
      },
      mac: { xpath: appInfo.cancelbutton }
    })
  }

  async getCloseWindowButton(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: name },
          { method: 'AccessibilityId', value: 'WindowCloseButton' }
        ]
      },
      mac: { xpath: appInfo.closewindowbutton.replace(/ReplaceMe/g, name) }
    })

  }

  // actions

  async selectTab(tabName) {
    await this.moveToAndClick(await this.getTabByName(tabName))
    return this.app.sleep(1000)
  }

  async selectUserOrGroupByName(name) {
    await this.moveToAndClick(await this.getUserOrUserGroupByName(name))
    return this.app.sleep(1000)
  }

  async removeUserOrUserGroup(name) {
    await this.moveToAndClick(await this.getRemoveUserOrUserGroupButton(name))
    return this.app.sleep(1000)
  }

  async addUserOrUserGroup() {
    await this.moveToAndClick(await this.getAddUserOrUserGroupButton())
    return this.app.sleep(1000)
  }

  async saveChanges() {
    await this.moveToAndClick(await this.getSaveButton())
    await unregisterWindow('Application info')
    await switchToWindow('Workstation Main Window')
    return this.app.sleep(1000)
  }

  async clickCancelButton() {
    await this.moveToAndClick(await this.getCancelButton())
    await unregisterWindow('Application info')
    await switchToWindow('Workstation Main Window')
    return this.app.sleep(1000)
  }

  async closeApplicationInfoWindow(name) {
    await switchToWindow('Application info')
    await this.moveToAndClick(await this.getCloseWindowButton(name))
    await unregisterWindow('Application info')
    return this.app.sleep(1000)
  }

  // assertions
  async isUserOrUserGroupDisplayed(name) {
    try {
      const elem = await this.getUserOrUserGroupByName(name)
      return elem.isDisplayed()
    } catch (err) {
      console.log(err)
      return false
    }
  }

}
