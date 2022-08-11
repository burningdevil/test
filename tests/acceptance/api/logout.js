import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat';

export default async function logout({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'logout',
        method: 'POST',
        headers: {
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        },
        form: {
            'sessionId': session.token
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 302 || response.statusCode === 303) { // response code changed to 303 on container env
                    successLog('Logout is successful.');
                    resolve();
                } else {
                    errorLog('Logout failed. status code:', response.statusCode);
                    errorLog('Logout failed. message:', body);
                    reject(body);
                }
            } else {
                errorLog('Logout failed.');
                reject(error);
            }
        });
    });
}
