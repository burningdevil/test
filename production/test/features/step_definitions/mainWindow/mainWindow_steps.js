const { Given, When, Then } = require('cucumber');

// ** Environment Related ** //
When('I add a new environment named {envName} with url {envUrl}', async function (envName, envUrl) {
  return addEnv.connectEnv(envName, envUrl);
});

When('I login with {loginMode} mode using name {userName} and password {userPwd}', async function (loginMode, userName, userPwd) {
  return addEnv.loginToEnv(loginMode, userName, userPwd);
});

Then('I select project {projectName}', async function (projectName) {
  return addEnv.chooseProject(projectName);
});

Then('I remove environment {envName}', async function (envName) {
  return addEnv.removeEnv(envName);
});

// ** Navigations in Main Window ** //
Then('I select tab {tabName}', async function (tabName) {
  await smartTab.selectTab(tabName);
  return smartTab.app.sleep(30000);
});

// ** Tab Related ** //
When('I create a new item {string}', async function (itemName) {
  return smartTab.createNewItem(itemName);
});

// ** Search Related ** //
When('I search for {searchString}', async function (searchString) {
  await toolbar.search(searchString);
});

Then('Result Popup should be displayed with {int} items', async function (countOf) {
  await this.expect(mainWindow.isQuickSearchListContainerDisplayed()).become(true);
  await quickSearchPage.awaitRendering();
  return this.expect(await quickSearchPage.resultCount()).to.equal(countOf);
});

When('I click on item {itemName}', async function (itemName) {
  return quickSearchPage.selectItemByName(itemName);
});




