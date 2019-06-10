import BasePage from './BasePage';

export default class QuickSearchPage extends BasePage {

  // element locator
  getQuickSearchList() {
    return this.$('.QuickSearchListView');
  }

  getQuickSearchListItems() {
    return this.getQuickSearchList().$$('.QuickSearchItem');
  }

  getQuickSearchListItemByIndex(index) {
    return this.getQuickSearchListItems().get(index);
  }

  getQuickSearchListItemByName(name) {
    return this.getQuickSearchListItems().filter(async (elm) => {
      let elmText = await elm.$('.QuickSearchItem-text-name').getText();
      return elmText === name;
    }).first();
  }

  // Browser Utils
  async executeScript(...args) {
    return this.brwsr.executeScript(...args);
  }

  async sleep(duration) {
    return this.brwsr.sleep(duration);
  }

  async wait(...condition) {
    return this.brwsr.wait(...condition);
  }

  // actions
  async awaitRendering() {
    return this.wait(this.EC.presenceOf(this.getQuickSearchList()), 3000, 'Result List is not present');
  }

  async selectItemByName(name) {
    await this.getQuickSearchListItemByName(name).click();
    return this.sleep(10000); // wait for dossier to be executed
  }

  // assertions
  async resultCount() {
    return this.getQuickSearchListItems().count();
  }

}