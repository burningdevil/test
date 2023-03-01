const { When, Then } = require('cucumber')
const { mainWindow } = pageObj

When('I add a new environment named {string} with url {string}', async function (envName, envUrl) {
  return mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
})

When('I login with {string} mode using name {string} and password {string}', async function (loginMode, userName, userPwd) {
  if (userPwd === 'blank') { userPwd = '' }
  return mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
})

Then('I select project {string}', async function (projectName) {
  return mainWindow.mainCanvas.envSection.chooseProject(projectName)
})

When('I click OK to connect after selecting project', async function () {
  return mainWindow.mainCanvas.envSection.clickOkToConnect()
})

Then('I remove environment {string}', async function (envName) {
  if (mainWindow.mainCanvas.envSection.isEnvAdded(envName)) {
    return mainWindow.mainCanvas.envSection.removeEnv(envName)
  } else {
    console.error(`WARNING: No environment present with name ${envName}`)
  }
})

Then('Environment should be removed', async function(envName) {
  return expect(mainWindow.mainCanvas.envSection.isEnvRemoved(envName)).become(true)
})

When('I configure LDAP service on env {string}', async function(envName) {
  return mainWindow.mainCanvas.envSection.configureLdapService(envName)
})

Then('I disconnect environment', async function() {
  return mainWindow.mainCanvas.envSection.disconnectEnv(browser.params.envInfo[0].envName)
})

Then('I connect existing environment {string}', async function(name) {
  return mainWindow.mainCanvas.envSection.connectExistingEnv(name)
})

When('I import LDAP users on env {string}', async function(envName) {
  return mainWindow.mainCanvas.envSection.importLdapUsers(envName)
})

Then('{string} is connected', async function (envName) {
  return expect(mainWindow.mainCanvas.envSection.isEnvAdded(envName)).become(true)
})

Then('I remove all connected environments', async function () {
  return mainWindow.mainCanvas.envSection.removeAllEnv() 
})
