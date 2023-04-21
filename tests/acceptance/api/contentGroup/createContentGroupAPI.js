import authentication from '../authentication';
import logout from '../logout';
import createContentGroupWithoutContent from './createContentGroupWithoutContent';
import updateContents from './updateContents';
import { groupLog, groupLogEnd } from '../../config/consoleFormat';

// create content group
export default async function createContentGroupAPI(
    { baseUrl, credentials, contentGroupInfo, contentInfo }
) {
    groupLog('createContentGroup by api');
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let contentGroupId = await createContentGroupWithoutContent({ baseUrl, session, contentGroupInfo });

    try {
        await updateContents({ baseUrl, session, contentGroupId, contentInfo });
    } catch (error) {
        console.log('Fail to update content');
    }
    await logout({ baseUrl, session });
    groupLogEnd();
    return contentGroupId;
}
