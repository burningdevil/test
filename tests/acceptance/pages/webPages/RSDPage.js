import BasePage from '../basePages/BasePage';

export default class RSDPage extends BasePage {

  // element locator
  getRSDTemplateIcon(rsdTemplate) {
    return this.$$(".mstrVtListTxt").filter(async (elem) => {
      const text = await elem.getText();
      return text === rsdTemplate;
    }).first()
  }

  getDropdownSelection(percentage) {
    return this.$$(".mstrListBlockItemName").filter(async (elem) => {
      const text = await elem.getText();
      return text === percentage;
    }).first()
  }

  getToolBar() {
    return this.element(".mstrListBlockToolbar");
  }

  getDocumentHomeMenuButton() {
    this.wait(this.$("td.mstrListBlockToolbarItemName div").isDisplayed())
    return this.$$("td.mstrListBlockToolbarItemName div").filter(async (elem) => {
      const text = await elem.getText();
      return text === "DOCUMENT HOME";
    }).first()
  }
  
  // actions
  async selectItemByName(name) {
    await this.getQuickSearchListItemByName(name).click();
    return editor.isEditorDisplayed(name);
  }

  async selectHomeMenu() {
    return this.getDocumentHomeMenuButton().click();
  }

  // assertions


}