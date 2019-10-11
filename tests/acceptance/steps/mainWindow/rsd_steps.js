const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow} = require('../../utils/wsUtils/windowHelper')

//native
When('I select {applicationName} and click select', async function (applicationName) {
  if (OSType === 'windows') {
    await mainWindow.mainCanvas.selectApplication(applicationName);
    //wait for the application window to appear
    await mainWindow.sleep(1000);
  } else {
    await mainWindow.mainCanvas.selectApplication(applicationName);
  }
  console.log("before wait")
  // await rsdWindow.waitRSDWindow();
  console.log("after wait")
  //This wait cannot be avoided because even the window is displayed, the inner webview may still not available. 
  await mainWindow.sleep(1000);
  return rsdPage.switchToNewWebView();
});

