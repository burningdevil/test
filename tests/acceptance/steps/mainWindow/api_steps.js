import certifyApi from '../../api/certifyDossierAPI'
import cleanCustomAppAPI from '../../api/cleanCustomAppAPI'
import cleanCustomPalettesAPI from '../../api/cleanCustomPalettesAPI'
const { Given, When, Then } = require('cucumber')
const { mainWindow } = pageObj
const { envUrl, userName, userPwd } = browser.params.envInfo[0]

When('I certify dossier is {string} by project is {string} by api', async function (objId, projId) {
    await certifyApi({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        projectId: projId, objectId: objId, flag: true
    })
    return mainWindow.app.sleep(1000)
})

When('I decertify dossier is {string} by project is {string} by api', async function (objId, projId) {
    await certifyApi({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        projectId: projId, objectId: objId, flag: false
    })
    return mainWindow.app.sleep(1000)
})

Given('I remove all custom apps except {string} by api', async function (appNotDelete) {
    await cleanCustomAppAPI({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        except: appNotDelete
    })
    return mainWindow.app.sleep(1000)
})

Given('I remove all custom color palettes by api', async function () {
    await cleanCustomPalettesAPI({
        baseUrl: envUrl,
        credentials: { username: userName, password: userPwd }
    })
    return mainWindow.app.sleep(1000)
})
