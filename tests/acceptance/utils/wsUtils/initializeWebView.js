const { registerNewWindow, switchToWindow } = require('./windowHelper')

async function initializeWebView() {
  // for windows switch to Getting Started tab
  if (OSType === 'windows') {
    console.log('Initializing Webview for Workstation Windows...')
    const maxworksation = await workstationApp.elementByAccessibilityId("WindowRestoreButton")
    await maxworksation.click()
    const tabDossier = await workstationApp.elementByName('Dossiers')
    const createDossierButton = await tabDossier.elementByClassName('Button')
    await createDossierButton.click()
    await workstationApp.sleep(1000)
    await registerNewWindow(`webview helper`)
    await switchToWindow(`webview helper`)
    const minimizeBtn = await workstationApp.elementByAccessibilityId('WindowMinimizeButton')
    await minimizeBtn.click()

  } else { // OSType === 'mac'
    // Initialize a CEF webview for Mac (This should be used after CEF feature enabled)
    console.log('Initializing Webview for Workstation Mac...')
    let referenceObject = workstationApp.elementByXPath(MAC_XPATH_GENERAL.smartTab.createNewItem.replace(/ReplaceMe/g, "Create a new dossier"))
    await referenceObject.moveTo()

    await workstationApp.sleep(100)
    await workstationApp.buttonDown()
    await workstationApp.sleep(100)
    await workstationApp.buttonUp()
    await workstationApp.sleep(1000)
    await registerNewWindow(`webview helper`)
    await switchToWindow(`webview helper`)

    referenceObject = workstationApp.elementByXPath(MAC_XPATH_GENERAL.window.minimize)
    await referenceObject.moveTo()
    await workstationApp.sleep(100)
    await workstationApp.buttonDown()
    await workstationApp.sleep(100)
    return workstationApp.buttonUp()
  }

  await workstationApp.sleep(1000)
  return switchToWindow('Workstation Main Window')
}

module.exports = initializeWebView
