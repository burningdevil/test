export default class RootApp {
  constructor() {
    this.app = workstationApp
  }

  // helper methods
  // native element locator
  async getNativeElement(obj) {
    if (OSType === 'windows') {
      let elm = await this.app
      for (let index = 0; index < obj.windows.locators.length; index++) {
        const locator = obj.windows.locators[index]
        switch (locator.method) {
            case 'Name':
              elm = await elm.elementByName(locator.value)
              break
            case 'ClassName':
              elm = await elm.elementByClassName(locator.value)
              break
            case 'AccessibilityId':
              elm = await elm.elementByAccessibilityId(locator.value)
              break
            default:
              throw Error('please properly define the using method to locate the element')
        }
      }
      return elm
    } else {
      return this.app.elementByXPath(obj.mac.xpath)
    }
  }

  async nativeWaitFor(obj, timeout = 6000, errMsg = 'Dynamic waiting for element failed', pollFreq = 500) {
    try {
      // remove Implicit Wait Timeout
      await this.app.setImplicitWaitTimeout(0)

      const endTime = Date.now() + timeout
      let elm
      while (Date.now() < endTime) {
        try {
          if (OSType === 'windows') {
            // For Windows workstation, sometimes elements will be ramaining after close
            elm = await this.getNativeElement(obj)
            if (!await elm.isDisplayed()) { continue }
          } else {
            // for mac
            elm = await this.getNativeElement(obj)
          }
          // set Implicit Wait Timeout back
          return elm
        } catch (err) {
          if (!err.message.includes('NoSuchElement')) {
            errMsg = err
            break
          }
        }
        await this.sleep(pollFreq)
      }
    } finally {
      await this.app.setImplicitWaitTimeout(10000)
    }
    throw Error(errMsg)
  }

  async nativeWaitForDisappear(obj, timeout = 6000, errMsg = 'Dynamic waiting for element disappear failed', pollFreq = 500) {
    try {
      await this.app.setImplicitWaitTimeout(0)
      const endTime = Date.now() + timeout

      while (Date.now() < endTime) {
        try {
          if (OSType === 'windows') {
            // For Windows workstation, sometimes elements will be ramaining after close
            const elm = await this.getNativeElement(obj)
            if (!await elm.isDisplayed()) {
              return true
            }
          } else {
          // for mac
            await this.getNativeElement(obj)
          }
        } catch (err) {
          // check whether the error message is expected
          if (err.message.includes('NoSuchElement')) {
            return true
          } else {
            errMsg = err
            break
          }
        }
        await this.sleep(pollFreq)
      }
    } finally {
      await this.app.setImplicitWaitTimeout(10000)
    }
    throw Error(errMsg)
  }

  async sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
  }

  // actions
  async moveToAndClick(referenceObject) {
    // console.log(referenceObject);
    await referenceObject.moveTo()
    await this.app.sleep(100)
    await this.app.buttonDown()
    await this.app.sleep(100)
    return this.app.buttonUp()
  }

  async moveToAndClickAtPosition(referenceObject) {
    await referenceObject.moveTo(5, 5)
    await this.app.sleep(100)
    await this.app.buttonDown()
    await this.app.sleep(100)
    return this.app.buttonUp()
  }

  async moveToAndDoubleClick(referenceObject) {
    await referenceObject.moveTo()
    await this.app.sleep(100)
    return referenceObject.doubleClick()
  }

  async moveToAndSendKey(referenceObject, keysToSend) {
    await referenceObject.moveTo()
    await this.app.sleep(100)
    await referenceObject.sendKeys(keysToSend)
    return this.app.sleep(100)
  }

  async clickElem() {
    await this.app.sleep(100)
    await this.app.buttonDown()
    await this.app.sleep(100)
    return this.app.buttonUp()
  }

  async rightClick() {
    await this.app.sleep(100)
    await this.app.click(2)
    return this.app.sleep(100)
  }

  async switchToWindow(windowHandle) {
    return this.app.window(windowHandle)
  }

  async switchViewTo(viewName) {
    if (viewName.toLowerCase() === 'iconview') {
      // console.log('Im in ICONVIEW');
      await this.moveToAndClick(await this.getIconView())
      // change xpath to icon view
      MAC_VIEWMODE = 'iconView'
    } else if (viewName.toLowerCase() === 'listview') {
      await this.moveToAndClick(await this.getListView())
      // change xpath to list view
      MAC_VIEWMODE = 'listView'
    }
  }
}
