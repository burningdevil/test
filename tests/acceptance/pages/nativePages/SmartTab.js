import RootApp from './RootApp';
const smartTab = MAC_XPATH['smartTab'];

export default class SmartTab extends RootApp {
  //Locators
  async getTab(tabName) {
    let tabHelperStr;
    if (OSType === 'windows') {
      switch(tabName.toLowerCase()) {
        case "cards":
          tabHelperStr = 'Hyper';
          break;
        case "dossiers":
          tabHelperStr = 'Dossiers';
          break;
        case "datasets":
          tabHelperStr = 'Datasets';
          break;
        case "environments":
          tabHelperStr = 'Environments';
          break;
        default:
          throw Error("Error! Please check the element locator");
      }
    }

    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: tabHelperStr },
        ]},
      mac: { xpath: smartTab.tab.replace(/ReplaceMe/g, tabName) }
    });
  }

  getCreateNewItem(itemName) {
    let macBtnHelpStr;
    
    if (OSType === 'mac') {
      switch(itemName.toLowerCase()) {
        case "application":
          macBtnHelpStr = 'Create New Application';
          break;
        case "dossier":
          macBtnHelpStr = 'Create a new dossier';
          break;
        case "dataset":
          macBtnHelpStr = 'Create a new dataset';
          break;
        default:
          throw Error("Error! Please check the MAC AXPath");
      }
    } else {
      switch(itemName.toLowerCase()) {
        case "card":
          macBtnHelpStr = 'Hyper';
          break;
        case "dossier":
          macBtnHelpStr = 'Dossiers';
          break;
        case "dataset":
          macBtnHelpStr = 'Datasets';
          break;
        default:
          throw Error("Error! Please check the element locator");
      }
    }

    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Smart Mode' },
          { method: 'Name', value: macBtnHelpStr },
          { method: 'ClassName', value: 'Button' },
        ]},
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
}