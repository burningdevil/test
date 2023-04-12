
import ContentGroupEdtior from '../../pages/webPages/customApp/ContentGroupsEditorPage'
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const contentGroupEditor = new ContentGroupEdtior()
const { mainWindow } = pageObj


When('I modify content group name by {string}', async function (name) {
    await contentGroupEditor.inputBundleName(name)
    return mainWindow.app.sleep(500)
})

When('I switch to tab {string} in content group editor', async function (name) {
    await contentGroupEditor.switchTabByName(name)
    return mainWindow.app.sleep(500)
})

When('I click {string} button in content group editor', async function (text) {
    if (text === "Save") {
        await contentGroupEditor.clickSaveButtonInContentGroupEditor()
    } else if (text === 'Cancel') {
        await contentGroupEditor.clickCancelInContentGroupEditor()
    }
    return mainWindow.app.sleep(500)
})

When('I add {string} by name {string} in content editor', async function (tabName, objectName) {
    await contentGroupEditor.addContentInContentGroupEditor(tabName, objectName)
    return mainWindow.app.sleep(500)
})

When('I add user {string} as recipients in content group editor', async function (user) {
    await contentGroupEditor.addRecipientByUserName(user)
    return mainWindow.app.sleep(500)
})

Then('check content group name is {string}', async function (name) {
    const actualName = await contentGroupEditor.getContentGroupNameInContentGroupEditor()
    expect(actualName).to.equal(name)
})

Then('check content group has content object {string}', async function (name) {
    const isDisplayed = await contentGroupEditor.isObjectInContentGroups(name)
    expect(isDisplayed).to.equal(true)
})

Then('check total objects in content group editor should be {int}', async function (total) {
    const actual = await contentGroupEditor.getObjectsCount()
    expect(actual).to.equal(total)
})

Then('check content group has user {string}', async function (user) {
    const isDisplayed = await contentGroupEditor.isObjectInContentGroups(user)
    expect(isDisplayed).to.equal(true)
})
