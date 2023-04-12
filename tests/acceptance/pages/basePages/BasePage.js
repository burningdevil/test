import { browser } from "protractor"
import { wsWebViews, wsConfig } from '../../config/constants'

export default class BasePage {
  constructor(browserInstance) {
    this.brwsr = browserInstance || browser
    this.$ = this.brwsr.$
    this.$$ = this.brwsr.$$
    this.element = this.brwsr.element
    this.EC = this.brwsr.ExpectedConditions
    this.ratio = 0.3;
  }

  // Browser Utils
  async executeScript(...args) {
    return this.brwsr.executeScript(...args)
  }

  async sleep(duration) {
    return this.brwsr.sleep(duration)
  }

  async wait(...condition) {
    return this.brwsr.wait(...condition)
  }

  // for WebView management
  async switchToNewWebView(tabName) {
    for (let j = 0; j < wsConfig.webViewQueryTimeout; j++) {
      const handles = await browser.getAllWindowHandles()
      for (let i = handles.length - 1; i >= 0; i--) {
        await browser.switchTo().window(handles[i])
        // const title = await browser.getTitle()
        // if (title === 'App') {
        //   console.log('Switch to new WebView: ', await browser.getTitle(), await browser.getCurrentUrl())
        //   break;
        // }
        //console.log(`current WebView:`, await browser.getTitle(), await browser.getCurrentUrl())
        const currentUrl = await browser.getCurrentUrl()
        // custom app home and editor can use endsWith(), library home admin has lots of parameters passed in
        // use includes() to support both
        if (currentUrl !== undefined && currentUrl.includes(tabName)) {
          console.log(`Switch to new WebView: ${tabName}`, await browser.getTitle(), await browser.getCurrentUrl())
          return;
        }
      }
      await browser.sleep(1000)
      console.log(`#${j} Try to switch to webview ${tabName}`)
    }

  }

  async waitForWebViewWindowDisappear(url) {
    let flag = false
    try {
      for (let j = 0; j < wsConfig.webViewQueryTimeout; j++) {
        const handles = await browser.getAllWindowHandles()
        for (let i = handles.length - 1; i >= 0; i--) {
          await browser.switchTo().window(handles[i])
          const currentUrl = await browser.getCurrentUrl()
          if (currentUrl && currentUrl.includes(url)) {
            flag = true
            break
          }
        }
        if (!flag) break
        await browser.sleep(1000)
      }
    } catch (e) {
      await browser.sleep(500)
    }

  }

  async switchToHomeScreenMain() {
    await this.switchToNewWebView(wsWebViews.customAppHomeScreen)
  }

  async switchToCustomAppEditorDialog() {
    await this.switchToNewWebView(wsWebViews.customAppEditor)
  }

  async switchToLibraryAdminDialog() {
    await this.switchToNewWebView(wsWebViews.libraryAdmin)
  }

  async switchToAppearanceEditorDialog() {
    await this.switchToNewWebView(wsWebViews.appearanceEditor)
  }

  async switchToContentGroupEditorDialog() {
    await this.switchToNewWebView(wsWebViews.contentGroupEditor)
  }

  async switchToDefaultWebView() {
    const handles = await browser.getAllWindowHandles()
    await browser.switchTo().window(handles[0])
    console.log('Switch back to the default webview: ', await browser.getTitle())
  }

  // Keyboard inputs
  async click({ elem, offset = { x: 0, y: 0 } }) {
    await this.brwsr.actions().mouseMove(elem).perform()
    await this.brwsr.actions().mouseMove(offset).perform()
    return this.brwsr.actions().click().perform()
  }

  async doubleClick({ elem, offset = { x: 0, y: 0 } }) {
    await this.brwsr.actions().mouseMove(elem).perform()
    await this.brwsr.actions().mouseMove(offset).perform()
    return this.brwsr.actions().doubleClick().perform()
  }

  async input(keyword) {
    return this.brwsr.actions().sendKeys(keyword).perform()
  }

  async dragAndDrop({ fromElement, toElement }) {
    await this.brwsr.actions().mouseMove(fromElement).perform()
    await this.brwsr.actions().mouseDown(fromElement).perform()
    await this.brwsr.actions().mouseMove(toElement).perform()
    return this.brwsr.actions().mouseUp().perform()
  }

  async hover({ elem, offset = { x: 0, y: 0 } }) {
    await this.brwsr.actions().mouseMove(elem).perform()
    return this.brwsr.actions().mouseMove(offset).perform()
  }

  async rightClick({ elem, offset = { x: 0, y: 0 } }) {
    await this.brwsr.actions().mouseMove(elem).perform()
    await this.brwsr.actions().mouseMove(offset).perform()
    return this.brwsr.actions().click(protractor.Button.RIGHT).perform()
  }

  async enterClick() {
    return this.brwsr.actions().sendKeys(protractor.Key.ENTER).perform()
  }

  async waitForWebElementToBeVisiable(object) {
    await this.wait(this.EC.visibilityOf(object), wsConfig.waitForWebElementTimeout * this.ratio, `Web element was still not displayed after ${wsConfig.waitForWebElementTimeout * this.ratio / 1000}s!`);
  }

  async waitForWebElementToDisappear(object) {
    await this.wait(this.EC.invisibilityOf(object), wsConfig.waitForWebElementTimeout * this.ratio, `Web element was still displayed after ${wsConfig.waitForWebElementTimeout * this.ratio / 1000}s!`);
  }

  async hideElementByScript(elem) {
    await this.executeScript('arguments[0].setAttribute(\'style\',\'visibility:hidden\')', elem)
  }

  async showElementByScript(elem) {
    await this.executeScript('arguments[0].removeAttribute(\'style\')', elem)
  }

  async getInputValue(elem) {
    return browser.driver.executeScript('return arguments[0].value', elem.getWebElement())
  }

}
