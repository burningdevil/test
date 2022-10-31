import { Return } from 'wd/lib/special-keys'
import ApplicationPage from '../../pages/webPages/customApp/ApplicationPage'
import SettingPage from '../../pages/webPages/customApp/SettingPage'
const { expect } = require('chai')
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const applicationPage = new ApplicationPage()
const settingPage = new SettingPage()
const { mainWindow } = pageObj



When('I click the application create entry', async function () {
    await applicationPage.createNewCustomApp()
    return mainWindow.app.sleep(500)
}
);

Then('I sort the application list by {string}', async function (columnname) {
    await applicationPage.switchToCustomAppWindow()
    await applicationPage.sortColumn(columnname)
    return mainWindow.app.sleep(500)
}
);

Then('I deselect column {string} display', async function (option) {
    await applicationPage.switchToCustomAppWindow()
    await applicationPage.deselectColumn(option)
    return mainWindow.app.sleep(500)
}
);


When('I copy link of the application {string}', async function (name) {
    await applicationPage.shareLink(name)
    return mainWindow.app.sleep(500)
}
);

Then('I click {string} button in the tab {string}', async function (text, pageId) {
    await settingPage.clickButtonsByTextOnNewCustomAppPage(text, pageId)
    return mainWindow.app.sleep(500)
}
);

When('I input application name {string}', async function (name) {
    await settingPage.inputName(name)
    return mainWindow.app.sleep(500)
}
);

When('I input application description {string}', async function (description) {
    await settingPage.inputDescription(description)
    return mainWindow.app.sleep(500)
}
);



When('I edit the application {string}', async function (name) {
    await applicationPage.editCustomAppFromCustomAppListPageByName(name)
    return mainWindow.app.sleep(500)
}
);

Then('I duplicate the application {string}', async function (name) {
    await applicationPage.duplicateCustomAppFromCustomAppListPageByName(name)
    return mainWindow.app.sleep(500)
}
);

Then('I delete the application {string}', async function (name) {
    await applicationPage.deleteCustomAppFromCustomAppListPageByName(name)
    return mainWindow.app.sleep(2000)
}
);

Then('I click getinfo of the application {string}', async function (name) {
    await applicationPage.getinfoCustomAppFromCustomAppListPageByName(name)
    return mainWindow.app.sleep(500)
}
);


Then('I switch to menu {string}', async function (menu) {
    await settingPage.switchMenu(menu)
    return mainWindow.app.sleep(500)
}
);

Then('I choose {string} as home', async function (mode) {
    await settingPage.chooseHomescreen(mode)
    return mainWindow.app.sleep(500)
}
);

Then('I choose {string} menu and pick document {string}', async function (menu, name) {
    await settingPage.switchDossierDocumentTab(menu)
    await settingPage.pickDossierByName(name)
    return mainWindow.app.sleep(500)
}
);


Then('I choose the toolbar mode {string}', async function (toolbarmode) {
    await settingPage.chooseToolbarMode(toolbarmode)
    return mainWindow.app.sleep(500)
}
);

Then('I hide toolbar icon {string}', async function (text) {
    await settingPage.hideToolbarOption(text)
    return mainWindow.app.sleep(500)
}
);

When('I show toolbar icon {string}', async function (text) {
    await settingPage.showToolbarOption(text)
    return mainWindow.app.sleep(500)
});

When('I choose the {string} client preview in the tab {string}', async function (client, pageId) {
    await settingPage.choosePreview(client, pageId)
    return mainWindow.app.sleep(500)
}
);

When('I choose the user access {string}', async function (mode) {
    let id = mode === 'Allow users to access preferences' ? 'disablePreferences' : 'disableAdvancedSettings';
    await settingPage.chooseUserAccess(id)
    return mainWindow.app.sleep(500)
}
);

When('I enable the custom palette mode {string}', async function (mode) {
    await settingPage.chooseCustomPaletteMode(mode)
    return mainWindow.app.sleep(500)
}
);

