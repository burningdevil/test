const { Given, When, Then } = require('cucumber');

Then('The new RSD window should be present', async function () {
    await rsdWindow.waitRSDWindow();
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
  
  When('I close the RSD Window', async function () {
    await rsdWindow.closeRSDWindow();
    await rsdPage.switchToDefaultWebView();
  });
  
  When('I select Yes to close the RSD Window', async function () {
    await rsdWindow.confirmCloseRSDWindow();
    await rsdPage.switchToDefaultWebView();
  });