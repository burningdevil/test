const workstationMainWindow = XPATH['workstationMainWindow'];

async function quitWorkstation() {
    console.log(`Quitting Workstation...`);
    let close = await workstationApp.elementByXPath(workstationMainWindow.closeWorkstation);
    await close.click();
    return workstationApp.sleep(1000);
}

module.exports = quitWorkstation;
