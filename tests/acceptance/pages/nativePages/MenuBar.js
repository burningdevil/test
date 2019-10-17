import RootApp from '../basePages/RootApp';
const menuBar = MAC_XPATH_GENERAL['menuBar'];

export default class MenuBar extends RootApp {

    // locator
    async getOSMenuItem(menu) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: menu },
                ]
            },
            mac: { xpath: menuBar.menuItem.replace(/ReplaceMenuItemName/g, menu) }
        });
    }

    async getOSMenuOption(option, menu) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: '', value: menu },
                    { method: '', value: option }
                ]
            },
            mac: { xpath: menuBar.menuOption.replace(/ReplaceMenuItemName/g, menu).replace(/ReplaceOption/g, option) }
        });
    }

    // actions
    async clickMenuItem(menu) {
        let elem = await this.getOSMenuItem(menu);
        return elem.click();
    }

    async clickMenuItemOption(option, menu) {
        let elem = await this.getOSMenuOption(option, menu);
        return elem.click();
    }

    // assertions

}
