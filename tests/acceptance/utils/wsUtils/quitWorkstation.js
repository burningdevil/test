const {switchToWindow} = require('./windowHelper')

async function quitWorkstation() {
    console.log(`Quitting Workstation...`);
    if (OSType === 'windows') {
        await switchToWindow(`webview helper`);
        await workstationApp.close();
        await switchToWindow(`Workstation Main Window`);
        await  workstationApp.close();
    } else {
        await mainWindow.menuBar.clickMenuItem('MicroStrategy Workstation');
        await mainWindow.menuBar.clickMenuItemOption('MicroStrategy Workstation', 'Quit MicroStrategy Workstation');
        await workstationApp.sleep(2000);
    }
    workstationApp.quit();
}

module.exports = quitWorkstation;
