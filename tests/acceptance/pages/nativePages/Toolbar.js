import RootApp from './RootApp';
const toolbar = MAC_XPATH['toolbar'];

export default class Toolbar extends RootApp {

  //Locators
  async getRefresh() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.refresh}
    });
  }

  async getIconView() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.iconView}
    });
  }

  async getListView() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.listView}
    });
  }

  async getArrangeBy() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.arrangeBy}
    });
  }

  async getSortBy() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.sortBy}
    });
  }

  async getSelectApplication() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: toolbar.selectApplication}
    });
  }

  async getSearchInputBox() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'AccessibilityId', value: 'SearchTermTextBox' },
        ]},
      mac: { xpath: toolbar.searchInputBox}
    });
  }

  async getClearSearch() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Clear Searchbox' },
        ]},
      mac: { xpath: toolbar.clearSearchInput}
    });
  }

  //Actions
  async refresh() {
      await this.moveToAndClick(await this.getRefresh());
      return this.app.sleep(2000);
  }

  async clickIconView() {
      return this.moveToAndClick(await this.getIconView());
  }

  async clickListView() {
      return this.moveToAndClick(await this.getListView());
  }

  async clickArrangeBy() {
      return this.moveToAndClick(await this.getArrangeBy());
  }

  async clickSortBy() {
      return this.moveToAndClick(await this.getSortBy());
  }

  async clickSelectApplicationIcon() {
      return this.moveToAndClick(await this.getSelectApplication());
  }

  async clickClearSearch() {
      await this.moveToAndClick(await this.getClearSearch());
      return this.app.sleep(500);
  }

  async search(searchString) {
    let searchBox = await this.getSearchInputBox();
    await this.moveToAndClick(searchBox);
    return searchBox.sendKeys(searchString);
  }
} 