async function quitWorkstation() {
    console.log(`Quitting Workstation...`);
    if (OSType === 'windows') {
        await  workstationApp.closeApp();
    } else {
        await menuBar.clickMenuItem('MicroStrategy Workstation');
        await menuBar.clickMenuItemOption('MicroStrategy Workstation', 'Quit MicroStrategy Workstation');
        await workstationApp.sleep(2000);
    }
    workstationApp.quit();
}

module.exports = quitWorkstation;
