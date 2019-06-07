export default class RootApp {

  constructor() {
    this.app = global.workstationApp;
  }

  // helper methods
  async getNativeElement(obj) {
    if (OSType === 'windows') {
      let elm = this.app;
      obj.windows.locators.forEach(async (locator) => { 
        switch (locator.method) {
          case "XPath":
            return this.app.elementByXPath(locator.value);
          case "Name":
            elm = await elm.elementByName(locator.value);
          case "ClassName":
            elm = await elm.elementByClassName(locator.value);
          default:
            throw Error('please properly define the using method to locate the element');
          }
      })
      return elm;
    } else {
        return this.app.elementByXPath(obj.mac.xpath);
    }
}

  // actions
  async moveToAndClick(referenceObject) {
    await referenceObject.moveTo();
    await this.app.sleep(100);
    await this.app.buttonDown();
    await this.app.sleep(100);
    return this.app.buttonUp();
  }

  async moveToAndSendKey(referenceObject, keysToSend) {
    await referenceObject.moveTo();
    await this.app.sleep(100);
    await referenceObject.sendKeys(keysToSend);
    return this.app.sleep(100);
  }

  async clickElem() {
    await this.app.sleep(100);
    await this.app.buttonDown();
    await this.app.sleep(100);
    return this.app.buttonUp();
  }

  async contextClick() {
    await this.app.sleep(100);
    await this.app.buttonDown(2);
    await this.app.sleep(100);
    return this.app.buttonUp();
  }

  async rightClick(){
    await this.app.sleep(100);
    await this.app.click(2);
    return this.app.sleep(100);
  }

  async switchToWindow(windowHandle) {
    return this.app.window(windowHandle);
  }

  // assertion
  async isElementDisplayedByXPath(xpath) {
    return this.app.elementByXPath(xpath).isDisplayed();
  }

}
