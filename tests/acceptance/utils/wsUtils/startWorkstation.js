import { APP_CAPABILITIES, APPIUM_SERVER_URL } from '../envUtils/constants';
const wd = require('wd');

async function sleep(ms) {
	return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

async function startWorkstation() {
    console.log('Starting Workstation')
    console.log('using Capabilities: ', APP_CAPABILITIES);

    let workstationApp = await wd.promiseChainRemote(APPIUM_SERVER_URL);
    if (OSType === 'windows') {
        // try to resolve the WAD splash screen problem in Windows
    	try{
    		await workstationApp.init(APP_CAPABILITIES)
    	} catch (e) {
    		console.log('First application initialization failed. Trying the second time...')
    		await sleep(5000)
    		await workstationApp.init(APP_CAPABILITIES)
    		// the second initialization somehow will bring up the connect to env dialog, we need to close it
    		let envDialog = await workstationApp.elementByName('Connection')
    		let closeEnvDialog = await envDialog.elementByAccessibilityId('WindowCloseButton')
    		await closeEnvDialog.click()
        }
    } else {
        await workstationApp.init(APP_CAPABILITIES)
    }
    await workstationApp.setImplicitWaitTimeout(10000);
    await workstationApp.sleep(1000);
    return workstationApp;
}

module.exports = startWorkstation;

