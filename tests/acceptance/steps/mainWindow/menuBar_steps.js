const { Given, When, Then } = require('cucumber');

When('I select {option} from {menu} on menubar', async function(option, menu){
    await mainWindow.menuBar.clickMenuItem(menu);
    await mainWindow.menuBar.clickMenuItemOption(option, menu);
    return mainWindow.app.sleep(4000);
})
