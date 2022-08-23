import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function getCustomApps({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/v2/applications`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-getApplications] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const data = JSON.parse(body)
                    successLog(`Get applications successfully.`);
                    setTimeout(() => { resolve(data.applications); }, 1000);
                } else {
                    errorLog(`Get applications failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Get applications failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}