When('I enter the palette pick panel', async function () {
    await settingPage.enterPalettePickPanel()
    return mainWindow.app.sleep(500)
}
);

When('I enter the palette create panel', async function () {
    await settingPage.enterPaletteCreatePanel()
    return mainWindow.app.sleep(500)
}
);

When('I choose the {string} as the default palette', async function (palettename) {
    await settingPage.setDefaultPalette(palettename)
    return mainWindow.app.sleep(500)
}
);

When('I remove the {string} from the list', async function (palettename) {
    await settingPage.removePaletteFromList(palettename)
    return mainWindow.app.sleep(500)
}
);

Then('I pick color {string}', async function (color) {
    await settingPage.pickColor(color)
    return mainWindow.app.sleep(500)
}
);


Then('I pick palette {string}', async function (palettename) {
    await settingPage.pickPaletteByName(palettename)
    return mainWindow.app.sleep(500)
}
);

Then('I comfirm the palette selection', async function () {
    await settingPage.confirmPickPalette()
    return mainWindow.app.sleep(500)
}
);

Then('I confirm in color palette editor', async function () {
    await settingPage.conformInColorPaletteEditor()
    return mainWindow.app.sleep(500)
});


Then('check the screenshot by comparing {string}', async function (screenshot) {
    await applicationPage.takeScreenshotOnPage(screenshot)
    return mainWindow.app.sleep(500)
})


Then('check the screenshot on element {string} by comparing {string}', async function (element, text) {
    await applicationPage.takeScreenshotOnElement(element, text)
    return mainWindow.app.sleep(500)
})

When('I input the params by number in the more setting {string} {string}', async function (number, val) {
    await settingPage.inputMoreSetting(number, val)
    return mainWindow.app.sleep(500)
}
);

When('I change the logging level {string}', async function (level) {
    await settingPage.changeLoggingLevel(level)
    return mainWindow.app.sleep(500)
}
);

When('I check the cache setting', async function () {
    await settingPage.checkCache()
    return mainWindow.app.sleep(500)
}
);

When('I select option {string} for auth mode', async function (option) {
    await settingPage.setAuthModeOption(option)
    return mainWindow.app.sleep(500)
});

Then('I verify auth mode option {string} is selected', async function (option) {
    const isChecked = await settingPage.getAuthModeSelectionCheckBoxByOption(option).isSelected()
    expect(isChecked).to.equal(true)
})

When('I select custom auth modes {string} for auth mode', async function (options) {
    await settingPage.setCustomAuthModes(options, false)
    return mainWindow.app.sleep(500)
});

When('I deselect custom auth modes {string} for auth mode', async function (options) {
    await settingPage.setCustomAuthModes(options, true)
    return mainWindow.app.sleep(500)
});

Then('I verify auth modes {string} are selected', async function (options) {
    const opts = options.split(',');
    for (const opt of opts) {
        const isChecked = await settingPage.getCheckBoxByAuthModeOption(opt).isSelected()
        expect(isChecked).to.equal(true)
    }
});

When('I set custom auth mode option {string} as default mode', async function (options) {
    await settingPage.getOptionLabelByAuthModeOption(options, 'set as default').click()
    return mainWindow.app.sleep(500)
});

Then('I verify custom auth mode option {string} is default mode', async function (option) {
    const isDisplayed = await settingPage.getOptionLabelByAuthModeOption(option, 'default').isDisplayed()
    expect(isDisplayed).to.equal(true)
});

Then('I verify {string} button is {string} in the tab {string}', async function (text, status, pageId) {
    const isEnabled = await settingPage.getButtonByNameByTab(text, pageId).isEnabled()
    expect(isEnabled).to.equal(status !== 'disabled')
});

Then('I verify auth mode of custom app {string} in detail grid is {string}', async function (name, authModes) {
    const value = await applicationPage.getAuthModesInApplicationDetailsGridByAppName(name, authModes).getText()
    expect(authModes === value).to.equal(true)
});









