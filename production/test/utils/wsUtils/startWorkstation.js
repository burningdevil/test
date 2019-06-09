import { APP_CAPABILITIES, APPIUM_SERVER_URL } from '../envUtils/constants';
const wd = require('wd');

async function startWorkstation() {

    console.log('Starting Workstation')
    console.log('using Capabilities: ', APP_CAPABILITIES);

    let workstationApp = await wd.promiseChainRemote(APPIUM_SERVER_URL);
    await workstationApp.init(APP_CAPABILITIES)
    await workstationApp.setImplicitWaitTimeout(10000);
    await workstationApp.sleep(2000);
    return workstationApp ;
}

module.exports = startWorkstation;

