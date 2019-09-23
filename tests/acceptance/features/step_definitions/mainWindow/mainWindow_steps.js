const { Given, When, Then } = require('cucumber');

// ** Navigations in Main Window ** //
// this step waits for caching to be completed (for Mac Quick Search)
Then('I first-time select tab {tabName} and wait for cache generation', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(30000);
});

Then('I select tab {tabName}', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(500);
});

When('I create a new item {string}', async function (itemName) {
  if (OSType === 'windows') {
    await smartTab.createNewItem(itemName);
    await registerNewWindow(`${itemName} Editor`);
    return switchToWindow(`${itemName} Editor`);
  } else {
    return smartTab.createNewItem(itemName);
  }
});

// ** Footer path Related** //
Then('{tabName} smart tab is selected', async function (tabName) {
  return expect(mainWindow.isTextInPathDisplayed(tabName)).become(true);
});


//Toolbar related
When('I select view {viewName}', async function (viewName) {
  return toolbar.switchViewTo(viewName);
});

// ** Environment Related ** //
When('I add a new environment named {envName} with url {envUrl}', async function (envName, envUrl) {
  return envConnection.connectEnv(envName, envUrl);
});

When('I login with {loginMode} mode using name {userName} and password {userPwd}', async function (loginMode, userName, userPwd) {
  return envConnection.loginToEnv(loginMode, userName, userPwd);
});

Then('I select project {projectName}', async function (projectName) {
  return envConnection.chooseProject(projectName);
});

Then('I click OK to connect after selecting project(s)', async function () {
  // await envConnection.app.sleep(500);
  return envConnection.clickOkToConnect();
});

Then('I remove environment {envName}', async function (envName) {
  if (envConnection.isEnvAdded('envName')) {
    return envConnection.removeEnv(envName);
  } else {
    console.error(`WARNING: No environment present with name ${envName}`);
  }
});

Then('{envName} is connected', async function (envName) {
  return expect(envConnection.isEnvAdded(envName)).become(true);
});

When('I select folderMode on navigation bar', async function(){
  await mainWindow.selectFolderMode();
  return mainWindow.app.sleep(2000);
})

When('I select smartMode on navigation bar', async function(){
  await mainWindow.selectSmartMode();
  return mainWindow.app.sleep(2000);
})

When('I select environment folder {folderName}', async function(folderName){
  await folderTab.selectFolder(folderName);
  return mainWindow.app.sleep(500);
})

When('I select local disk folder', async function(){
  await folderTab.selectLocalDiskFolder();
  return mainWindow.app.sleep(500);
})

When('I double click to expand or collapse {folderName}', async function(folderName){
  return folderTab.expandFolder(folderName);
})

When('I refresh workstation cache', async function(){
  return toolbar.refresh();
})