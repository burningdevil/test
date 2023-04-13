import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat';

export default async function authentication({ baseUrl, authMode, credentials }) {
    // initialize the jsession value from set cookie header once and use it across every other requests;
    let jsessionCookie = null;
    let authToken = null;

    const cookieJar = request.jar();
    const url = baseUrl + 'auth/login';

    const options = {
        url,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        form: {
            loginMode: authMode,
            username: credentials.username,
            password: credentials.password
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    jsessionCookie = cookieJar.getCookieString(url);
                    console.log('Cookie for', url, 'is', jsessionCookie);

                    if (response.statusCode === 204) {
                        authToken = response.headers['x-mstr-authtoken'];
                        successLog(`Creating session for user '${credentials.username}' is successful. AuthToken: ${authToken}`);
                        setTimeout(() => { resolve({ token: authToken, cookie: jsessionCookie }); }, 1000);
                    } else {
                        errorLog(`Authentication failed. Status code: ${response.statusCode}. Message: ${body}`);
                        reject(body);
                    }
                } catch (err) {
                    errorLog(`Authentication failed. Try & Catch Error: ${err}`);
                    reject(error);
                }
            } else {
                errorLog(`Authentication failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
