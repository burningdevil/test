import BasePage from '../basePages/BasePage';

export default class RSDPage extends BasePage {

  // element locator
  getRSDTemplateIcon(rsdTemplate) {
    return this.element(by.xpath(`//div[contains(text(),'${rsdTemplate}')]`));
  }

  getDropdownSelection(percentage) {
    return this.element(by.xpath(`//div[contains(text(), '${percentage}')]`));
  }

  getToolBar() {
    return this.element(".mstrListBlockToolbar");
  }

  getDocumentHomeMenuButton() {
    return this.element(by.xpath(`//div[contains(text(),"Document Home")]`));
  }
  
  // actions
  async selectItemByName(name) {
    await this.getQuickSearchListItemByName(name).click();

    await editor.waitNativeElement({
      windows:{ 
        locators: [
          { method: '', value: '' },
          { method: '', value: '' } 
        ]},
      mac: { xpath: MAC_XPATH.general['editor'].close.replace(/ReplaceMe/g, name)}
    });
  }

  async selectHomeMenu() {
    return this.getDocumentHomeMenuButton().click();
  }

  // assertions


}