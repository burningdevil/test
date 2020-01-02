import RootApp from '../basePages/RootApp'
const footer = MAC_XPATH_GENERAL.footer

export default class Footer extends RootApp {
  // locator
  async getPathText(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' }
        ]
      },
      mac: { xpath: footer.pathtext.replace(/ReplaceMe/g, name) }
    })
  }

  async getNavigationMode(index) {
    let mode
    if (index === 0) {
      mode = 'Smart Mode'
    } else {
      mode = 'Folder Mode'
    }
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: mode },
          { method: 'ClassName', value: 'TabItem' }
        ]
      },
      mac: { xpath: footer.navigationMode.replace(/ReplaceModeIndex/g, index) }
    })
  }

  // actions

  async selectFolderMode() {
    const elem = await this.getNavigationMode(1)
    return this.moveToAndClick(elem)
  }

  async selectSmartMode() {
    const elem = await this.getNavigationMode(0)
    return this.moveToAndClick(elem)
  }

  // assertions

  async isTextInPathDisplayed(name) {
    try {
      const elem = await this.getPathText(name)
      return elem.isDisplayed()
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
