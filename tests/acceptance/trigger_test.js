/*
# This Script is used to start local installed Appium, trigger test and then stop Appium
# It has to be run in bash
#- Example to trigger test
#-- Windows: node trigger_test.js 'C:\\Program Files\\MicroStrategy\\Workstation\\Workstation.exe' '<Library_URL>'
#-- Mac: node trigger_test.js 'MicroStrategy Workstation.app' <Library_URL>
#- Exit Code
#-- If test run successfully, it returns EC 0
#-- If Appium cannot be started and test fails, it returns EC 1
#-- If Appium started successfully but the test fails, it returns EC 2
# Author: Qingqing Fan  10/28/2019
*/

const {spawn, execSync} = require('child_process');

// receive arguments from CI Pipeline
const argumentsFromCI = process.argv.slice(2)
const APP_PATH = argumentsFromCI[0]
const ENV_URL = argumentsFromCI[1]
const TAG = argumentsFromCI[2]

let cp, globalExitCode = 0
// start appium method
const startupAppium = async () => {
    cp = spawn('node', ['node_modules/appium/.'], { stdio:'ignore', env: process.env})
    let startupError, exitHandler
    cp.on('exit', exitHandler = exitCode => {
        if(exitCode) {
            startupError = new Error('Failed to start Appium')
        }
    })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Remove listeners...
            cp.removeListener('exit', exitHandler);
            // Startup error?
            if (startupError) {
                reject(startupError);
            }
            resolve();
        },5000)
    })
}

// whole workflow
(async () => {
    try{
        console.info('start Appium...')
        await startupAppium()
    } catch (err) {
        globalExitCode = 1
    }
    try {
        console.info('Running test...')
        let OS_APP_PATH =''
        if(process.platform === 'win32') {
            OS_APP_PATH = `--args.appPath.windows '${APP_PATH}'`
        } else {
            OS_APP_PATH = `--args.appPath.mac '${APP_PATH}'`
        }
        execSync(`yarn test ${OS_APP_PATH} --params.envInfo[0].envUrl '${ENV_URL}' --cucumberOpts.tags '${TAG}'`, { stdio: 'inherit', encoding: 'utf-8' })
    } catch (err) {
        console.error(err)
        globalExitCode = 2
    };
    console.info('Quit Appium...')
    cp.kill('SIGINT')
    process.exit(globalExitCode)
})()
