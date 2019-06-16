// you can separate this step file to several more if needed

const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow} = require('../../../Utils/wsUtils/windowHelper')

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
  return envConnection.clickOkToConnect();
});

Then('I remove environment {envName}', async function (envName) {
  return envConnection.removeEnv(envName);
});

// ** Navigations in Main Window ** //
Then('I select tab {tabName}', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(500);
});

// ** Navigations in Main Window ** //
// this step waits for caching to be completed
Then('I first-time select tab {tabName} and wait for cache generation', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(30000);
});

// ** Tab Related ** //
When('I create a new item {string}', async function (itemName) {
  if (OSType === 'windows') {
    await smartTab.createNewItem(itemName);
    await registerNewWindow(`${itemName} Editor`);
    return switchToWindow(`${itemName} Editor`);
  } else {
    return smartTab.createNewItem(itemName);
  }
});

// ** Search Related ** //
When('I search for {searchString}', async function (searchString) {
  return toolbar.search(searchString);
});

Then('I clear search', async function () {
  return toolbar.clickClearSearch();
});

Then('Result Popup should be displayed with {int} items', async function (countOf) {
  await expect(mainWindow.isQuickSearchListContainerDisplayed()).become(true);
  await quickSearchPage.awaitRendering();
  return expect(await quickSearchPage.resultCount()).to.equal(countOf);
});

When('I click on item {itemName}', async function (itemName) {
  return quickSearchPage.selectItemByName(itemName);
});




