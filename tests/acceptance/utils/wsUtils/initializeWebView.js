const { registerNewWindow, switchToWindow } = require('./windowHelper')

async function initializeWebView() {
  // for windows there might be a auto pop up env configuration window for new installation
  try {
    const cancelButton = await workstationApp.elementByName('Connection').elementByName('Cancel')
    if(cancelButton.isDisplayed()) {
      cancelButton.click()
    }
    console.log('Canceling extra environment configuration')
  } catch (e) {
    console.log(e)
  }
  console.log('Initializing Webview for Workstation Windows...')
  // for windows switch to Getting Started tab
  const tabDossier = await workstationApp.elementByName('Dossiers')
  const createDossierButton = await tabDossier.elementByClassName('Button')
  console.log('Create new dossier...')
  await createDossierButton.click()
  await workstationApp.sleep(1000)
  await registerNewWindow(`webview helper`)
  console.log('Switch to dossier window...')
  await switchToWindow(`webview helper`)
  const minimizeBtn = await workstationApp.elementByAccessibilityId('WindowMinimizeButton')
  console.log('Minimize dossier window...')
  await minimizeBtn.click()
  await workstationApp.sleep(1000)
  console.log('Switch back to main window...')
  return switchToWindow('Workstation Main Window')
}

module.exports = initializeWebView
