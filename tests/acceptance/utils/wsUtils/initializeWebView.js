const {registerNewWindow, switchToWindow} = require('./windowHelper')

async function initializeWebView() {
  console.log('Initializing Webview for Workstation Windows...');
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
  return switchToWindow('Workstation Main Window');
}

module.exports = initializeWebView;
