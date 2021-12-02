
import BasePage from '../../basePages/BasePage'
import { OSType } from '../../../utils/envUtils/constants'
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')

export default class ApplicationPage extends BasePage {
  // element locator
  getAddnewButton() {
    return this.$('.icon-pnl_add-new')
  }

  /*
  getApplicationTable() {
    return this.$('.mstr-window-table-body')
  }
  */

  getCustomAppHomePage() {
    // return this.$(".home-screen-main-new-application-container")
    return this.element(by.xpath(`//div[@class='home-screen-main-new-application-container']`))
  }

  /*
  getApplicationItemByName(name) {
    return this.getApplicationTable().$$('.mstr-window-table-row').all(by.cssContainingText('.home-screen-main-application-name-text', name)).first()
  }
  */

  getGridCellInCustomAppListView(gridCellValue) {
    // const elm = this.$$('.home-screen-main-application-name-text').filter(async (elem) => {
    //   const text = await elem.getText()
    //   return text === gridCellValue
    // });
    // return elm.first()
    return this.element(by.xpath(`//span[@class='home-screen-main-application-name-text' and text() = '${gridCellValue}']`))
  }

  /*
  getColumnHeader() {
    return this.$('ag-header-row').$$('.ag-header-cell').first()
  }
  */

  getColumnCell(columnname) {
    // return this.$$('.ag-header-cell-text').filter(async (elem) => {
    //   const text = await elem.getText()
    //   return text === columnname
    // }).first()
    return this.element(by.xpath(`//span[@class='ag-header-cell-text' and text()='${columnname}']`))
  }


  // return: none, ascending, descending
  /*
  getColumnSortStatus(column) {
    return this.getColumnHeader(column).getAttribute('aria-sort')
  }
  */

  getShareButton(name) {
    return this.getGridCellInCustomAppListView(name).$('.ant-dropdown-trigger.icon-tb_share_n')
  }

  getCopyLinkButton() {
    return this.$('.home-screen-main-item-copy')
  }

  getDownloadJsonFileButton() {
    return this.$('.home-screen-main-item-json')
  }

  getContentMenuInCustomAppListView(menuItem) {
    return this.element(by.xpath(`//div[@class='item-title-wrapper' and text()='${menuItem}']`))
    // return this.$$('.item-title-wrapper').filter(async (elem) => {
    //   const text = await elem.getText()
    //   return text === menuItem
    // }).first()
  }


  getGearButton() {
    return this.$('.ag-icon.ag-icon-columns')
  }

  getGearOption(option) {
    return this.$$('.ag-column-select-column').filter(async (elem) => {
      const text = await elem.getText()
      return text === option
    }).first()
  }

  getSettingsPanel() {
    return this.$('.mstr-rc-react-window-grid-column-configuration-panel-wrapper')
  }

  getSettingSection(setting) {
    return this.getSettingsPanel().$$('.mstr-filter-item-row-label').elemennt(by.cssContainingText('.mstr-filter-item-row-text', setting))
  }

  getSettingsCheckedStatus(setting) {
    return this.getSettingSection(setting).getAttribute('aria-checked')
  }

  getSaveButton() {
    return this.$('.ant-btn.ant-btn-primary')
  }

  getCancelButton() {
    return this.$('.ant-btn.ant-btn-default')
  }

  getConfirmDeleteButton() {
    return this.$('.confirmation-dialog-action-button')
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

  async switchToNewApplicationWindow() {
    await browser.sleep(1000 * this.ratio)
    // await registerNewWindow('New Application')
    // await switchToWindow('New Application')
    await this.switchToNewWebView()
  }

  async switchToEditApplicationWindow() {
    await browser.sleep(1000 * this.ratio)
    // await registerNewWindow('Edit Application')
    // await switchToWindow('Edit Application')
    await this.switchToNewWebView()
  }

  async switchToCustomAppWindow() {
    await browser.sleep(1000 * this.ratio)
    await this.switchToNewWebView()
  }

  async waitForCustomAppMainWindow() {
    await this.wait(this.EC.visibilityOf(this.getCustomAppHomePage()), 600000, 'Custom app main window was not displayed');
  }

  async waitForContentMenu(text){
    await this.wait(this.EC.visibilityOf(this.element(by.xpath(`//div[@class='item-title-wrapper' and text()='${text}']`))), 60000, 'Waiting for delete button in context menu int timeout.')
  }

  async createNewCustomApp() {
    await this.switchToCustomAppWindow()
    await this.waitForCustomAppMainWindow();
    await this.getAddnewButton().click()
    await this.switchToNewApplicationWindow()
  }

  async deleteCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    await this.wait(this.EC.visibilityOf(this.getGridCellInCustomAppListView(name)), 60000, `Waiting for custom app '${name}' timeout, it still doesn't show in main grid after 30s!`);
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Delete')
    await this.getContentMenuInCustomAppListView('Delete').click()
    await browser.sleep(500 * this.ratio)
    await this.getConfirmDeleteButton().click()
    await browser.sleep(1000 * this.ratio)
    await this.wait(this.EC.stalenessOf(this.element(by.xpath(`//span[@class='home-screen-main-application-name-text' and text()='${name}']`))), 60000, `Custom app ${name} was still displayed after deletion`)
  }

  async duplicateCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Duplicate')
    await this.getContentMenuInCustomAppListView('Duplicate').click()
    await this.switchToEditApplicationWindow()
  }

  async editCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Edit')
    await this.getContentMenuInCustomAppListView('Edit').click()
    await this.switchToEditApplicationWindow()
  }

  async sortColumn(columnname) {
    // await this.waitForCustomAppMainWindow()
    await browser.sleep(3000 * this.ratio)
    const columnItem = await this.getColumnCell(columnname)
    await this.click({ elem: columnItem })
  }

  // assertions
  async takeScreenshotOnElement(webElement, screenshot) {
    await this.switchToCustomAppWindow()
    await browser.actions().mouseMove({ x: 0, y: 10000 }).perform()
    let elementLocator
    switch (webElement) {
      case 'detailGrid':
        await this.waitForCustomAppMainWindow()
        elementLocator = this.$('.ag-root')
        break;
    }
    expect(await browser.imageComparison.checkElement(elementLocator, screenshot)).to.below(0.02);
  }

  async takeScreenshotOnPage(screenshot) {
    await browser.sleep(1000 * this.ratio)
    // Ensure the mouse stay the same location
    await browser
      .actions()
      .mouseMove({ x: 0, y: 10000 })
      .perform()
    expect(await browser.imageComparison.checkScreen(screenshot)).to.below(0.02);
  }



}
