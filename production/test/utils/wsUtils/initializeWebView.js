async function initializeWebView() {
  console.log('Initializing Webview...');

  let searchInputBox;

  if (OSType === 'windows') {
    // for windows switch to Getting Started tab
    let tabGetStarted = await workstationApp.elementByName('Getting Started');
    await tabGetStarted.click();
    await workstationApp.sleep(1000);
    let tabEnvironments = await workstationApp.elementByName('Environments');
    await tabEnvironments.click();
    await workstationApp.sleep(1000);
  } else {
    // workstation Mac only has Quick Search as CEF webview for now
    const toolbar = MAC_XPATH['toolbar'];
    let searchInputBox = await workstationApp.elementByXPath(toolbar.searchInputBox);
    await moveToAndClick(searchInputBox);
    await searchInputBox.sendKeys('Initializing web view');
    await workstationApp.sleep(1000);
    await searchInputBox.clear();
    await workstationApp.sleep(2000);
  }
}

async function moveToAndClick(referenceObject) {
  await referenceObject.moveTo();
  await workstationApp.sleep(100);
  await workstationApp.buttonDown();
  await workstationApp.sleep(100);
  await workstationApp.buttonUp();
}

module.exports = initializeWebView;
