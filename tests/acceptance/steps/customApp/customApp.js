import { Return } from 'wd/lib/special-keys'
import ApplicationPage from '../../pages/webPages/customApp/ApplicationPage'
import SettingPage from '../../pages/webPages/customApp/SettingPage'
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

Then('I click {string} button', async function (text) {
    await settingPage.clickButtonsByTextOnNewCustomAppPage(text)
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

When('I choose the home screen mode {string}', async function (homescreen) {
    await settingPage.chooseHomescreen(homescreen)
}
);


Then('I edit the application {string}', async function (name) {
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
    return mainWindow.app.sleep(500)
}
);

Then('I getinfo the application {string}', async function (name) {
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



When('I choose the toolbar mode {string}', async function (toolbarmode) {
    await settingPage.chooseToolbarMode(toolbarmode)
}
);

Then('I hide toolbar icon {string}', async function (text) {
    await settingPage.hideToolbarOption(text)
    return mainWindow.app.sleep(500)
}
);




