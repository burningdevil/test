import BasePage from '../../basePages/BasePage'

export default class AppThemePage extends BasePage {
  getWebLogoInput() {
    return this.element(by.xpath(`//input[contains(@class, 'logo-modal-url-web')]`))
  }

  getWebFaviconInput() {
    return this.element(by.xpath(`//input[contains(@class, 'logo-modal-url-favicon')]`))
  }
  
  getMobileLogoInput() {
    return this.element(by.xpath(`//input[contains(@class, 'logo-modal-url-mobile')]`))
  }

  getAppThemeColor(color) {
    return this.element(by.xpath(`//input[@class='ant-radio-input' and @value='${color}']`))
  }

  getCustomColorBox(name) {
    return this.element(by.xpath(`//div[contains(@id, 'mstr-color-prop-${name}')]//div[contains(@class, 'color-box')]`))  
  }

  getCustomColorInputBox(name) {
    return this.element(by.xpath(`//div[contains(@id, 'mstr-color-prop-${name}')]//input[contains(@class, 'color-value-input')]`))  
  }

  getColorPickerColor(color) {
    return this.element(by.xpath(`//button[@title='${color}']`))
  }

  getColorPickerOKBtn() {
    return this.element(by.xpath(`//div[contains(@class, 'color-palette-editor-btn')]//span[text()='OK']`))
  }
  
  async inputWebLogoURL(url) {
    await this.getWebLogoInput().click()
    await this.input(url)
    await this.enterClick()
  }

  async inputWebFaviconURL(url) {
    await this.getWebFaviconInput().click()
    await this.input(url)
    await this.enterClick()
  }

  async inputMobileLogoURL(url) {
    await this.getMobileLogoInput().click()
    await this.input(url)
    await this.enterClick()
  }

  async setAppThemeColor(color) {
    await this.getAppThemeColor(color).click()
  }

  async setCustomColorBox(name) {
    await this.getCustomColorBox(name).click()
  }

  async setCustomColorInputBox(name, color) {
    await this.getCustomColorInputBox(name).clear()
    await this.input(color)
    await this.enterClick()
  }

  async pickColorPickerColor(color) {
    await browser.sleep(1000)
    await this.getColorPickerColor(color).click()
    await this.getColorPickerOKBtn().click()
  }
}
