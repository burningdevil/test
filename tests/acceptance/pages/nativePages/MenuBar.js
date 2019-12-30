import RootApp from '../basePages/RootApp'
const menuBar = MAC_XPATH_GENERAL.menuBar

export default class MenuBar extends RootApp {
  // locator
  async getOSMenuItem(menu) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: menu },
        ]
      },
      mac: { xpath: menuBar.menuItem.replace(/ReplaceMenuItemName/g, menu) }
    })
  }

  async getOSMenuOption(menu, option) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: menu },
          { method: 'Name', value: option }
        ]
      },
      mac: { xpath: menuBar.menuOption.replace(/ReplaceMenuItemName/g, menu).replace(/ReplaceOption/g, option) }
    })
  }

  // actions
  async clickMenuItem(menu) {
    const elem = await this.getOSMenuItem(menu)
    return elem.click()
  }

  async clickMenuItemOption(menu, option) {
    const elem = await this.getOSMenuOption(menu, option)
    return elem.click()
  }

  // assertions
}
