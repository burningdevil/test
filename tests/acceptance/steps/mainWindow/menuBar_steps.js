const { Given, When, Then } = require('cucumber');
const {registerNewWindow, switchToWindow} = require('../../Utils/wsUtils/windowHelper');

When('I select {option} from {menu} on menubar', async function(option, menu){
    await mainWindow.menuBar.clickMenuItem(menu);
    await mainWindow.menuBar.clickMenuItemOption(menu, option);
    await mainWindow.app.sleep(4000);

    if (OSType === 'windows'){
        if(option === 'New Metric'){
          await registerNewWindow(option);
          await switchToWindow(option);
          return metricEditorPage.switchToNewWebView();
        }
      }else{
        return metricEditorPage.switchToNewWebView();
      }
})
