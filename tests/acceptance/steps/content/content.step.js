
import ContentsPage from '../../pages/webPages/customApp/ContentBundlesPage'
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const contentPage = new ContentsPage()
const { mainWindow } = pageObj



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






