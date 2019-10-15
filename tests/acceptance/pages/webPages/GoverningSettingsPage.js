import BasePage from '../basePages/BasePage';

export default class GoverningSettingsPage extends BasePage {

  // element locator
  getAdvancedLink() {
    //wait for the CEF webview to initiat
    this.sleep(2000);
    return this.$$(".mstr-basetab-advance-title a").filter(async (elem) => {
      const text = await elem.getText();
      return text === "Advanced";
    }).first()
  }

  // actions


  // assertions

} 