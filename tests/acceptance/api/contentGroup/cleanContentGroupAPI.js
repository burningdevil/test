import authentication from '../authentication'
import logout from '../logout'
import getContentGroups from './getContentGroups'
import deleteContentGroupById from './deleteContentGroupById';
import { groupLog, groupLogEnd } from '../../config/consoleFormat';


// delete all custom apps except the given custom app
export default async function cleanContentGroupAPI({ baseUrl, credentials, except }) {
    groupLog()
    const session = await authentication({ baseUrl, authMode: 1, credentials })
    const contentGroups = await getContentGroups({ baseUrl, session })
    for (const contentGroup of contentGroups) {
        if (contentGroup.name === except) continue;
        await deleteContentGroupById({ baseUrl, session, contentGroupId: contentGroup.id })
    }
    await logout({ baseUrl, session });
    groupLogEnd()
}