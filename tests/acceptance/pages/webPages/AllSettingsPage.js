import BasePage from '../basePages/BasePage';

export default class GoverningSettingsPage extends BasePage {

  // element locator
  getSettingsTableTitle() {
    return this.element(by.xpath(`//span[contains(text(),'Settings')]`));
  }

  getMessageLifetimeInput() {
    return this.element(by.xpath(`//span[contains(text(),'Message lifetime(days)')]/../../../following-sibling::td//input`));
  }

  // actions
  async inputMessageLifetime(inputValue) {
    await this.getMessageLifetimeInput().clear();
    await this.getMessageLifetimeInput().sendKeys(inputValue);
  }

  // assertions

} 