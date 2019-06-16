const request = require('request');
const rallyConfig = require('./rallyConfig');

module.exports = function getTCResultURL(testCaseId) {
    const options = {
        url: rallyConfig.apiUrl + `/testcase/?query=(FormattedID%20%3D%20%22${testCaseId}%22)`,
        method: 'GET',
        headers: {
            'zsessionid': rallyConfig.rallyApiKey
        }
    };

    return new Promise((fulfill, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    const bodyJson = JSON.parse(body);
                    const tcUrl = bodyJson.QueryResult.Results[0]._ref;
                    fulfill(tcUrl);
                } catch (err) {
                    reject(err);
                }
            } else {
                console.error(`Sending request to Rally REST Server has failed. Test Case ID: ${testCaseId} Error: ${error}`);
                reject(error);
            }
        });
    });
};