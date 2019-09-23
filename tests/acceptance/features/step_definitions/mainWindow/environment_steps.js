
const { Given, When, Then } = require('cucumber');

  When('I add a new environment named {envName} with url {envUrl}', async function (envName, envUrl) {
    return envConnection.connectEnv(envName, envUrl);
  });

  When('I login with {loginMode} mode using name {userName} and password {userPwd}', async function (loginMode, userName, userPwd) {
    if(userPwd==='blank')
      userPwd = ""; 
    return envConnection.loginToEnv(loginMode, userName, userPwd);
  });

  Then('I select project {projectName}', async function (projectName) {
    return envConnection.chooseProject(projectName);
  });

  When('I click OK to connect after selecting project', async function () {
    return envConnection.clickOkToConnect();
  });

  Then('I remove environment {envName}', async function (envName) {
    if (envConnection.isEnvAdded(envName)) {
      return envConnection.removeEnv(envName);
    } else {
      console.error(`WARNING: No environment present with name ${envName}`);
    }
  });

  When('I configure LDAP service on env {envName}', async function(envName){
    return envConnection.configureLdapService(envName);
  })

  Then('I disconnect environment', async function(){
    return envConnection.disconnectEnv(browser.params.envInfo[0].envName);
  })

  Then('I connect existing environment {name}', async function(name){
    return envConnection.connectExistingEnv(name);
  })

  When('I import LDAP users on env {envName}', async function(envName){
    return envConnection.importLdapUsers(envName);
  })