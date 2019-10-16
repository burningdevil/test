const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow} = require('../../utils/wsUtils/windowHelper')

// ** Navigations in Main Window ** //
// this step waits for caching to be completed (for Mac Quick Search)
Then('I first-time select tab {tabName} and wait for cache generation', async function (tabName) {
  return mainWindow.smartTab.selectTabAndWait(tabName);
});

Then('I select tab {tabName}', async function (tabName) {
  await mainWindow.smartTab.selectTab(tabName);
  return mainWindow.app.sleep(500);
});

When('I create a new item {itemName}', async function (itemName) {
  if (OSType === 'windows') {
    await mainWindow.smartTab.createNewItem(itemName);
    await registerNewWindow(`${itemName} Editor`);
    return switchToWindow(`${itemName} Editor`);
  } else {
    return mainWindow.smartTab.createNewItem(itemName);
  }
});

When('I select environment folder {folderName}', async function(folderName){
  await mainWindow.folderTab.selectFolder(folderName);
  return mainWindow.app.sleep(500);
})

When('I select local disk folder', async function(){
  await mainWindow.folderTab.selectLocalDiskFolder();
  return mainWindow.app.sleep(500);
})

When('I double click to expand or collapse {folderName}', async function(folderName){
  return mainWindow.folderTab.expandFolder(folderName);
})

