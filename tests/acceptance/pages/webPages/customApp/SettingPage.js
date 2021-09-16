import BasePage from '../../basePages/BasePage'
import { OSType } from '../../../utils/envUtils/constants'
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')

export default class SettingPage extends BasePage {
  // element locator
  // General Page
  getMenuTab(menu) {
    return this.$$('.ant-tabs-tab').all(by.cssContainingText('.ant-tabs-tab-btn', menu)).first()
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

  /*
  getDossierListPage() {
    return this.$(".ag-center-cols-container")
  }
  */

  /*
  getDossierDocumentItemByName(name) {
    return this.getDocumentTable().$$('.ag-row').element(by.cssContainingText('.content-bundle-content-picker-grid-right-name-text', name))
  }
  */

  getGridCellInDossierListView(gridCellValue) {
    return this.$$('.content-bundle-content-picker-grid-right-name-text').filter(async (elem) => {
      const text = await elem.getText()
      return text === gridCellValue
    }).first()
  }

  getSelectButton() {
    return this.$('.content-bundle-content-picker-btn').element(by.cssContainingText('.ant-btn.ant-btn-primary', 'Select'))
  }

  //Components Page
  getToolbarMode(mode) {
    return this.$$('.home-screen-components-toolbar').all(by.cssContainingText('.ant-checkbox-wrapper', mode)).first()
  }


  getToolbarOptionSwitcher(text){
    return this.element(by.xpath(`//span[@class='home-screen-components-table-text' and text()='${text}']//ancestor::tr//button`));
  }

  getSaveButton() {
    //return this.$('.ant-btn.ant-btn-primary')
    return this.$('.home-screen-editor-layout-btn').element(by.cssContainingText('.ant-btn.ant-btn-primary', 'Save'))
  }

  getCancelButton() {
    //return this.$('.ant-btn.ant-btn-default')
    return this.$('.home-screen-editor-layout-btn').element(by.cssContainingText('.ant-btn', 'Cancel'))
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

  async clickButtonsByTextOnNewCustomAppPage(text) {
    if (text === 'Save') {
      await this.getSaveButton().click()
    } else if (text === 'Cancel') {
      await this.getCancelButton().click()
    }
    await browser.sleep(4000)
    await this.switchToNewWebView()
  }

  async switchMenu(menu) {
    await this.getMenuTab(menu).click()
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
    await this.input(name)
  }

  async inputDescription(description) {
    await this.getDescriptionInpuBox().click()
    await this.input(description)
  }

  async chooseHomescreen(mode) {
    await this.getHomeScreenOption(mode).click()
    await browser.sleep(3000)
  }

  /*
  async waitForDossierListWindow() {
    await this.wait(this.EC.visibilityOf(this.getDossierListPage()), 60000, 'Dossier list window was not displayed');
  }
  */

  async chooseToolbarMode(toolbarmode) {
    await this.click({ elem: this.getMenuTab('Components') })
    await this.click({ elem: this.getToolbarMode(toolbarmode) })
  }

 
  async switchDossierDocumentTab(menu) {
    await this.getDossierPickbutton().click()
    await this.waitForDossierListWindow()
    await this.getDossierDocumentTab(menu).click()
    await browser.sleep(5000)
  }

  async pickDossierByName(name) {
    await browser.sleep(60000)
    const dossierItem = await this.getGridCellInDossierListView(name)
    await this.click({ elem: dossierItem })
    await browser.sleep(2000)
    await this.getSelectButton().click()
    await browser.sleep(2000)
  }


  async hideToolbarOption(text) {
    await this.getToolbarOptionSwitcher(text).click()
    await browser.sleep(2000)
  }

  async showToolbarOption(text) {
    await this.getToolbarOptionSwitcher(text).click()
    await browser.sleep(2000)
  }
}
