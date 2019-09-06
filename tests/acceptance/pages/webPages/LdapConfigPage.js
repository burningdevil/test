import BasePage from './BasePage'
export default class ComponentWindow extends BasePage {

  // element locators
  getLdapContainer(){
    return this.$('.ldap-feature-container');
  }

  getContentPanelContainer(){
    return this.$('.content-panel-container');
  }

  getSideBar(){
    return this.getLdapContainer().$('.ant-layout-sider-children');
  }

  getSidebarTab(tabName) {
    return this.getSideBar().$$('.side-bar-item-container--side-bar-item').filter(async (elem) => {
        const barName = await elem.getText();
        return barName === tabName;
    }).first();
  }

  getCancelButton() {
    return this.$('.ant-btn.button-group-container--cancel-button.admin-simple-button');
  }


  // action helpers
  async selectSideTab(tabName){
    return this.getSidebarTab(tabName).click();
  }

  async clickCancel(){
    return this.getCancelButton().click();
  }


  //assertion helpers
  async isLdapWindowDisplayed(){
    return this.getLdapContainer().isPresent();
  }
}