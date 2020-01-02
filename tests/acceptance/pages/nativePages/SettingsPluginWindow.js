import Editor from './Editor'
const pluginTab = MAC_XPATH_GENERAL.pluginTab

export default class SettingsPluginWindow extends Editor {
  // locator
  async getTab(tabName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: tabName },
        ]
      },
      mac: { xpath: pluginTab.tab.replace(/ReplaceMe/g, tabName) }
    })
  }

  async getButton(buttonName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' },
        ]
      },
      mac: { xpath: MAC_XPATH_GENERAL.settings.button.replace(/ReplaceMe/g, buttonName) }
    })
  }

  async getConfirmErrorMessageButton() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' },
        ]
      },
      mac: { xpath: MAC_XPATH_GENERAL.settings.confirmErrorMessageButton }
    })
  }

  // actions
  async selectTab (tabName) {
    return this.moveToAndClick(await this.getTab(tabName))
  }

  async clickButton(buttonName) {
    return this.moveToAndClick(await this.getButton(buttonName))
  }

  async confirmErrorMessage() {
    return this.moveToAndClick(await this.getConfirmErrorMessageButton())
  }
  // assertions
}
