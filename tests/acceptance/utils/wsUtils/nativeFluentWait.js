
async function sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

async function nativeFluentWaitFor(driver, method, value, timeout, pollFreq) {
    let findElement;
    switch(method) {
      case "XPath" : findElement = driver.elementByXPath
        break;
      case "Name" : findElement = driver.elementByName
        break;
      case "ClassName" : findElement = driver.elementByClassName
        break;
      case "AccessibilityId" : findElement = driver.elementByAccessibilityId
        break;
    }
    console.log(`dynamic waiting ${value} with ${method}`);


    let endTime = Date.now() + timeout;
    let checkingResult = false;

    while (checkingResult === false && Date.now() < endTime) {
      try{
        if (await findElement.apply(driver, [value]).isDisplayed()) {
          checkingResult = true;
          console.log(`found ${value} with ${method}`)
          return true
        }
      } catch (err) {
        console.log(`the expectation of ${value} with ${method} is not fulfilled, continue waiting...`);
      }
      sleep(pollFreq);
    }

    console.log(`App waited for the element for ${timeout/1000} seconds, but could not find the element`);
    return false
  }


  export async function nativeWaitForElementByXPath(driver, xpath, timeout, pollFreq) {

    return nativeFluentWaitFor(driver, "XPath", xpath, timeout, pollFreq);

  }

  export async function nativeWaitForElementByName(driver, name, timeout, pollFreq) {

    return nativeFluentWaitFor(driver, "Name", name, timeout, pollFreq);

  }

  export async function nativeWaitForElementByClassName(driver, className, timeout, pollFreq) {

    return nativeFluentWaitFor(driver, "ClassName", className, timeout, pollFreq);

  }

  export async function nativeWaitForElementByAccessibilityId(driver, accessibilityId, timeout, pollFreq) {

    return nativeFluentWaitFor(driver, "AccessibilityId", accessibilityId, timeout, pollFreq);

  }


