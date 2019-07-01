
const { Given, When, Then } = require('cucumber');

// ** Environment Related ** //
  When('I add a new environment named {envName} with url {envUrl}', async function (envName, envUrl) {
    return envConnection.connectEnv(envName, envUrl);
  });
  
  When('I login with {loginMode} mode using name {userName} and password {userPwd}', async function (loginMode, userName, userPwd) {
    return envConnection.loginToEnv(loginMode, userName, userPwd);
  });
  
  Then('I select project {projectName}', async function (projectName) {
    return envConnection.chooseProject(projectName);
  });
  
  Then('I click OK to connect after selecting project(s)', async function () {
    return envConnection.clickOkToConnect();
  });
  
  Then('I remove environment {envName}', async function (envName) {
    return envConnection.removeEnv(envName);
  });