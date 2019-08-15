import RootApp from './RootApp';
const toolbar = MAC_XPATH_GENERAL['toolbar'];

export default class Toolbar extends RootApp {

  //Locators
  async getRefresh() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.refresh }
    });
  }

  async getIconView() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.iconViewButton }
    });
  }

  async getListView() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.listViewButton }
    });
  }

  async getArrangeBy() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.arrangeBy }
    });
  }

  async getSortBy() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.sortBy }
    });
  }

  async getSelectApplication() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: '', value: '' },
          { method: '', value: '' }
        ]
      },
      mac: { xpath: toolbar.selectApplication }
    });
  }

  async getSearchInputBox() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'AccessibilityId', value: 'SearchTermTextBox' },
        ]},
      mac: { xpath: toolbar.searchInputBox}
    });
  }

  async getClearSearch() {
    return this.getNativeElement({
      windows: {
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

  async clickSearchBox() {
    let searchBox = await this.getSearchInputBox();
    return this.moveToAndClick(searchBox);
  }

  async search(searchString) {
    let searchBox = await this.getSearchInputBox();
    await this.moveToAndClick(searchBox);
    return searchBox.sendKeys(searchString);
  }

  async hitEnter() {
    let searchBox = await this.getSearchInputBox();
    await this.moveToAndClick(searchBox);
    await searchBox.sendKeys(protractor.Key.ENTER);
    return this.app.sleep(1000);
  }

} 