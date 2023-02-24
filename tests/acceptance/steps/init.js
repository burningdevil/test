const { Given, When } = require('cucumber')
const { Return } = require('wd/lib/special-keys')
const { mainWindow, appWindow } = pageObj
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../utils/wsUtils/windowHelper')

/**
 * 1. Remove 'test' environment if it is existed
 * 2. Add 'test' environment with configured information
 */
Given('configure workstation engine test environment', async function () {
  const { envName, envUrl, loginMode, userName, userPwd, projects } = browser.params.envInfo[0]
  await switchToWindow('Workstation Main Window')
  await mainWindow.smartTab.scrollOnSmartTab('up')
  await mainWindow.smartTab.selectTab('Environments')

  try {
    if (OSType === 'mac') {
      //await mainWindow.mainCanvas.envSection.disconnectEnv(envName)
      await mainWindow.mainCanvas.envSection.removeEnv(envName)
    } else {
      await mainWindow.mainCanvas.envSection.removeAllEnv()
    }

  } catch (err) {
    console.log('[INFO] [Remove User] Target env already removed.')
  }

  await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
  await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
  console.log('[INFO] [Add Env] With mstr user')

  await browser.sleep(5000)

  //comment out the choose project since all rhe project will be auto choosed now.
  for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
    await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
  }
  await mainWindow.mainCanvas.envSection.clickOkToConnect()

  await workstationApp.sleep(2000)
  await browser.sleep(5000)

  if (OSType === 'mac') {
    console.log('[INFO] Click to collapse ANALYSIS tab.')
    await mainWindow.smartTab.selectTab('ANALYSIS')
    await workstationApp.sleep(1000)
    try {
      const projectsTab = await mainWindow.smartTab.getTab('Projects')
      console.log('[INFO] Click to collapse ANALYSIS tab again.')
      await mainWindow.smartTab.selectTab('ANALYSIS')
    } catch (e) {
      console.log('[INFO] ANALYSIS tab collapsed.')
    }

  } else {
    await mainWindow.smartTab.scrollOnSmartTab('down')
    await mainWindow.app.sleep(500)
    await mainWindow.smartTab.scrollOnSmartTab('down')
    await mainWindow.app.sleep(500)
  }

})

/**
 * 1. Remove 'test' environment if it is existed
 * 2. Add 'test' environment with configured information
 * 3. Add extra 'env-connect' environment with test2 login
 */
Given('configure workstation engine test environment for environment connection testing', async function () {
  const { envName, envUrl, loginMode, userName, userPwd, projects } = browser.params.envInfo[0]
  const envConnectionEnvName = 'z-env-connection'
  const envConnectionEnvUrl = 'http://10.23.33.70:6010/MicroStrategyLibrary/'
  const envConnectionLoginMode = 'Standard'
  const envConnectionUserName = 'env-conn-test'
  const envConnectionPassword = ''
  await switchToWindow('Workstation Main Window')
  await mainWindow.smartTab.scrollOnSmartTab('up')
  await mainWindow.smartTab.selectTab('Environments')

  try {
    if (OSType === 'mac') {
      //await mainWindow.mainCanvas.envSection.disconnectEnv(envName)
      await mainWindow.mainCanvas.envSection.removeEnv(envName)
    } else {
      await mainWindow.mainCanvas.envSection.removeAllEnv()
    }
  } catch (err) {
    console.log('[INFO] [Remove User] Target env already removed.')
  }

  await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
  await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
  console.log('[INFO] [Add Env] With mstr user')

  await browser.sleep(5000)

  for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
    await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
  }
  await mainWindow.mainCanvas.envSection.clickOkToConnect()

  await workstationApp.sleep(2000)
  await browser.sleep(5000)

  try {
    if (OSType === 'mac') {
      //await mainWindow.mainCanvas.envSection.disconnectEnv(envName)
      await mainWindow.mainCanvas.envSection.removeEnv(envConnectionEnvName)
    }
  } catch (err) {
    console.log('[INFO] [Remove User] Target env already removed.')
  }

  await mainWindow.mainCanvas.envSection.connectEnv(envConnectionEnvName, envConnectionEnvUrl)
  await mainWindow.mainCanvas.envSection.loginToEnv(envConnectionLoginMode, envConnectionUserName, envConnectionPassword)
  console.log('[INFO] [Add Env] env-connection env with env-conn-test user')

  await workstationApp.sleep(2000)
  await browser.sleep(5000)

  if (OSType === 'mac') {
    console.log('[INFO] Click to collapse ANALYSIS tab.')
    await mainWindow.smartTab.selectTab('ANALYSIS')
    await workstationApp.sleep(1000)
    try {
      const projectsTab = await mainWindow.smartTab.getTab('Projects')
      console.log('[INFO] Click to collapse ANALYSIS tab again.')
      await mainWindow.smartTab.selectTab('ANALYSIS')
    } catch (e) {
      console.log('[INFO] ANALYSIS tab collapsed.')
    }
  } else {
    await mainWindow.smartTab.scrollOnSmartTab('down')
    await mainWindow.app.sleep(500)
    await mainWindow.smartTab.scrollOnSmartTab('down')
    await mainWindow.app.sleep(500)
  }
})

Given('close application dialog if necessary', async function () {
  try {
    await switchToWindow('New Application')
    await appWindow.clickCloseDialogButton()
    await unregisterWindow('New Application')
    console.log('[INFO] New application window is open, close it.')
  } catch (e) {
    console.log('[INFO] New application window is already closed.')
  }
})
