const {registerNewWindow, switchToWindow} = require('./windowHelper')

async function initializeWebView() {
  console.log('Initializing Webview...');

  if (OSType === 'windows') {
    // for windows switch to Getting Started tab
    let tabDossier = await workstationApp.elementByName('Dossiers');
    let createDossierButton = await tabDossier.elementByClassName('Button');
    await createDossierButton.click();
    await workstationApp.sleep(1000);
    await registerNewWindow(`webview helper`);
    await switchToWindow(`webview helper`);
    let minimizeBtn = await workstationApp.elementByAccessibilityId('WindowMinimizeButton');
    await minimizeBtn.click();
    await workstationApp.sleep(1000);
    await switchToWindow('Workstation Main Window');
  } else {
    // workstation Mac only has Quick Search as CEF webview for now
    const toolbar = MAC_XPATH['toolbar'];
    let searchInputBox = await workstationApp.elementByXPath(toolbar.searchInputBox);
    await moveToAndClick(searchInputBox);
    await searchInputBox.sendKeys('Initializing web view');
    await workstationApp.sleep(500);
    await searchInputBox.clear();
    await searchInputBox.sendKeys('trigger popup again');
    await workstationApp.sleep(500);
    await searchInputBox.clear();
    await workstationApp.sleep(1000);
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
