const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow, unregisterWindow} = require('../../utils/wsUtils/windowHelper')

Then('The {windowName} RSD window should be present', async function (windowName) {
    if (OSType === 'windows') {
      await registerNewWindow(`Document Editor`);
      await switchToWindow(`Document Editor`);
    }
    await rsdWindow.waitRSDWindow(windowName);
    //This wait cannot be avoided because even the window is displayed, the inner webview may still not available. 
    await rsdWindow.sleep(1000);
    await rsdPage.switchToNewWebView();
    await rsdPage.getToolBar();
  });
  
  When('I select the {rsdTemplate} in create new document window', async function (rsdTemplate) {
    await rsdPage.getRSDTemplateIcon(rsdTemplate).click();
    await mainWindow.sleep(1500);
    return rsdPage.switchToNewWebView();
  });
  
  Then('The RSD scale setting with {percentage} should be displayed', async function (percentage) {
    await rsdPage.selectHomeMenu();
    await rsdPage.sleep(500);//wait RSD page reload, otherwise the dropdown selection will not be found
    await rsdPage.getDropdownSelection(percentage);
  });
  
  
  When('I change the scale from {fromPercentage} to {toPercentage}', async function (fromPercentage, toPercentage) {
    await rsdPage.getDropdownSelection(fromPercentage).click();
    await rsdPage.getDropdownSelection(toPercentage).click();
  });
  
  When('I close the {windowName} RSD Window', async function (windowName) {
    await rsdWindow.closeWindow(windowName);
    await rsdPage.switchToDefaultWebView();
  });

  When('I directly close the {windowName} RSD Window', async function (windowName) {
    await rsdWindow.closeWindow(windowName);
    if (OSType === 'windows') {
      await switchToWindow('Workstation Main Window');
      console.log('switched window')
      return unregisterWindow('Document Editor');
    }
    await rsdPage.switchToDefaultWebView();
  });
  
  When('I select Yes to close the RSD Window', async function () {
    await rsdWindow.confirmCloseRSDWindow();
    if (OSType === 'windows') {
      await switchToWindow('Workstation Main Window');
      console.log('switched window')
      return unregisterWindow('Document Editor');
    }
    await rsdPage.switchToDefaultWebView();
  });