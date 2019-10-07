/**
 * Class representing the base of all other native window page objects
 */
import {nativeWaitForElementByName, nativeWaitForElementByClassName, nativeWaitForElementByAccessibilityId, nativeWaitForElementByXPath} from '../../utils/wsUtils/nativeFluentWait'

export default class RootApp {

  constructor() {
    this.app = workstationApp;
  }

  // helper methods
  // native element locator
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

  // native wait for
  async nativeWaitFor(obj, timeout, pullFreq) {
    console.log(obj.mac)
    if (!timeout) {
      timeout = 60000
    }
    if (!pullFreq) {
      pullFreq = 200
    }
    if (OSType === 'windows') {
      let elm = await this.app;
      for(let index=0; index<obj.windows.locators.length; index++) {
        let locator = obj.windows.locators[index];
        switch (locator.method) {
          case "Name":
            await nativeWaitForElementByName(elm, locator.value, timeout, pullFreq)
            elm = await elm.elementByName(locator.value);
            break;
          case "ClassName":
            await nativeWaitForElementByClassName(elm, locator.value, timeout, pullFreq)
            elm = await elm.elementByClassName(locator.value)
            break
          case "AccessibilityId":
            await nativeWaitForElementByAccessibilityId(elm, locator.value, timeout, pullFreq)
            elm = await elm.elementByAccessibilityId(locator.value);
            break
          default:
            throw Error('please properly define the using method use dynamic wait');
          }
      }
    } else {
        return nativeWaitForElementByXPath(this.app, obj.mac.xpath, timeout, pullFreq);
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
      return MAC_VIEWMODE = 'iconView'
    } else if (viewName.toLowerCase() === 'listview') {
      await this.moveToAndClick(await this.getListView());
      //change xpath to list view
      return MAC_VIEWMODE = 'listView'
    }
  }


  // assertion
  async isElementDisplayedByXPath(xpath) {
    return this.app.elementByXPath(xpath).isDisplayed();
  }

}
