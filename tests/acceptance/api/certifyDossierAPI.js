import authentication from './authentication'
import logout from './logout'
import certifyDossier from './certifyDossier'
import objectInfoAPI from './objectInfoAPI';
import { groupLog, groupLogEnd } from '../config/consoleFormat';


// cerify/decerfify dossier/document
export default async function certifyApi({ baseUrl, credentials, projectId, objectId, flag }) {
    groupLog();
    const session = await authentication({ baseUrl, authMode: 1, credentials })
    const certifiedInfo = await objectInfoAPI({ baseUrl, session, projectId, objectId })
    if (certifiedInfo.certified !== flag) {
        await certifyDossier({ baseUrl, session, projectId, objectId, flag })
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
