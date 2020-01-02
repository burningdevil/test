import BasePage from '../basePages/BasePage'

export default class HyperPage extends BasePage {
  // element locator
  getToolbar() {
    return this.$('.mstr-card-toolbar')
  }

  getClearCard() {
    return this.getToolbar().$('.right')
  }

  getClearCardDisabled() {
    return this.getToolbar().$('.right.disabled')
  }

  // actions
  async clickToClearCard() {
    await this.brwsr.wait(this.EC.presenceOf(this.getClearCard()), 5000, 'Loading card takes too long')
    await this.getClearCard().click()
    return this.brwsr.wait(this.EC.presenceOf(this.getClearCardDisabled()), 2000, 'clear card takes too long')
  }

  // assertions
}
