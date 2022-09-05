import request from 'request'
import { errorLog, successLog } from '../config/consoleFormat';

export default async function getColorPalettesAPI({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/palettes`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'Cookie': session.cookie
        }
    };
    console.log("[INFO] [api-getColorPalettes] url=" + options.url)
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const data = JSON.parse(body)
                    successLog(`Get color palettes successfully.`);
                    setTimeout(() => { resolve(data.palettes); }, 1000);
                } else {
                    errorLog(`Get color palettes failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Get color palettes failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}