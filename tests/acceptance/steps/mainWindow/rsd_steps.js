const { Given, When, Then } = require('cucumber');

//native
When('I select {applicationName} and click select', async function (applicationName) {
  if (OSType === 'windows') {
    await mainWindow.mainCanvas.selectApplication(applicationName);
    await rsdWindow.waitRSDWindow();
    //wait for the webview inside of the application window to appear
    // await mainWindow.sleep(1000);
  } else {
    await mainWindow.mainCanvas.selectApplication(applicationName);
    await rsdWindow.waitRSDWindow();
  }
  //This wait cannot be avoided because even the window is displayed, the inner webview may still not available. 
  await mainWindow.sleep(2000);
  return rsdPage.switchToNewWebView();
});

