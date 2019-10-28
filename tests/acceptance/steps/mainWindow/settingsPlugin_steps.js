const { Given, When, Then } = require('cucumber');

Then('The environment information window should be displayed', async function () {
  return settingsPluginWindow.isEditorDisplayed("Plugin Test")
});

When('I select plugin tab {tabName}', async function (tabName) {
  await settingsPluginWindow.selectTab(tabName);
  await settingsPluginWindow.sleep(2000);
  return governingSettingsPage.switchToNewWebView();
});

Then('The Governing Settings plugin page should be displayed', async function () {
  return expect(governingSettingsPage.getAdvancedLink().isDisplayed()).become(true);
});

Then('The All Settings plugin page should be displayed', async function () {
  return expect(allSettingsPage.getSettingsTableTitle().isDisplayed()).become(true);
});


When('I input {inputValue} for Message lifetime', async function (inputValue) {
  return allSettingsPage.inputMessageLifetime(inputValue);
});

When('I click on the advanced link', async function () {
  return governingSettingsPage.clickAdvancedLink();
});

When('I click the {buttonName} button to close the plugin window', async function (buttonName) {
  await settingsPluginWindow.clickButton(buttonName);
  return governingSettingsPage.switchToDefaultWebView();
});

When('I confirm the error massage', async function () {
  return settingsPluginWindow.confirmErrorMessage();
});





