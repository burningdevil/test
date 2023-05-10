import cleanContentGroupAPI from '../api/contentGroup/cleanContentGroupAPI'
import cleanCustomAppAPI from '../api/cleanCustomAppAPI'
import { wsConfig } from "../config/constants";
const { After, Before, Status, setDefaultTimeout } = require('cucumber');
const { recordVideoForScenario, removeVideo, stopRecord, uploadVideo } = require('../utils/ciUtils/video-helper')
const { sleep } = require('../utils/ciUtils/os-helper')
const { clearJoints } = require('./mimo')
const { appInfo, appWindow, envWindow, mainWindow } = pageObj
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../utils/wsUtils/windowHelper')
const { initSpectreProtractor } = require('../utils/spectre-protractor')
const chalk = require('chalk');


Before({ timeout: 30000 }, async function (scenario) {
    // clear mimo cache before each scenario
    // instead of clearing in global hook, the alternative place is World Constructor
    // https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md
    clearJoints()


    if (global.videoRecord) {
        const { process, path, name } = await recordVideoForScenario(scenario);
        this.process = process
        this.path = path
        this.name = name
    }
    const testSuiteName = scenario.pickle.name
    console.log(chalk.bold(`[INFO] [Sceanrio] Start ${testSuiteName}`))
    await initSpectreProtractor(testSuiteName)
    // TODO: investigate why it fails on Windows 10
    // await guaranteeEnvironmentsExist()
})

After(async function (scenario) {
    console.log('[INFO] [Sceanrio] End ' + scenario.pickle.name)
    console.log(`the scenarios '${scenario.pickle.name}' is ${scenario.result.status}`)
    if (global.videoRecord) {
        if (scenario.result.status === Status.PASSED) {
            await stopRecord(this.process)
            await removeVideo(scenario)
        } else {
            await sleep(2000)
            await stopRecord(this.process)
            if (global.enableUplodaVideo) {
                try {
                    await sleep(1000)
                    const videoMetadata = await uploadVideo(`${this.path}/${this.name}`, global.uploadVideoPath)
                    console.log('upload video info: ' + videoMetadata)
                    const { url } = JSON.parse(videoMetadata)
                    if (global.videoUploadURL === undefined) {
                        global.videoUploadURL = url.substring(0, url.lastIndexOf('/'))
                    }
                    this.attach(`<a href="${url}">Download video: ${this.name}</a>`, 'text/html')
                } catch (e) {
                    console.log('[Error] upload video failed: ' + e)
                }
            }
        }
    }

    // if (scenario.result.status !== Status.PASSED) {
    //     logger.info('Trying to kill all Workstations')
    //     await killAllWorkstations()
    //     // const restartBrowser = browser.restart()
    //     await killAllProcesses(await getAllChromeHelperPID())
    //     logger.info('Restarting Workstation')
    //     await startWorkstation()
    //     // await killAllWorkstations()
    //     // await startWorkstation()
    //     await sleep(15000)
    //     await OSSwitch(async () => {
    //         // await workstationApp.sleep(2000)
    //         // Sometimes windows workstation will pop up an expected connection info window, which should be closed before continue
    //         try {
    //             const cancelBtnOfEnvWindow = await workstationApp.elementByName('Cancel')
    //             await cancelBtnOfEnvWindow.click()
    //             logger.info(`the unexpected env connection info window has been closed`)
    //         } catch (e) {
    //             logger.info(`the unexpected env connection info window is not shown`)
    //         }

    //         const { registerWindow, setWindowPosition } = require('./utils/ws-utils/ws-manager');
    //         await registerWindow('Workstation Main Window');
    //         await setWindowPosition('Workstation Main Window', 52, 52)

    //         // Initialize a CEF webview
    //         const initializeWebView = require('./utils/ws-utils/initializeWebView');
    //         await initializeWebView();
    //     }, async () => {
    //         await workstationApp.sleep(1000)
    //     })

    //     // re-init browser
    //     // await browser.restart()
    //     // await restartBrowser
    //     // global.browser = await browser.forkNewDriverInstance()
    //     // logger.info('To disable angular again.')
    //     // browser.waitForAngularEnabled(false);

    //     await workstationApp.sleep(1000)
    //     for (const env of browser.params.envInfo) {
    //         logger.info(`Try to connect environment ${JSON.stringify(env)}`)
    //         const existingEnv = await getElement(identifiers.goTo('existingEnv', env.envName).getElement(), 5000)
    //         await doubleClick(existingEnv)
    //     }
    // }
});


