const { Given, When, Then } = require('cucumber');

// ** Footer path Related** //
Then('{tabName} smart tab is selected', async function (tabName) {
    return expect(mainWindow.footer.isTextInPathDisplayed(tabName)).become(true);
  });

When('I select folderMode on navigation bar', async function(){
    if (OSType === 'windows') {
      await mainWindow.maximizeWindow('MicroStrategy Workstation - Env...(Developer Mode)');
    }
    await mainWindow.footer.selectFolderMode();
    return mainWindow.app.sleep(2000);
  })

  When('I select smartMode on navigation bar', async function(){
    await mainWindow.footer.selectSmartMode();
    return mainWindow.app.sleep(2000);
  })


