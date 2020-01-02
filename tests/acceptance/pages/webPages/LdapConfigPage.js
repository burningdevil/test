import BasePage from '../basePages/BasePage'
export default class LdapConfigPage extends BasePage {
  // element locators
  getLdapContainer() {
    return this.$('.ldap-feature-container')
  }

  getContentPanelContainer() {
    return this.$('.content-panel-container')
  }

  getSideBar() {
    return this.getLdapContainer().$('.sidebar-container__sidebar')
  }

  getSidebarTab(tabName) {
    return this.getSideBar().$$('.sidebar__sidebar-item').filter(async (elem) => {
      const barName = await elem.getText()
      return barName === tabName
    }).first()
  }

  getCancelButton() {
    return this.$('.ant-btn.button-group-container--cancel-button.admin-simple-button')
  }

  getImportUserWindow() {
    return this.$('.mstr-web-ldap-embedded-modal-content')
  }

  getImportUserOkButton() {
    return this.getImportUserWindow().$('.ant-btn.admin-simple-button.admin-simple-button-primary.ant-btn-primary')
  }

  getConfigureButton() {
    return this.$('.ant-btn.mstr-button.mstr-button__primary-type.mstr-button__regular-size.ant-btn-primary')
  }

  // action helpers
  async selectSideTab(tabName) {
    return this.getSidebarTab(tabName).click()
  }

  async clickCancel() {
    return this.getCancelButton().click()
  }

  async clickImportOkButton() {
    return this.getImportUserOkButton().click()
  }

  async clickConfiureButton() {
    return this.getConfigureButton().click()
  }

  // assertion helpers
  async isLdapWindowDisplayed() {
    return this.getLdapContainer().isPresent()
  }
}
