import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function getUserInfoAPI({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/sessions/userInfo',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-getUserInfo] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const data = JSON.parse(body)
                    successLog(`Get user info successfully.`);
                    setTimeout(() => { resolve(data); }, 1000);
                } else {
                    errorLog(`Get user info failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Get user info failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}