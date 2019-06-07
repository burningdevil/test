import RootApp from './RootApp';
const quickSearch = XPATH['quickSearch'];

export default class MainWindow extends RootApp {
  // locator
  async getQuickSearchListContainer() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]},
      mac: { xpath: quickSearch.listContainer }
    });
  }

  // actions


  // assertions
  async isQuickSearchListContainerDisplayed() {
    try {
      let elem = await this.getQuickSearchListContainer();
      return elem.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}