After({ tags: '@hook_close_application_info_window1' }, async function () {
    try {
        await appInfo.closeApplicationInfoWindow("New Application updated")
        console.log('[INFO] application info window is open, close it.')
    } catch (e) {
        console.log('[INFO] application info window is already closed.')
    }

    await workstationApp.sleep(1000)
})

After({ tags: '@hook_close_application_info_window2' }, async function () {
    try {
        await appInfo.closeApplicationInfoWindow("New Application")
        console.log('[INFO] application info window is open, close it.')
    } catch (e) {
        console.log('[INFO] application info window is already closed.')
    }

    await workstationApp.sleep(1000)
})

After({ tags: '@hook_close_environment_info_window' }, async function () {
    try {
        await envWindow.clickCloseDialogButton("shared")
        console.log('[INFO] environment info window is open, close it.')
    } catch (e) {
        console.log('[INFO] environment info window is already closed.')
    }

    await workstationApp.sleep(1000)
})

After({ tags: '@hook_close_application_editor_dialog_if_necessary' }, async function () {
    try {
        await switchToWindow('New Application')
        await appWindow.clickCloseDialogButton('New Application')
        await unregisterWindow('New Application')
        console.log('[INFO] New application window is open, close it.')
    } catch (e) {
        console.log('[INFO] New application window is already closed.')
    }

    try {
        await switchToWindow('Edit Application')
        await appWindow.clickCloseDialogButton('Edit Application')
        await unregisterWindow('Edit Application')
        console.log('[INFO] Edit application window is open, close it.')
    } catch (e) {
        console.log('[INFO] Edit application window is already closed.')
    }

    await workstationApp.sleep(1000)
})

After({ tags: '@hook_close_application_editor_dialog_if_necessary_then_remove_env_connection_environment' }, async function () {
    try {
        await switchToWindow('New Application')
        await appWindow.clickCloseDialogButton('New Application')
        await unregisterWindow('New Application')
        console.log('[INFO] New application window is open, close it.')
    } catch (e) {
        console.log('[INFO] New application window is already closed.')
    }

    try {
        await switchToWindow('Edit Application')
        await appWindow.clickCloseDialogButton('Edit Application')
        await unregisterWindow('Edit Application')
        console.log('[INFO] Edit application window is open, close it.')
    } catch (e) {
        console.log('[INFO] Edit application window is already closed.')
    }

    await workstationApp.sleep(1000)

    try {
        await switchToWindow('Workstation Main Window')
        await mainWindow.smartTab.scrollOnSmartTab('up')
        await mainWindow.smartTab.selectTab('Environments')
        if (await mainWindow.mainCanvas.envSection.isEnvAdded('z-env-connection')) {
            await mainWindow.mainCanvas.envSection.removeEnv('z-env-connection')
            console.log('[INFO] Remove extra environment used for Environment Connection testing')
        } else {
            console.log('[INFO] Could not find extra environment used for Environment Connection testing, moving forward with testing')
        }
    } catch (e) {
        console.log('[ERROR] Failed to remove Environment Connection testing environment')
    }

    await workstationApp.sleep(1000)
})

After({ tags: '@hook_clean_content_groups' }, async function () {
    const { envUrl, userName, userPwd } = browser.params.envInfo[0]
    try {
        await cleanCustomAppAPI({
            baseUrl: envUrl, credentials: { username: userName, password: userPwd },
            except: wsConfig.defaultApplicationName
        })
    } catch (e) {
        console.log('[ERROR] Failed to clean custom apps in after hook.')
    }
    try {
        await cleanContentGroupAPI({
            baseUrl: envUrl, credentials: { username: userName, password: userPwd },
            except: wsConfig.contentGroupNotDelete
        })
        console.log('[INFO] Clean content groups in after hook.')
    } catch (e) {
        console.log('[ERROR] Failed to clean content groups in after hook.')
    }

    await workstationApp.sleep(1000)
})
