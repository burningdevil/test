const request = require('request');
const rallyConfig = require('./rallyConfig');

module.exports = function createDefect({ tcUrl, description, details, release, build }) {
  const options = {
    url: rallyConfig.apiUrl + '/defect/create',
    method: 'POST',
    headers: {
      'zsessionid': rallyConfig.rallyApiKey
    },
    json: {
      'Defect': {
        'Name': '[Automation] Failed Test Case: ' + description,
        'Project': rallyConfig.defectInfo.Project,
        'Description': details,
        'FoundInBuild': build,
        'c_FoundInRelease': release,
        'State': rallyConfig.defectInfo.State,
        'ScheduleState': rallyConfig.defectInfo.ScheduleState,
        'Priority': rallyConfig.defectInfo.Priority,
        'c_FindingSource': rallyConfig.defectInfo.FindingSource,
        'c_IssueCategory': rallyConfig.defectInfo.IssueCategory,
        'c_Regression': rallyConfig.defectInfo.Regression,
        'c_UCProduct': rallyConfig.defectInfo.UCProduct,
        'c_UPCModule': rallyConfig.defectInfo.UPCModule,
        'c_UPCComponent': rallyConfig.defectInfo.UPCComponent,
        'TestCase': tcUrl
      }
    }
  };

  return new Promise((fulfill, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        console.info(`Creating defect request has succeeded: ${release}, ${build}`);
        fulfill(body);
      } else {
        console.error(`Creating defect request has failed: ${release}, ${build}. Error: ${error}`);
        reject(error);
      }
    });
  });
};




