import certifyApi from '../../api/certifyDossierAPI'
import cleanCustomAppAPI from '../../api/cleanCustomAppAPI'
import cleanCustomPalettesAPI from '../../api/cleanCustomPalettesAPI'
import editLibraryEmbedding from '../../api/libraryembeding'
import cleanContentGroupAPI from '../../api/contentGroup/cleanContentGroupAPI'
import * as postBody from '../../api/data/embedding'

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

When('I modify embedding settings to {string} by api', async function (mode) {
    var embeddingObject = postBody.none_security
    if (mode === 'All') {
        embeddingObject = postBody.all_security
    } else if (mode === 'Specific') {
        embeddingObject = postBody.specific_security
    } else {
        embeddingObject = postBody.none_security
    }
    await editLibraryEmbedding({
        baseUrl: envUrl,
        credentials: { username: userName, password: userPwd },
        embeddingInfo: postBody.security
    })
    await editLibraryEmbedding({
        baseUrl: envUrl,
        credentials: { username: userName, password: userPwd },
        embeddingInfo: embeddingObject
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

Given('I remove all content groups except {string} by api', async function (contentGroupNotDelete) {
    await cleanContentGroupAPI({
        baseUrl: envUrl, credentials: { username: userName, password: userPwd },
        except: contentGroupNotDelete
    })
    return mainWindow.app.sleep(1000)
})


