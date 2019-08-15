export default class RootApp {

  constructor() {
    this.app = global.workstationApp;
  }

  async waitFor1(method, value, timeout, pollFreq) {
   
    let findElement;
    switch(method) {
      case "XPath" : findElement = this.app.elementByXPath
        break;
      case "Name" : findElement = this.app.elementByName
        break;
      case "ClassName" : findElement = this.app.elementByClassName
        break;
      case "AccessibilityId" : findElement = this.app.AccessibilityId
        break;
    }

    console.log(`dynamic waiting ${value} with ${method}`);

    let endTime = Date.now() + timeout;

    let checkingResult = false;

    let sleep = (ms) => {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }

    while (checkingResult === false && Date.now() < endTime) {
      try{
        if (await findElement.apply(this.app, [value]).isDisplayed()) {
          checkingResult = true;
          console.log(`found ${value} with ${method}`)
          return Promise.resolve(`element is found: ${value} with ${method}`)
        }
      } catch (err) {
        console.log(`the expectation of ${value} with ${method} is not fulfilled, continue waiting...`);
      }
      sleep(pollFreq);
    }

    return Promise.reject(new Error(`App waited for the element for ${timeout/1000} seconds, but could not find the element`));
  }

  async waitForElementByXPath1(xpath, timeout, pollFreq) {

    await this.waitFor1("XPath", xpath, timeout, pollFreq);

  }

  async waitForElementByName1(name, timeout, pollFreq) {

    await this.waitFor1("Name", name, timeout, pollFreq);

  }

  async waitForElementByClassName1(className, timeout, pollFreq) {

    await this.waitFor1("ClassName", className, timeout, pollFreq);

  }

  async waitForElementByAccessibilityId1(accessibilityId, timeout, pollFreq) {

    await this.waitFor1("AccessibilityId", accessibilityId, timeout, pollFreq);

  }

  async waitNativeElement(obj) {
    if (OSType === 'windows') { 
      for(let index=0; index<obj.windows.locators.length; index++) {
        let locator = obj.windows.locators[index];
        switch (locator.method) {
          case "Name":
            return this.waitForElementByName1(locator.value, 60000, 200);
          case "ClassName":
            return this.waitForElementByClassName1(locator.value, 60000, 200);
          case "AccessibilityId":
            return this.waitForElementByAccessibilityId1(locator.value, 60000, 200);
          default:
            throw Error('please properly define the using method use dynamic wait');
          }
      }
    } else {
        return this.waitForElementByXPath1(obj.mac.xpath, 60000, 200);
    }
  }

  // helper methods
  async getNativeElement(obj) {
    if (OSType === 'windows') {
      let elm = await this.app;
      for (let index = 0; index < obj.windows.locators.length; index++) {
        let locator = obj.windows.locators[index];
        switch (locator.method) {
          case "Name":
            elm = await elm.elementByName(locator.value);
            break;
          case "ClassName":
            elm = await elm.elementByClassName(locator.value);
            break;
          case "AccessibilityId":
            elm = await elm.elementByAccessibilityId(locator.value);
            break;
          default:
            throw Error('please properly define the using method to locate the element');
        }
      }
      return elm;
    } else {
      return this.app.elementByXPath(obj.mac.xpath);
    }
  }

  // actions
  async moveToAndClick(referenceObject) {
    //console.log(referenceObject);
    await referenceObject.moveTo();
    await this.app.sleep(100);
    await this.app.buttonDown();
    await this.app.sleep(100);
    return this.app.buttonUp();
  }

  async moveToAndClickAtPosition(referenceObject) {
    await referenceObject.moveTo(5, 5);
    await this.app.sleep(100);
    await this.app.buttonDown();
    await this.app.sleep(100);
    return this.app.buttonUp();
  }

  async moveToAndDoubleClick(referenceObject) {
    await referenceObject.moveTo();
    await this.app.sleep(100);
    return referenceObject.doubleClick();
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

  async rightClick() {
    await this.app.sleep(100);
    await this.app.click(2);
    return this.app.sleep(100);
  }

  async switchToWindow(windowHandle) {
    return this.app.window(windowHandle);
  }

  async switchViewTo(viewName) {
    if (viewName.toLowerCase() === 'iconview') {
      // console.log('Im in ICONVIEW');
      await this.moveToAndClick(await this.getIconView());
      //change xpath to icon view
      MAC_XPATH_VIEWMODE = MAC_XPATH['iconView'];
    } else if (viewName.toLowerCase() === 'listview') {
      // console.log('Im in LISTVIEW');
      await this.moveToAndClick(await this.getListView());
      //change xpath to list view
      MAC_XPATH_VIEWMODE = MAC_XPATH['listView'];
      // console.log(MAC_XPATH_VIEWMODE);
    }
    return MAC_XPATH_VIEWMODE;
  }


  // assertion
  async isElementDisplayedByXPath(xpath) {
    return this.app.elementByXPath(xpath).isDisplayed();
  }

}
