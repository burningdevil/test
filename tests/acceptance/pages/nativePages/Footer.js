import RootApp from '../basePages/RootApp';
const footer = MAC_XPATH_GENERAL['footer'];

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
      mac: { xpath: footer.navigationMode.replace(/ReplaceMe/g, index)  }
    });
  }

  // actions


  async selectFolderMode() {
    let elem = await this.getNavigationMode(1);
    return this.moveToAndClick(elem)
  }

  async selectSmartMode() {
    let elem = await this.getNavigationMode(0);
    return this.moveToAndClick(elem)
  }

  // assertions

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
