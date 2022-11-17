const { registerNewWindow, switchToWindow } = require('./windowHelper')

async function initializeWebView() {
  // for windows switch to Getting Started tab
  if (OSType === 'windows') {
    console.log('Initializing Webview for Workstation Windows...')
    const maxworksation = await workstationApp.elementByAccessibilityId("WindowRestoreButton")
    await maxworksation.click()
    // const tabDossier = await workstationApp.elementByName('Dossiers')
    // const createDossierButton = await tabDossier.elementByClassName('Button')
    // await createDossierButton.click()

    const fileMenuContainer = await workstationApp.elementByClassName('MenuItem')
    const fileMenu = await fileMenuContainer.elementByName('File')
    fileMenu.click()
    await workstationApp.sleep(4000)
    const addDossierMenuContainer = await workstationApp.elementByClassName('Popup')
    const addDossierMenu = await addDossierMenuContainer.elementByName('New Dossier')
    addDossierMenu.click()

    await workstationApp.sleep(1000)
    for(var i=0; i<5; i++){
      console.log("switch to webview helper")
      try{
        await registerNewWindow(`webview helper`)
        await switchToWindow(`webview helper`)
        const connectEnvDialog = await workstationApp.elementByName('Connect to Environment')
        break;
      } catch (e) {
        console.log('Connect to environment dialog is not shown after click new dossier.')
      }
     
      await workstationApp.sleep(1000)
    }
   
    const minimizeBtn = await workstationApp.elementByAccessibilityId('WindowMinimizeButton')
    await minimizeBtn.click()
    console.log("minimize webview helper")

  } else { // OSType === 'mac'
    // Initialize a CEF webview for Mac (This should be used after CEF feature enabled)
    console.log('Initializing Webview for Workstation Mac...')
    // let referenceObject = workstationApp.elementByXPath(MAC_XPATH_GENERAL.smartTab.createNewItem.replace(/ReplaceMe/g, "Create a new dossier"))
    // await referenceObject.moveTo()

    // await workstationApp.sleep(100)
    // await workstationApp.buttonDown()
    // await workstationApp.sleep(100)
    // await workstationApp.buttonUp()
    await workstationApp.sleep(2000)
    await registerNewWindow(`webview helper`)
    await switchToWindow(`webview helper`)

    // referenceObject = workstationApp.elementByXPath(MAC_XPATH_GENERAL.window.minimize)
    // await referenceObject.moveTo()
    // await workstationApp.sleep(100)
    // await workstationApp.buttonDown()
    // await workstationApp.sleep(100)
    // return workstationApp.buttonUp()
  }

  await workstationApp.sleep(1000)
  return switchToWindow('Workstation Main Window')
}

module.exports = initializeWebView
