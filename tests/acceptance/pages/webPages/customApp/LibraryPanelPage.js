import BasePage from '../../basePages/BasePage'
import { OSType } from '../../../utils/envUtils/constants'
import { protractor } from 'protractor'
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../../utils/wsUtils/windowHelper')

export default class LibraryPanelPage extends BasePage {
  // element locator
  getFirstLevelDirectoryPropertyValue(propertyText) {
    return this.element(by.xpath(`//span[@class='ant-collapse-header-text' and text()='${propertyText}']`))
  }

  getCollabServerSetting() {
    return this.element(by.xpath(`//div[@class='mstr-Admin-ss-title' and text()='Collaboration Server Setting']`))
  }

  getCollabSecuritySetting() {
    return this.element(by.xpath(`//div[@class='mstr-Admin-ss-title mstr-Admin-ss-title-collapsible mstr-Admin-ss-title-collapsed']`))
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

  async collapseFirstLeverlDirectory(propertyText) {
    await this.switchToNewWebView()
    await this.getFirstLevelDirectoryPropertyValue(propertyText).click()
    await browser.sleep(8000 * this.ratio)
  }

  async expandCollabSecuritySetting() {
    const elem = this.getCollabSecuritySetting()
    await this.executeScript('arguments[0].scrollIntoView()', elem)
    //await this.executeScript('document.querySelector(".mstr-Admin-ss-title.mstr-Admin-ss-title-collapsible.mstr-Admin-ss-title-collapsed").scrollIntoView()')
    await this.getCollabSecuritySetting().click()
    await browser.sleep(8000 * this.ratio)
  }

}
