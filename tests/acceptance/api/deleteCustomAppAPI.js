import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function deleteCustomApp({ baseUrl, session, appId, appName }) {
    const options = {
        url: baseUrl + `api/v2/applications/${appId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-deleteApplication] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Delete custom app of id='${appId}', name='${appName}' successfully.`);
                    setTimeout(() => { resolve(body); }, 1000);
                } else {
                    errorLog(`Delete custom app of id'${appId}' failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Delete custom app of object '${appId}' name='${appName} failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}