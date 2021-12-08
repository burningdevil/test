
import ContentsPage from '../../pages/webPages/customApp/ContentBundlesPage'
const { Given, When, Then, setDefaultTimeout } = require('cucumber')
const contentPage = new ContentsPage()
const { mainWindow } = pageObj



When('I input default group name {string}', async function (name) {
    await contentPage.inputName(name)
    return mainWindow.app.sleep(500)
}
);

Then('I add the content {string}', async function (name) {
    await contentPage.addContent(name)
    return mainWindow.app.sleep(500)
}
);

Then('I pick the dossier {string} in the add content dialog', async function (name) {
    await contentPage.pickDossier(name)
    return mainWindow.app.sleep(500)
}
);






