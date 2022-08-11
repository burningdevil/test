import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function objectInfoAPI({ baseUrl, session, projectId, objectId }) {
    const options = {
        url: baseUrl + `api/objects/${objectId}?type=55`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-objectinfo] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const data = JSON.parse(body)
                    successLog(`Get object info of object '${objectId}' is successful.`);
                    setTimeout(() => { resolve(data.certifiedInfo); }, 1000);
                } else {
                    errorLog(`Get object info of object '${objectId}' failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Get object info of object '${objectId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}