async function quitWorkstation() {
    console.log(`Quitting Workstation...`);
    if (OSType === 'windows') {
        return  workstationApp.closeApp();
    } else {
        const workstationMainWindow = MAC_XPATH['workstationMainWindow'];
        let close = await workstationApp.elementByXPath(workstationMainWindow.closeWorkstation);
        await close.click();
        return workstationApp.sleep(1000);
    }
}

module.exports = quitWorkstation;
