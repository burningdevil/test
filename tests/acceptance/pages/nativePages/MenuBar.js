import RootApp from './RootApp';
const menuBar = MAC_XPATH['menuBar'];

export default class MenuBar extends RootApp {

  // locator
  async getOSMenuItem(menu) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: menu },
        ]},
      mac: { xpath: menuBar.menuItem.replace(/ReplaceMenuItemName/g, menu) }
    });
  }

  async getOSMenuOption(menu, option) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: menu },
          { method: '', value: option }
        ]},
      mac: { xpath: menuBar.menuOption.replace(/ReplaceMenuItemName/g, menu).replace(/ReplaceOption/g, option) }
    });
  }

  // actions
  async clickMenuItem(menu) {
    let elem = await this.getOSMenuItem(menu);
    return elem.click();
  }

  async clickMenuItemOption(menu, option) {
    let elem = await this.getOSMenuOption(menu, option);
    return elem.click();
  }
  
  // assertions

}