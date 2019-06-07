import RootApp from './RootApp';
const smartTab = XPATH['smartTab'];

export default class SmartTab extends RootApp {
  //Locators
  async getTab(tabName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]},
      mac: { xpath: smartTab.tab.replace('ReplaceMe', tabName) }
    });
  }

  getCreateNewItem(itemName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]},
      mac: { xpath: smartTab.createNewItem.replace('ReplaceMe', itemName) }
    });
  }

  // ** Actions ** //
  async selectTab(tabName) {
    return this.moveToAndClick(await this.getTab(tabName));
  }

  async createNewItem(itemName) {
    return this.moveToAndClick(await this.getCreateNewItem(itemName));
  }

}