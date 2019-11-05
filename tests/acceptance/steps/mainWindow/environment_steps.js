
const { Given, When, Then } = require('cucumber');

  When(/^I add a new environment named "([^"]*)" with url "([^"]*)"$/, async function (envName, envUrl) {
    return mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl);
  });

  When(/^I login with "([^"]*)" mode using name "([^"]*)" and password "([^"]*)"$/, async function (loginMode, userName, userPwd) {
    if(userPwd==='blank')
      userPwd = "";
    return mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd);
  });

  Then(/^I select project "([^"]*)"$/, async function (projectName) {
    return mainWindow.mainCanvas.envSection.chooseProject(projectName);
  });

  When('I click OK to connect after selecting project', async function () {
    return mainWindow.mainCanvas.envSection.clickOkToConnect();
  });

  Then(/^I remove environment "([^"]*)"$/, async function (envName) {
    if (mainWindow.mainCanvas.envSection.isEnvAdded(envName)) {
      return mainWindow.mainCanvas.envSection.removeEnv(envName);
    } else {
      console.error(`WARNING: No environment present with name ${envName}`);
    }
  });

  When(/^I configure LDAP service on env "([^"]*)"$/, async function(envName){
    return mainWindow.mainCanvas.envSection.configureLdapService(envName);
  })

  Then('I disconnect environment', async function(){
    return mainWindow.mainCanvas.envSection.disconnectEnv(browser.params.envInfo[0].envName);
  })

  Then(/^I connect existing environment "([^"]*)"$/, async function(name){
    return mainWindow.mainCanvas.envSection.connectExistingEnv(name);
  })

  When(/^I import LDAP users on env "([^"]*)"$/, async function(envName){
    return mainWindow.mainCanvas.envSection.importLdapUsers(envName);
  })

  Then(/^"([^"]*)" is connected$/, async function (envName) {
    return expect(mainWindow.mainCanvas.envSection.isEnvAdded(envName)).become(true);
  });
