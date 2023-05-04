
import BasePage from '../../basePages/BasePage'
import { OSType } from '../../../utils/envUtils/constants'
import { imageCompareConfig, wsNativeWindows } from '../../../config/constants'
import { spectreImageComparison } from '../../../utils/spectre-protractor'
const { join } = require('path');
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

  getAuthModesInApplicationDetailsGridByAppName(name) {
    return this.element(by.xpath(`//span[@class='home-screen-main-application-name-text' and text() = '${name}']//ancestor::div[@role='row']//div[@class='home-screen-main-auth-mode']//span`))
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
    return this.getSettingsPanel().$$('.mstr-filter-item-row-label').element(by.cssContainingText('.mstr-filter-item-row-text', setting))
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

  getCreateTimeCells() {
    return this.element(by.xpath(`//div[@role='gridcell' and @col-id='dateCreated']`))
  }

  getUpdateTimeCells() {
    return this.element(by.xpath(`//div[@role='gridcell' and @col-id='dateModified']`))
  }

  getApplicationListGrid() {
    return this.$('.ag-root')
  }

  getColumnOptionByNameInColumnSelector(option) {
    return this.element(by.xpath(`//span[@class='ag-column-select-column-label' and text()='${option}']`))
  }

  getColumnOptionToggleButtonByName(option) {
    return this.element(by.xpath(`//span[@class='ag-column-select-column-label' and text()='${option}']//ancestor::div[contains(@class,'ag-column-select-column')]//input`))
  }

  getGridSideButtonByName(option) {
    return this.element(by.xpath(`//div[contains(@class,'ag-side-button')]//span[text()='${option}']`))
  }




  // actions
  // for WebView management
  // async switchToNewWebView() {
  //   const handles = await browser.getAllWindowHandles()
  //   if (OSType === 'windows') {
  //     await browser.switchTo().window(handles[handles.length - 1])
  //   } else {
  //     await browser.switchTo().window(handles[handles.length - 1])
  //   }
  //   console.log('Switch to new WebView: ', await browser.getTitle())
  // }

  async switchToNewApplicationWindow() {
    await browser.sleep(1000 * this.ratio)
    await registerNewWindow(wsNativeWindows.newCustomAppWindow)
    await switchToWindow(wsNativeWindows.newCustomAppWindow)
    await this.switchToCustomAppEditorDialog()
  }

  async switchToEditApplicationWindow() {
    await browser.sleep(1000 * this.ratio)
    await registerNewWindow(wsNativeWindows.editCustomAppWindow)
    await switchToWindow(wsNativeWindows.editCustomAppWindow)
    await this.switchToCustomAppEditorDialog()
  }

  async switchToCustomAppWindow() {
    //await browser.sleep(1000 * this.ratio)
    await this.switchToHomeScreenMain()
  }

  async switchToApplicationInfoWindow() {
    await browser.sleep(10000 * this.ratio)
    await registerNewWindow(wsNativeWindows.customAppInfo)
    await switchToWindow(wsNativeWindows.customAppInfo)
  }

  async waitForCustomAppMainWindow() {
    await this.wait(this.EC.visibilityOf(this.getCustomAppHomePage()), 600000 * this.ratio, 'Custom app main window was not displayed');
  }

  async waitForContentMenu(text) {
    await this.wait(this.EC.visibilityOf(this.element(by.xpath(`//div[@class='item-title-wrapper' and text()='${text}']`))), 60000 * this.ratio, 'Waiting for delete button in context menu int timeout.')
  }

  async createNewCustomApp() {
    await this.switchToCustomAppWindow()
    await this.waitForCustomAppMainWindow();
    await this.getAddnewButton().click()
    await this.switchToNewApplicationWindow()
  }

  async deleteCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    await this.wait(this.EC.visibilityOf(this.getGridCellInCustomAppListView(name)), 60000 * this.ratio, `Waiting for custom app '${name}' timeout, it still doesn't show in main grid after 30s!`);
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Delete')
    await this.getContentMenuInCustomAppListView('Delete').click()
    await browser.sleep(500 * this.ratio)
    await this.getConfirmDeleteButton().click()
    await browser.sleep(1000 * this.ratio)
    await this.wait(this.EC.stalenessOf(this.element(by.xpath(`//span[@class='home-screen-main-application-name-text' and text()='${name}']`))), 60000 * this.ratio, `Custom app ${name} was still displayed after deletion`)
  }

  async duplicateCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    await this.waitForWebElementToBeVisiable(this.getGridCellInCustomAppListView(name))
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Duplicate')
    await this.getContentMenuInCustomAppListView('Duplicate').click()
    await this.switchToEditApplicationWindow()
  }

  async editCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow()
    await this.waitForWebElementToBeVisiable(this.getGridCellInCustomAppListView(name))
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Edit')
    await this.getContentMenuInCustomAppListView('Edit').click()
    await this.switchToEditApplicationWindow()
  }

  async getinfoCustomAppFromCustomAppListPageByName(name) {
    await this.waitForCustomAppMainWindow();
    const appItem = await this.getGridCellInCustomAppListView(name)
    await this.rightClick({ elem: appItem })
    await this.waitForContentMenu('Properties')
    await this.getContentMenuInCustomAppListView('Properties').click()
    await this.switchToApplicationInfoWindow()
  }

  async sortColumn(columnname) {
    // await this.waitForCustomAppMainWindow()
    await browser.sleep(3000 * this.ratio)
    const columnItem = await this.getColumnCell(columnname)
    await this.click({ elem: columnItem })
  }

  async toggleColumnInCustomAppGrid(options, status) {
    const opts = options.split(",")
    const isColumnSelectorShown = await this.getColumnOptionByNameInColumnSelector('Description').isPresent()
    if (!isColumnSelectorShown) {
      await this.getGridSideButtonByName('Columns').click()
      await this.waitForWebElementToBeVisiable(this.getColumnOptionByNameInColumnSelector('Description'))
    }
    for (const option of opts) {
      const isColumnShow = await this.getColumnOptionToggleButtonByName(option).isSelected()
      if ((status === 'show') !== isColumnShow) {
        await this.getColumnOptionToggleButtonByName(option).click()
        await browser.sleep(3000 * this.ratio)
      }
    }
    await this.getGridSideButtonByName('Columns').click()
    await this.waitForWebElementToDisappear(this.getColumnOptionByNameInColumnSelector('Description'))
  }

  // assertions
  async takeScreenshotOnElement(webElement, fileName) {
    await browser.sleep(1000 * this.ratio)
    let elementLocator
    switch (webElement) {
      case imageCompareConfig.appDetailGrid:
        elementLocator = await this.getApplicationListGrid()
        await this.waitForWebElementToBeVisiable(elementLocator)
        await spectreImageComparison(fileName, { tolerance: imageCompareConfig.tolerance })
        break;
    }
  }

  async takeScreenshotOnPage(fileName) {
    await browser.sleep(1000 * this.ratio)
    await spectreImageComparison(fileName, { tolerance: imageCompareConfig.tolerance })
  }



}
