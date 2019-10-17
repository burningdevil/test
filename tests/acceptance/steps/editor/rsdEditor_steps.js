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
  });
  
  When('I select the {rsdTemplate} in create new document window', async function (rsdTemplate) {
    await rsdPage.clickRSDTemplateIcon(rsdTemplate);
    return rsdPage.switchToNewWebView();
  });
  
  Then('The RSD scale setting with {percentage} should be displayed', async function (percentage) {
    await rsdPage.sleep(1000);//wait RSD page reload, otherwise the dropdown selection will not be found
    await rsdPage.selectHomeMenu();
    await rsdPage.sleep(500);//wait RSD page reload, otherwise the dropdown selection will not be found
    return expect(rsdPage.getDropdownSelection(percentage).isDisplayed()).become(true);
  });
  
  
  When('I change the scale from {fromPercentage} to {toPercentage}', async function (fromPercentage, toPercentage) {
    await rsdPage.selectDropdownSelection(fromPercentage);
    return rsdPage.selectDropdownSelection(toPercentage);
  });
  
  When('I close the {windowName} RSD Window', async function (windowName) {
    await rsdWindow.closeWindow(windowName);
    return rsdPage.switchToDefaultWebView();
  });

  When('I directly close the {windowName} RSD Window', async function (windowName) {
    await rsdWindow.closeWindow(windowName);
    if (OSType === 'windows') {
      await switchToWindow('Workstation Main Window');
      console.log('switched window')
      await unregisterWindow('Document Editor');
    }
    return rsdPage.switchToDefaultWebView();
  });
  
  When('I select Yes to close the RSD Window', async function () {
    await rsdWindow.confirmCloseRSDWindow();
    if (OSType === 'windows') {
      await switchToWindow('Workstation Main Window');
      console.log('switched window')
      await unregisterWindow('Document Editor');
    }
    return rsdPage.switchToDefaultWebView();
  });