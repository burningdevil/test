import { Return } from 'wd/lib/special-keys'
import ApplicationPage from '../../pages/webPages/customApp/ApplicationPage'
import SettingPage from '../../pages/webPages/customApp/SettingPage'
import AppThemePage from '../../pages/webPages/customApp/AppThemePage'
import EnvConnectionsPage from '../../pages/webPages/customApp/EnvConnectionsPage'
import ContentsPage from '../../pages/webPages/customApp/ContentBundlesPage'
import { wsConfig, imageCompareConfig, componentStatus } from '../../config/constants'
const { expect } = require('chai')
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const applicationPage = new ApplicationPage()
const settingPage = new SettingPage()
const appThemePage = new AppThemePage()
const envConnectionsPage = new EnvConnectionsPage()
const contentGroupPage = new ContentsPage()
const { mainWindow } = pageObj
const { switchToWindow } = require('../../utils/wsUtils/windowHelper')


When('I click the application create entry', async function () {
    await applicationPage.createNewCustomApp()
    return mainWindow.app.sleep(500)
}
);

When('I sort the application list by {string}', async function (columnname) {
    await applicationPage.switchToCustomAppWindow()
    await applicationPage.sortColumn(columnname)
    return mainWindow.app.sleep(500)
}
);

When('I toggle column {string} in application grid to {string}', async function (options, status) {
    await applicationPage.toggleColumnInCustomAppGrid(options, status)
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

When('I choose tab {string} and search for {string} in home dossier picker', async function (menu, name) {
    await settingPage.switchDossierDocumentTab(menu)
    await settingPage.searchForObjectAsHomeScreen(name)
    return mainWindow.app.sleep(500)
})

When('I pick dossier {string} in home screen picker', async function (name) {
    await settingPage.getGridCellInDossierListView(name).click()
    await settingPage.getSelectButton().click()
})


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

When('I hover over {string} to display tooltip on components tab', async function (text) {
    await settingPage.showTooltipOnComponentsSettings(text)
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
    switch (element) {
        case imageCompareConfig.appDetailGrid:
            await applicationPage.takeScreenshotOnElement(element, text)
        case imageCompareConfig.customEmail:
            await settingPage.takeScreenshotOnElement(element, text)
        case imageCompareConfig.envConnectionCurrentUrl:
            await envConnectionsPage.takeScreenshotOnElement(element, text)
        case imageCompareConfig.contextMenuInContentTab:
            await contentGroupPage.takeScreenshotOnElement(element, text)

    }
    return mainWindow.app.sleep(500)
})

Then('I verify content group context menu option {string} should {string}', async function (option, status) {
    const isDisplayed = await contentGroupPage.isContextMenuOptionDisplay(option)
    expect(isDisplayed).to.equal(status === componentStatus.shown)
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

Then('I verify custom app {string} is displayed in application detailed grid', async function (name) {
    await applicationPage.waitForWebElementToBeVisiable(applicationPage.getGridCellInCustomAppListView(name))
    const isDisplayed = await applicationPage.getGridCellInCustomAppListView(name).isDisplayed()
    expect(isDisplayed).to.equal(true)
});

Then('I verify auth mode option {string} is selected', async function (option) {
    await settingPage.waitForAuthModeSection()
    const isChecked = await settingPage.getAuthModeSelectionCheckBoxByOption(option).isSelected()
    expect(isChecked).to.equal(true)
});

When('I select custom auth modes {string} for auth mode', async function (options) {
    await settingPage.setCustomAuthModes(options, false)
    return mainWindow.app.sleep(500)
});

When('I deselect custom auth modes {string} for auth mode', async function (options) {
    await settingPage.setCustomAuthModes(options, true)
    return mainWindow.app.sleep(500)
});

Then('I verify auth modes {string} are selected', async function (options) {
    await settingPage.waitForAuthModeSection()
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

Then('I verify auth mode of custom app {string} in detail grid is {string}', async function (name, expectAuthModes) {
    await applicationPage.waitForCustomAppMainWindow();
    const texts = await applicationPage.getAuthModesInApplicationDetailsGridByAppName(name).getText()
    const actualModes = texts.split(wsConfig.authModesSeperator)
    const expectModes = expectAuthModes.split(wsConfig.authModesSeperator)
    expect(expectModes.length === expectModes.length).to.equal(true)
    expect(expectModes[0] === actualModes[0]).to.equal(true)
    for (let i = 0; i < expectModes.length; i++) {
        //expect(expectAuthModes.includes(actualModes[i])).to.equal(true)
        expect(expectAuthModes).to.include(actualModes[i])
    }
});

When('I enable custom email mode', async function () {
    await settingPage.enableCustomEmailMode()
    return mainWindow.app.sleep(500)
});

When('I send preview email', async function () {
    await settingPage.sendPreviewEmail()
    return mainWindow.app.sleep(500)
});

When('I expand {string} section', async function (section) {
    await settingPage.expandSection(section)
    return mainWindow.app.sleep(500)
});

When('I collapse {string} section', async function (section) {
    await settingPage.clickEmailSection(section)
    return mainWindow.app.sleep(500)
});

When('I click reset of {string}', async function (section) {
    await settingPage.clickReset(section)
    return mainWindow.app.sleep(500)
});

When('I reset {string}', async function (section) {
    await settingPage.clickReset(section)
    await settingPage.confirmReset("Yes")
    return mainWindow.app.sleep(500)
});

When('I view Subject & Body Text Info', async function () {
    await settingPage.viewSubjectAndBodyTextInfo()
    return mainWindow.app.sleep(500)
});

When('I view Notification Reminder Info', async function () {
    await settingPage.viewNotificationReminderInfo()
    return mainWindow.app.sleep(500)
});

When('I view Link Text Info', async function () {
    await settingPage.viewLinkTextInfo()
    return mainWindow.app.sleep(500)
});

When('I view Host Web Portal Info', async function () {
    await settingPage.viewHostPortalInfo()
    return mainWindow.app.sleep(500)
});

When('I input {string} in section {string} of {string}', async function (text, number, section) {
    await settingPage.inputSubjectOrBody(text, number, section)
    return mainWindow.app.sleep(500)
});

When('I select {string} from dropdown list in section {string} of {string}', async function (value, number, section) {
    await settingPage.selectFromDropdownList(value, number, section)
    return mainWindow.app.sleep(500)
});

When('I input {string} URL in {string}', async function (url, media) {
    await settingPage.inputMediaURL(url, media)
    return mainWindow.app.sleep(500)
});

When('I input {string} in {string}', async function (text, field) {
    await settingPage.inputEmailDescription(text, field)
    return mainWindow.app.sleep(1000)
});

When('I input {string} in reminder', async function (text) {
    await settingPage.inputReminder(text)
    return mainWindow.app.sleep(1000)
});

When('I disable media {string}', async function (media) {
    await settingPage.showMedia(media)
    return mainWindow.app.sleep(500)
});

When('I disable section {string}', async function (label) {
    await settingPage.switchOption(label)
    return mainWindow.app.sleep(500)
});

When('I change mobile link from {string} to {string}', async function (link1, link2) {
    await settingPage.changeMobileLink(link1, link2)
    return mainWindow.app.sleep(500)
});

Then('I check default mobile link', async function () {
    const { envUrl } = browser.params.envInfo[0]
    const expectLink = `dossier://?url=${envUrl}`
    const actualLink = await settingPage.getMobileLink().getText()
    expect(actualLink).to.equals(expectLink)
})

When('I change dossier to {string} in url scheme', async function (text) {
    await settingPage.changeUrlSchemeLink(text)
    return mainWindow.app.sleep(500)
});

When('I input {string} on button {string}', async function (text, button) {
    await settingPage.changeTextOnButton(text, button)
    return mainWindow.app.sleep(500)
});

Then('I verify {string} error appears', async function (text) {
    const isDisplayed = await settingPage.getErrorMessage(text).isDisplayed()
    expect(isDisplayed).to.equal(true)
});

Then('I verify switch button of {string} is {string}', async function (label, status) {
    const actState = await settingPage.getOptionSwitcher(label).getAttribute('aria-checked')
    expect(actState === 'true').to.equal(status === 'on')
});

When('I clear text on button {string}', async function (button) {
    await settingPage.clearTextOnButton(button)
});

When('I click enter appearance editor', async function () {
    await settingPage.enterAppearanceEditorDialog()
    return mainWindow.app.sleep(500)
});

When('I click edit appearance button', async function () {
    await settingPage.clickEditAppearanceButton()
    return mainWindow.app.sleep(500)
});

When('I click apply button in appearance editor', async function () {
    await settingPage.clickApplyButtonInAppearanceEditor()
    return mainWindow.app.sleep(500)
});

When('switch to user {string} with password {string}', async function (userName, userPwd) {
    const { envName, envUrl, loginMode, projects } = browser.params.envInfo[0]
    await switchToWindow('Workstation Main Window')
    await mainWindow.smartTab.scrollOnSmartTab('up')
    await mainWindow.smartTab.selectTab('Environments')

    try {
        if (OSType === 'mac') {
            await mainWindow.mainCanvas.envSection.removeEnv(envName)
        } else {
            await mainWindow.mainCanvas.envSection.removeAllEnv()
        }

    } catch (err) {
        console.log('[INFO] [Remove User] Target env already removed.')
    }

    await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
    await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)

    await browser.sleep(5000)

    for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
        await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
    }
    await mainWindow.mainCanvas.envSection.clickOkToConnect()

    await workstationApp.sleep(2000)
    await browser.sleep(5000)

    if (OSType === 'mac') {
        console.log('[INFO] Click to collapse ANALYSIS tab.')
        await mainWindow.smartTab.selectTab('ANALYSIS')
        await workstationApp.sleep(1000)
        try {
            const projectsTab = await mainWindow.smartTab.getTab('Projects')
            console.log('[INFO] Click to collapse ANALYSIS tab again.')
            await mainWindow.smartTab.selectTab('ANALYSIS')
        } catch (e) {
            console.log('[INFO] ANALYSIS tab collapsed.')
        }

    } else {
        await mainWindow.smartTab.scrollOnSmartTab('down')
        await mainWindow.app.sleep(500)
        await mainWindow.smartTab.scrollOnSmartTab('down')
        await mainWindow.app.sleep(500)
    }
});

When('I input WebLogo url {string} in appearance editor', async function (url) {
    await appThemePage.inputWebLogoURL(url)
    return mainWindow.app.sleep(8000)
});

When('I input WebFavicon url {string} in appearance editor', async function (url) {
    await appThemePage.inputWebFaviconURL(url)
    return mainWindow.app.sleep(5000)
});

When('I input MobileLogo url {string} in appearance editor', async function (url) {
    await appThemePage.inputMobileLogoURL(url)
    return mainWindow.app.sleep(5000)
});

When('I select color theme {string} in appearance editor', async function (color) {
    await appThemePage.setAppThemeColor(color)
    return mainWindow.app.sleep(1000)
});

Then('I set custom theme property {string} via color picker in appearance editor', async function (name) {
    await appThemePage.setCustomColorBox(name)
    return mainWindow.app.sleep(1000)
});

Then('I select color picker color {string}', async function (color) {
    await appThemePage.pickColorPickerColor(color)
    return mainWindow.app.sleep(1000)
});

Then('I set custom theme property {string} via input {string} in appearance editor', async function (name, color) {
    await appThemePage.setCustomColorInputBox(name, color)
    return mainWindow.app.sleep(1000)
});

When('I switch application environment to {string}', async function (name) {
    await mainWindow.mainCanvas.switchApplicationEnv(name)
    return mainWindow.app.sleep(1000)
});

When('I add env {string} to linked envs', async function (name) {
    await envConnectionsPage.addEnvByName(name)
    return mainWindow.app.sleep(1000)
});

When('I double click the {string} name cell to focus on it', async function (name) {
    await envConnectionsPage.doubleClickNameCell(name)
    return mainWindow.app.sleep(1000)
});

When('I rename linked env {string} to {string}', async function (name, newName) {
    await envConnectionsPage.renameLinkedEnv(name, newName)
    return mainWindow.app.sleep(1000)
})

When('I hover over {string} to display tooltip', async function (name) {
    await envConnectionsPage.hoverLinkedEnv(name)
    return mainWindow.app.sleep(1000)
});

When('I open the application selector dropdown for environment {string}', async function (name) {
    await envConnectionsPage.openLinkedEnvApplicationSelectorDropdown(name)
    return mainWindow.app.sleep(1000)
});

Then('I select the {string} application list item', async function (name) {
    await envConnectionsPage.selectLinkedEnvApplicationSelectorDropdownListItem(name)
    return mainWindow.app.sleep(1000)
});