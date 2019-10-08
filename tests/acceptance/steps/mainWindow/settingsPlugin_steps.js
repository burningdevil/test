const { Given, When, Then } = require('cucumber');

Then('The environment information window should be displayed', async function () {
  await settingsPluginWindow.sleep(2000);
});

When('I select plugin tab {tabName}', async function (tabName) {
  await settingsPluginWindow.selectTab(tabName);
  await settingsPluginWindow.sleep(1000);
  await governingSettingsPage.switchToNewWebView();
});

Then('The Governing Settings plugin page should be displayed', async function () {
  await governingSettingsPage.getAdvancedLink();
});

Then('The All Settings plugin page should be displayed', async function () {
  await allSettingsPage.getSettingsTableTitle();
});


When('I input {inputValue} for Message lifetime', async function (inputValue) {
  await allSettingsPage.inputMessageLifetime(inputValue);
});

When('I click on the advanced link', async function () {
  await governingSettingsPage.getAdvancedLink().click();
  await settingsPluginWindow.sleep(1000);
});

When('I click the {buttonName} button to close the plugin window', async function (buttonName) {
  await settingsPluginWindow.clickButton(buttonName);
  await governingSettingsPage.switchToDefaultWebView();
});

When('I confirm the error massage', async function () {
  await settingsPluginWindow.confirmErrorMessage();
});





