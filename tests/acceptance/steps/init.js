const { Given, When } = require('cucumber')
const { Return } = require('wd/lib/special-keys')
const { mainWindow } = pageObj
const { registerNewWindow, switchToWindow} = require('../utils/wsUtils/windowHelper')

/**
 * 1. Remove 'test' environment if it is existed
 * 2. Add 'test' environment with configured information
 */
Given('configure workstation engine test environment', async function() {
  const { envName, envUrl, loginMode, userName, userPwd, projects } = browser.params.envInfo[0]

  var viewflag = true
  // try{
  //   await mainWindow.smartTab.getTab("Datasets");
  // }catch(err){
  //   console.log('currently it is desktop view')
  //   viewflag = true
  // }

  if (viewflag){
    await mainWindow.smartTab.selectTab('Environments')
  }

  try {
    if(OSType === 'windows' || MAC_VIEWMODE === 'iconView')
      await mainWindow.mainCanvas.envSection.removeAllEnv()
    else
    {
      await mainWindow.toolbar.switchToIconView()
      MAC_VIEWMODE = 'iconView'
      await mainWindow.mainCanvas.envSection.removeAllEnv()
      await mainWindow.toolbar.switchToListView()
      MAC_VIEWMODE = 'listView'
    }
  } catch (err) {
   console.log('[INFO] [Remove ENV] Remove all env with error.')
  }

  await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
  await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
  console.log('[INFO] [Add Env] With mstr user')

  await browser.sleep(5000)

  if (viewflag){
    await registerNewWindow('Workstation Main Window2')
    await switchToWindow('Workstation Main Window2')
  }

  //comment out the choose project since all rhe project will be auto choosed now.
  for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
     await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
   }
  await mainWindow.mainCanvas.envSection.clickOkToConnect()
  await workstationApp.sleep(2000)
  await browser.sleep(5000)
})
