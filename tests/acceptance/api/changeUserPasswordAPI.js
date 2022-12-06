import authentication from './authentication'
import logout from './logout'
import getUserInfoAPI from './getUserInfoAPI'
import changeUserPwd from './changeUserPwd';
import { groupLog, groupLogEnd } from '../config/consoleFormat';


async function changeUserPasswordAPI({ baseUrl, credentials, pwd }) {
    groupLog();
    const session = await authentication({ baseUrl, authMode: 1, credentials })
    const userInfo = await getUserInfoAPI({ baseUrl, session })
    await changeUserPwd({ baseUrl, session, userId: userInfo.id, newPwd: pwd })
    await logout({ baseUrl, session });
    groupLogEnd();
}

module.exports = changeUserPasswordAPI


