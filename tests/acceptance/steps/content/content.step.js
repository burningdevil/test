
import ContentsPage from '../../pages/webPages/customApp/ContentBundlesPage'
import createContentGroupAPI from '../../api/contentGroup/createContentGroupAPI'
import * as sampleRequestData from '../../api/data/contentGroupData'
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const contentPage = new ContentsPage()
const { mainWindow, contentGroupInfo } = pageObj




When('I input default group name {string}', async function (name) {
    await contentPage.inputName(name)
    return mainWindow.app.sleep(500)
}
);

Then('I add the content', async function () {
    await contentPage.addContent()
    return mainWindow.app.sleep(500)
}
);

Then('I pick the dossier {string} in the add content dialog', async function (name) {
    await contentPage.pickDossier(name)
    return mainWindow.app.sleep(500)
}
);
Then('I click the section title tip icon to show preview', async () => {
    await contentPage.hoverTip();
    return mainWindow.app.sleep(500);
})
Then('I select the all checkbox', async () => {
    await contentPage.selectAll();
    return mainWindow.app.sleep(500);
})
When('I choose {string} in content group picker', async (name) => {
    await contentPage.chooseContentGroupByName(name);
    return mainWindow.app.sleep(500);
})

Then('I expand the content bundle {string}', async (name) => {
    await contentPage.collapseContent(name);
    return mainWindow.app.sleep(500);
})
Then('I remove the content bundle {string}', async (name) => {
    await contentPage.removeContent(name);
    return mainWindow.app.sleep(500);
})
Then('I finished select content bundle', async () => {
    await contentPage.finishedSelectContentGroupByClickSelect();
    return mainWindow.app.sleep(500);
})
Then('I move mouse to content bundle grid and right click', async () => {
    const contentBundlesGrid = await contentPage.getContentGroupGrid()
    await contentPage.rightClick({ elem: contentBundlesGrid })
    return mainWindow.app.sleep(500);
})

When('I open all content setting dropdown', async () => {
    await contentPage.clickAllContentSettings()
    return mainWindow.app.sleep(500)
})

When('I choose {string} all content setting under content tab', async (text) => {
    await contentPage.setAllContentSettings(text)
    return mainWindow.app.sleep(500)
})

Given('I create content groups by rest api', async () => {
    const { envUrl, userName, userPwd } = browser.params.envInfo[0]
    await createContentGroupAPI({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        contentGroupInfo: sampleRequestData.contentGroupInfoOfG1,
        contentInfo: sampleRequestData.contentInfo
    })
    await createContentGroupAPI({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        contentGroupInfo: sampleRequestData.contentGroupInfoOfG2,
        contentInfo: sampleRequestData.contentInfo
    })
    return mainWindow.app.sleep(500)
})

Given('I create content groups with reports by rest api', async () => {
    const { envUrl, userName, userPwd } = browser.params.envInfo[0]
    await createContentGroupAPI({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        contentGroupInfo: sampleRequestData.contentGroupInfoOfG1,
        contentInfo: sampleRequestData.contentInfoWithReport
    })
    return mainWindow.app.sleep(500)
})

When('I select content groups by name {string} in application editor', async (contentGroupNames) => {
    await contentPage.selectContentGroupsByNames(contentGroupNames)
    return mainWindow.app.sleep(500)
})

When('I right click on {string} to open context menu', async (contentGroup) => {
    // to dismiss context menu if any
    await contentPage.getContentGroupGrid().click()
    const contentItem = await contentPage.getGridCellInDossierListView(contentGroup)
    await contentPage.rightClick({ elem: contentItem })
    return mainWindow.app.sleep(1000)
})

When('I edit content group {string}', async (contentGroupName) => {
    await contentPage.editContentGroup(contentGroupName)
    return mainWindow.app.sleep(500)
})

When('I open properties dialog of content group {string}', async (contentGroupName) => {
    await contentPage.openPropertiesDialog(contentGroupName)
    return mainWindow.app.sleep(500)
})

When('I close content group info dialog of {string}', async (name) => {
    await contentGroupInfo.closeContentGroupInfoWindow(name)
    return mainWindow.app.sleep(500)
})

Then('check group name is {string} in content group info window', async (name) => {
    const isDisplayed = await contentGroupInfo.isContentGroupNameDisplayed(name)
    expect(isDisplayed).to.equal(true)
})

When('I hover on allow content setting tooltip', async () => {
    await contentPage.hoverOnTooltipOfAllContentSettings()
    return mainWindow.app.sleep(500)
})











