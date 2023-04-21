import authentication from './authentication'
import logout from './logout'
import getCustomAppsAPI from './getCustomAppsAPI'
import deleteCustomAppAPI from './deleteCustomAppAPI';
import { groupLog, groupLogEnd } from '../config/consoleFormat';


// delete all custom apps except the given custom app
export default async function cleanCustomAppAPI({ baseUrl, credentials, except }) {
    groupLog()
    const session = await authentication({ baseUrl, authMode: 1, credentials })
    const applications = await getCustomAppsAPI({ baseUrl, session })

    for (const app of applications) {
        if (app.name === except) continue;
        await deleteCustomAppAPI({ baseUrl, session, appId: app.id, appName: app.name })
    }
    await logout({ baseUrl, session });
    groupLogEnd()
}
