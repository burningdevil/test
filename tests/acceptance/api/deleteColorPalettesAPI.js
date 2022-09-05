import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function deleteColorPalettesAPI({ baseUrl, session, paletteId, paletteName }) {
    const options = {
        url: baseUrl + `api/objects/${paletteId}?type=71`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-deleteColorPalette] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Delete color palette of id='${paletteId}', name='${paletteName}' successfully.`);
                } else {
                    errorLog(`Delete color palette of id'${paletteId}' failed. Status code: ${response.statusCode}. Message: ${body}`);
                }
                setTimeout(() => { resolve(body); }, 1000);
            } else {
                errorLog(`Delete color palette of id '${appId}' name '${paletteName}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}