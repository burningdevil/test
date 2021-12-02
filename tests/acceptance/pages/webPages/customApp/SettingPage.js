import BasePage from '../../basePages/BasePage'
import { OSType } from '../../../utils/envUtils/constants'
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')

export default class SettingPage extends BasePage {
  // element locator
  // General Page
  getMenuTab(menu) {
    // return this.$$('.ant-tabs-tab').all(by.cssContainingText('.ant-tabs-tab-btn', menu)).first()
    return this.element(by.xpath(`//div[@class='ant-tabs-tab-btn' and text()='${menu}']`));
  }

  getNameInpuBox() {
    return this.$('.home-screen-general-name-name').$('.ant-input')
  }

  getDescriptionInpuBox() {
    return this.$('.home-screen-general-description-name').$('.ant-input')
  }

  // currently, platform can be web, desktop
  /*
  getPlatformCheckbox(platform) {
    return this.$$('.ant-checkbox').filter(async (elem) => {
      const filterName = await elem(by.xpath('following-sibling::span')).getText()
      return filterName === platform
    })
  }
  */

  //Home Screen Page
  getHomeScreenOption(mode) {
    return this.$$('.ant-space-item').all(by.cssContainingText('.ant-radio-wrapper', mode)).first()
  }

  getDossierPickbutton() {
    return this.$('.ant-btn.ant-btn-link.home-screen-home-settings-pick')
  }

  getDossierDocumentTab(menu) {
    return this.$$('.ant-menu-title-content').filter(async (elem) => {
      const text = await elem.getText()
      return text === menu
    }).first()
  }

  /*
  getDossierDocumentTable() {
    return this.$('.content-bundle-content-picker-grid-right')
  }
  */


  getDossierListPage() {
    return this.$(".ag-center-cols-container")
  }


  /*
  getDossierDocumentItemByName(name) {
    return this.getDocumentTable().$$('.ag-row').element(by.cssContainingText('.content-bundle-content-picker-grid-right-name-text', name))
  }
  */

  getGridCellInDossierListView(gridCellValue) {
    // return this.$$('.content-bundle-content-picker-grid-right-name-text').filter(async (elem) => {
    //   const text = await elem.getText()
    //   return text === gridCellValue
    // }).first()
    return this.element(by.xpath(`//span[@class='content-bundle-content-picker-grid-right-name-text' and text()='${gridCellValue}']`))
  }

  getSelectButton() {
    // return this.$('.content-bundle-content-picker-btn').element(by.cssContainingText('.ant-btn.ant-btn-primary', 'Select'))
    return this.element(by.xpath(`//div[@class='content-bundle-content-picker-btn']//button[@class='ant-btn ant-btn-primary']`))
  }

  //Preview
  getPreview(client, pageId='components') {
    return this.$$(`#rc-tabs-0-panel-${pageId} .ant-radio-group.ant-radio-group-solid`).all(by.cssContainingText('.ant-radio-button-wrapper', client)).first()
  }

  //Components Page
  getToolbarMode(mode) {
    return this.$$('.home-screen-components-toolbar').all(by.cssContainingText('.ant-checkbox-wrapper', mode)).first()
  }


  getToolbarOptionSwitcher(text) {
    return this.element(by.xpath(`//span[@class='home-screen-components-table-text' and text()='${text}']//ancestor::tr//button`));
  }

  getSaveButton(pageId = 'components') {
    // const elms = Array.from(this.element(by.xpath(`//div[@class='ant-tabs-tabpane-active']//span[text()='Save']`)));
    // return elms.filter((elem) => {
    //   return elem.isDisplayed()
    // })
    return this.element(by.xpath(`//div[@id='rc-tabs-0-panel-${pageId}']//span[text()='Save']`));
  }

  getCancelButton() {
    return this.$('.home-screen-editor-layout-btn').element(by.cssContainingText('.ant-btn', 'Cancel'))
    //return this.$$('.ant-btn').filter(async (elem) => {
      //return elem.isDisplayed()
    //}).first()
  }

  getConfirmCancelButton() {
    return this.$('.ant-btn.ant-btn-primary.confirmation-dialog-action-button')
  }

  //More Setting page
  getAccessMode(mode) {
    // return this.$$('.home-screen-moresetting-box').all(by.cssContainingText('.ant-checkbox-wrapper', mode)).first()
    return this.element(by.xpath(`//input[@id='${mode}']`));
    
  }

