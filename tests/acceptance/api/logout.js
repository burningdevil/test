import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat';

export default async function logout({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'logout',
        method: 'POST',
        headers: {
            'x-mstr-authtoken': session.token,
            'cookie': session.cookie
        },
        form: {
            'sessionId': session.token
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            console.log('Cookie for', options.url, 'is', JSON.stringify(session));
            if (!error) {
                if (response.statusCode === 302 || response.statusCode === 303) { // response code changed to 303 on container env
                    successLog('Logout is successful.');
                    setTimeout(() => { resolve(); }, 1000);
                } else {
                    errorLog('Logout failed. status code:', response.statusCode);
                    errorLog('Logout failed. message:', body);
                    reject(body);
                }
            } else {
                errorLog('Logout failed.');
                errorLog(error)
                reject(error);
            }
        });
    });
}
