import RootApp from '../basePages/RootApp';
const smartTab = MAC_XPATH_GENERAL['smartTab'];

export default class SmartTab extends RootApp {
  //Locators
  async getTab(tabName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: tabName },
        ]
      },
      mac: { xpath: smartTab.tab.replace(/ReplaceMe/g, tabName) }
    });
  }

  async getCreateNewItem(itemName) {
    let macBtnHelpStr;

    if (OSType === 'mac') {
      switch (itemName) {
        case "Application":
          macBtnHelpStr = 'Create New Application';
          break;
        case "Dossier":
          macBtnHelpStr = 'Create a new dossier';
          break;
        case "Dataset":
          macBtnHelpStr = 'Create a new dataset';
          break;
        default:
          throw Error("Error! Please check the MAC AXPath");
      }
    }

    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: `${itemName}s` },
          { method: 'ClassName', value: 'Button' },
        ]
      },
      mac: { xpath: smartTab.createNewItem.replace(/ReplaceMe/g, macBtnHelpStr) }
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

  async cacheAllTabs() {
    // first-time cache generation for mac (if needed)
    if (OSType === 'mac') {
      await this.selectTab('My Library');
      await this.app.sleep(4000);
      await this.selectTab('Dossiers');
      await this.app.sleep(4000);
      await this.selectTab('Documents');
      await this.app.sleep(4000);
      await this.selectTab('Cards');
      await this.app.sleep(4000);
      await this.selectTab('Reports');
      await this.app.sleep(4000);
      await this.selectTab('Datasets');
      return this.app.sleep(4000);
    }

  }

}
