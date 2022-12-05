import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function changeUserPwd({ baseUrl, session, userId, newPwd }) {
    const options = {
        url: baseUrl + `api/users/${userId}/`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        },
        json: {
            operationList:
                [
                    {
                        op: 'replace',
                        path: '/password',
                        value: newPwd
                    }
                ]
        }
    };
    console.log("[INFO] [api-changeUserPassword] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Change user '${userId}' password successfully.`);
                } else {
                    errorLog(`Change user  '${userId}' successfully but it required login. Status code: ${response.statusCode}. Message: ${JSON.stringify(body)}`);
                }
                setTimeout(() => { resolve(body); }, 1000);
            } else {
                errorLog(`Change user '${userId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}