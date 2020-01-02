const { registerNewWindow, switchToWindow } = require('./windowHelper')

async function initializeWebView() {
  console.log('Initializing Webview for Workstation Windows...')
  // for windows switch to Getting Started tab
  const tabDossier = await workstationApp.elementByName('Dossiers')
  const createDossierButton = await tabDossier.elementByClassName('Button')
  await createDossierButton.click()
  await workstationApp.sleep(1000)
  await registerNewWindow(`webview helper`)
  await switchToWindow(`webview helper`)
  const minimizeBtn = await workstationApp.elementByAccessibilityId('WindowMinimizeButton')
  await minimizeBtn.click()
  await workstationApp.sleep(1000)
  return switchToWindow('Workstation Main Window')
}

module.exports = initializeWebView
