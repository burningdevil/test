import BasePage from '../basePages/BasePage';

export default class GoverningSettingsPage extends BasePage {

  // element locator
  getAdvancedLink() {
    //wait for the CEF webview to initiat
    this.sleep(2000);
    return this.element(by.xpath(`//a[contains(text(),'Advanced')]`));
  }

  // actions


  // assertions

} 