import RootApp from './RootApp';
const smartTab = MAC_XPATH['smartTab'];

export default class SmartTab extends RootApp {
  //Locators
  async getTab(tabName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: tabName },
        ]},
      mac: { xpath: smartTab.tab.replace('ReplaceMe', tabName) }
    });
  }

  getCreateNewItem(itemName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: `${itemName}s` },
          { method: 'ClassName', value: 'Button' },
        ]},
      mac: { xpath: smartTab.createNewItem.replace('ReplaceMe', itemName) }
    });
  }

  // ** Actions ** //
  async selectTab(tabName) {
    return this.moveToAndClick(await this.getTab(tabName));
  }

  async createNewItem(itemName) {
    await this.moveToAndClick(await this.getCreateNewItem(itemName));
    return this.app.sleep(2000);
  }

}