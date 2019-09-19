import RootApp from './RootApp';
const quickSearch = MAC_XPATH_GENERAL['quickSearch'];
const wsMainWindow = MAC_XPATH_GENERAL['workstationMainWindow'];
const footer = MAC_XPATH_GENERAL['footer'];


export default class MainWindow extends RootApp {
  // locator
  async getQuickSearchDropdown() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: quickSearch.dropdown }
    });
  }

  async getItemInCurrentView(itemName) {
    const macItemName = itemName.replace(/\s/g, "\n ") + "\n"
    console.log(macItemName);
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' }
        ]
      },
      mac: { xpath: wsMainWindow.itemInCurrentView.replace(/ReplaceMe/g, macItemName) }
    });
  }

  async getPathText(name) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' }
        ]
      },
      mac: { xpath: footer.pathtext.replace(/ReplaceMe/g, name) }
    });
  }

  async getNavigationMode(index) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: wsMainWindow.navigationMode.replace(/ReplaceMe/g, index)  }
    });
  }

  // actions
  async clickOnItem(itemName) {
    let elem = await this.getItemInCurrentView(itemName);
    return this.moveToAndClick(elem)
  }

  async selectFolderMode() {
    let elem = await this.getNavigationMode(1);
    return this.moveToAndClick(elem)
  }

  async selectSmartMode() {
    let elem = await this.getNavigationMode(0);
    return this.moveToAndClick(elem)
  }

  // assertions
  async isQuickSearchDropdownDisplayed() {
    try {
      let elem = await this.getQuickSearchDropdown();
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // assertions
  async isItemDisplayedInCurrentView(itemName) {
    try {
      let elem = await this.getItemInCurrentView(itemName);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async isTextInPathDisplayed(name) {
    try {
      let elem = await this.getPathText(name);
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}