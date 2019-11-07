const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow, unregisterWindow} = require('../../utils/wsUtils/windowHelper')

Then('The {string} RSD window should be present', async function (windowName) {
    await rsdWindow.waitRSDWindow(windowName);
});

When('I select the {string} in create new document window', async function (rsdTemplate) {
  await rsdPage.clickRSDTemplateIcon(rsdTemplate);
  return rsdPage.switchToNewWebView();
});

Then('The RSD scale setting with {string} should be displayed', async function (percentage) {
  await rsdPage.sleep(1000);//wait RSD page reload, otherwise the dropdown selection will not be found
  await rsdPage.selectHomeMenu();
  await rsdPage.sleep(500);//wait RSD page reload, otherwise the dropdown selection will not be found
  return expect(rsdPage.getDropdownSelection(percentage).isDisplayed()).become(true);
});


When('I change the scale from {string} to {string}', async function (fromPercentage, toPercentage) {
  await rsdPage.selectDropdownSelection(fromPercentage);
  return rsdPage.selectDropdownSelection(toPercentage);
});

When('I close the {string} RSD Window', async function (windowName) {
  await rsdWindow.closeWindow(windowName);
  return rsdPage.switchToDefaultWebView();
});

When('I directly close the {string} RSD Window', async function (windowName) {
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
