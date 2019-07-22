let wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

let Asserter = wd.Asserter;

export default class RootApp {

  constructor() {
    this.app = global.workstationApp;
    // this.asserters = wd.asserters;

    // this.customIsDisplayed = new Asserter(
    //   function (el){
    //     return el.isDisplayed().should.eventually.be.ok.catch(tagChaiAssertionError);
    //   }
    // );
  }

  //wait for element by xpath
  async waitForElementByXPath1(xpath, timeout, pollFreq, cb) {

    // console.log(this.asserters);
    // console.log(this.customIsDisplayed);


    // try{
    //   await this.app.waitForElementByXPath(xpath,this.customIsDisplayed, 10000, 500, ()=>{console.log("call back")});
    // } catch (err) {

    //   console.log(err);

    //   console.log(this.app.toString());

    //   console.log(this.app.waitForElementByXPath.toString());

    // }

    console.log("dynamic waiting....", xpath);

    let checkingResult = false;

    let sleep = (ms) => {
      let start = new Date().getTime()
      let expire = start + ms;
      while (new Date().getTime() < expire) { }
      return;
    }

    while (checkingResult === false) {
      try{
        console.log(await this.app.elementByXPath(xpath).isDisplayed());
        if (await this.app.elementByXPath(xpath).isDisplayed()) {
          checkingResult = true;
        }
      } catch (err) {
        console.log(err);
      }
      sleep(500);
    }
  }



  

  

  // //wait with assert
  // async waitFor(assert) {
  //   return this.app.waitFor(assert , 2000);
  // }

  // //without assert
  // async waitForElementByCss (cssSelector, timeout) {
  //   return this.app.waitForElementByCss(cssSelector, timeout);
  // }

  // //with assert
  // async waitForElementByCss (cssSelector, assert, timeout) {
  //   return this.app.waitForElementByCss(cssSelector,assert, timeout);
  // }

  // //wait until css selected element is displayed
  // async waitForElementIsDisplayedByCss(cssSelector, timeout) {
  //   return this.app.waitForElementByCss(cssSelector, this.asserters.isDisplayed , timeout);
  // }

  // async waitForElementByXPath(xpath, timeout) {
  //   return this.app.waitForElementByXPath(xpath, timeout);
  // }


  // helper methods
  async getNativeElement(obj) {
    if (OSType === 'windows') {
      let elm = await this.app; 
      for(let index=0; index<obj.windows.locators.length; index++) {
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
    // to press mouse right button
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