  // connectivity, to be added the id
  getInputBoxByNumber(number = '180') {
    return this.element(by.xpath(`//input[@class='ant-input' and @value='${number}']`));
  }
  getLoggingSelectDown() {
    return this.element(by.xpath(`//span[@class='home-screen-moresetting-cfg-advance-input log-dropdown']//button`));
  }
  getSelectOptionByText(text) {
    return this.element(by.xpath(`//span[@class='ant-dropdown-menu-title-content' and text() = '${text}']`));
  }
  getCacheCheckbox(){
    return this.element(by.xpath(`//input[@id='clearCacheOnLogout']`));
  }




  // actions
  // for WebView management
  async switchToNewWebView() {
    const handles = await browser.getAllWindowHandles()
    if (OSType === 'windows') {
      await browser.switchTo().window(handles[handles.length - 1])
    } else {
      await browser.switchTo().window(handles[handles.length - 1])
    }
    console.log('Switch to new WebView: ', await browser.getTitle())
  }

  async clickButtonsByTextOnNewCustomAppPage(text, pageId= 'components') {
    if (text === 'Save') {
      await browser.sleep(2000 * this.ratio)
      await this.wait(this.EC.visibilityOf(this.getSaveButton()), 60000 * this.ratio, 'Save buton was not visible');
      await this.getSaveButton(pageId).click()
      await browser.sleep(2000 * this.ratio)
    } else if (text === 'Cancel') {
      await this.getCancelButton().click()
      await browser.sleep(2000 * this.ratio)
      await this.getConfirmCancelButton().click()
    }
    await browser.sleep(6000 * this.ratio)
    await this.switchToNewWebView()
  }

  async switchMenu(menu) {
    await browser.sleep(3000 * this.ratio)
    await this.getMenuTab(menu).click()
    await browser.sleep(3000 * this.ratio)
  }

  /*
  async choosePlatforms(platform) {
    await this.click({ elem: this.getMenuTab('General') })
    for (const item of platform) {
      await this.click({ elem: this.getPlatformCheckbox(item) })
    }
  }
  */

  async inputName(name) {
    await this.getNameInpuBox().click()
    await this.getNameInpuBox().clear()
    await this.input(name)
  }

  async inputDescription(description) {
    await this.getDescriptionInpuBox().click()
    await this.input(description)
  }

  async chooseHomescreen(mode) {
    await this.getHomeScreenOption(mode).click()
    await browser.sleep(3000 * this.ratio)
  }

  async choosePreview(client, tab) {
    await this.getPreview(client, tab).click()
    await browser.sleep(3000 * this.ratio)
  }


  //async waitForDossierListWindow() {
    //await this.wait(this.EC.visibilityOf(this.getDossierListPage()), 60000, 'Dossier list window was not displayed');
  //}


  async chooseToolbarMode(toolbarmode) {
    await browser.sleep(2000 * this.ratio)
    await this.click({ elem: this.getToolbarMode(toolbarmode) })
    await browser.sleep(2000 * this.ratio)
  }


  async switchDossierDocumentTab(menu) {
    await browser.sleep(1000 * this.ratio)
    await this.getDossierPickbutton().click()
    //await this.waitForDossierListWindow()
    await browser.sleep(5000 * this.ratio)
    await this.getDossierDocumentTab(menu).click()
    await browser.sleep(5000 * this.ratio)
  }

  async pickDossierByName(name) {
    await browser.sleep(5000 * this.ratio)
    // const dossierItem = await this.getGridCellInDossierListView(name)
    // await this.click({ elem: dossierItem })
    await this.wait(this.EC.visibilityOf(this.getGridCellInDossierListView(name)), 60000, 'The target dossier was not displayed')
    await this.getGridCellInDossierListView(name).click()
    await browser.sleep(6000 * this.ratio)
    await this.getSelectButton().click()
    await browser.sleep(8000 * this.ratio)
  }


  async hideToolbarOption(text) {
    await this.getToolbarOptionSwitcher(text).click()
    await browser.sleep(2000 * this.ratio)
  }

  async showToolbarOption(text) {
    await this.getToolbarOptionSwitcher(text).click()
    await browser.sleep(2000 * this.ratio)
  }

  async chooseUserAccess(mode) {
    await browser.sleep(3000 * this.ratio)
    await this.getAccessMode(mode).click()
  }
  async inputMoreSetting(target, val) {

    await this.getInputBoxByNumber(target).click()
    await this.input(val)
  }
  async changeLoggingLevel(level) {
    await browser.sleep(2000 * this.ratio);
    await this.getLoggingSelectDown().click();
    await browser.sleep(2000 * this.ratio);
    await this.getSelectOptionByText(level).click()
  }
  async checkCache() {
    await this.getCacheCheckbox().click();
    await browser.sleep(1000 * this.ratio);
  }

}
