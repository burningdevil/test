const toolbar = global.XPATH['toolbar'];

async function initializeWebView() {
  console.log('Initializing Webview...');

  let searchInputBox = await workstationApp.elementByXPath(toolbar.searchInputBox);
  await moveToAndClick(searchInputBox);
  await searchInputBox.sendKeys('Initializing web view');
  await workstationApp.sleep(1000);
  await searchInputBox.clear();
  await workstationApp.sleep(2000);
}

async function moveToAndClick(referenceObject) {
  await referenceObject.moveTo();
  await workstationApp.sleep(100);
  await workstationApp.buttonDown();
  await workstationApp.sleep(100);
  await workstationApp.buttonUp();
}

module.exports = initializeWebView;
