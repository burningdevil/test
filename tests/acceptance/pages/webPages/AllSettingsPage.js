import BasePage from '../basePages/BasePage'

export default class GoverningSettingsPage extends BasePage {
  // element locator
  getSettingsTableTitle() {
    return this.$$('.ant-table-thead div').filter(async (elem) => {
      const text = await elem.getText()
      return text === 'Settings'
    }).first()
  }

  getMessageLifetimeInput() {
    // todo: change this to css selector
    return this.element(by.xpath(`//span[contains(text(),'Message lifetime(days)')]/../../../following-sibling::td//input`))
  }

  // actions
  async inputMessageLifetime(inputValue) {
    await this.getMessageLifetimeInput().clear()
    return this.getMessageLifetimeInput().sendKeys(inputValue)
  }

  // assertions
}
