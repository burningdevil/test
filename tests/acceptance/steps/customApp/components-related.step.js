import ComponentsPage from '../../pages/webPages/customApp/ComponentsPage';
const { Given, When, Then } = require('cucumber')
const compsPage = new ComponentsPage();
const { mainWindow } = pageObj

When('I open the sidebar collapse', async function () {
    await compsPage.collapseSidebar();
    return mainWindow.app.sleep(500)
}
);