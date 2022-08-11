import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function certifyDossier({ baseUrl, session, projectId, objectId, flag }) {
    const options = {
        url: baseUrl + `api/objects/${objectId}/certify?type=55&certify=${flag}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-certifyDossier] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const data = JSON.parse(body)
                    successLog(`Certify object'${objectId}' is successful. dossier name = '${data.name}', certify info='${data.certifiedInfo.certified}'`);
                    setTimeout(() => { resolve(body); }, 1000);
                } else {
                    errorLog(`Certify object '${objectId}' failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Certify object '${objectId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}