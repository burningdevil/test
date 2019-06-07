import RootApp from './RootApp';
const env = XPATH['env'];
const wd = require('wd');

export default class AddEnv extends RootApp {

  // ** Locators ** //
  async getAddNewEnv() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Add New Environment Connection' },
          { method: 'ClassName', value: 'Button' } 
        ]},
      mac: { xpath: env.addNewEnv}
    });
  }

  async getConnectDialog() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' }
        ]},
      mac: { xpath: env.connectDialog}
    });
  }

  async getInputEnvName() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Environment Name Field' }
        ]},
      mac: { xpath: env.inputEnvName}
    });
  }

  async getInputEnvUrl() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Dossier Web Url Field' }
        ]},
      mac: { xpath: env.inputEnvUrl}
    });
  }

  async getLoginMode(mode) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: mode }
        ]},
      mac: { 
        xpath: env.loginMode.replace('ReplaceMe', mode)}
    });
  }

  // continue to connect after providing environment information and selecting login mode
  async getContinueToConnect() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Continue' }
        ]},
      mac: { xpath: env.continueToConnect }
    });
  }

  async getInputUserName() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Username Field' }
        ]},
      mac: { xpath: env.userName }
    });
  }

  async getInputUserPwd() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'PasswordBox' }
        ]},
      mac: { xpath: env.userPwd }
    });
  }

  // connect after providing login information
  async getLoginToConnect() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Connect' }
        ]},
      mac: { xpath: env.connect }
    });
  }

  async getProjectList() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Select Applications'  },
          { method: 'ClassName', value: 'ListBox' }
        ]},
      mac: { xpath: env.projectList }
    });
  }

  async getProjectByName(applicationName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Select Applications' },
          { method: 'Name', value: applicationName }
        ]},
      mac: { xpath: env.selectProject.replace('ReplaceMe', applicationName) }
    });
  }

  // connect after selecting Project(s)
  async getOKToConnect() {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Select Applications' },
          { method: 'Name', value: 'OK' }
        ]},
      mac: { xpath: env.OKToConnect }
    });
  }

  async getExistingEnv(environmentName) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: 'Available Environments' },
          { method: 'Name', value: `${environmentName}\nRestEnvironment` }
        ]},
      mac: { xpath: env.existingEnv.replace('ReplaceMe',environmentName) }
    });
  }

  async getEnvContextOption(option) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: option }
        ]},
      mac: { xpath: env.envContextOption.replace('ReplaceMe', option) }
    });
  }

  // ** Actions ** //
  // connect to environment with the name and url provided
  async connectEnv(envName, envUrl) {
     console.log(`connecting to environment`);

      // bring up 'add new environment' dialog
      await this.moveToAndClick(await this.getAddNewEnv());

      // input environment name
      await this.moveToAndSendKey(await this.getInputEnvName(), envName);

      // input environment Url
      let envUrlElem = await this.getInputEnvUrl();
      await envUrlElem.moveTo(); 
      await this.app.sleep(100);
      // mac version will automatically dismiss the colon, 
      // that's why you see the wired implementation here to use Shift + Semicolon to type colon
      let envUrlSplited = envUrl.split(':');
      await envUrlElem.type(envUrlSplited[0]);
      await envUrlElem.type(wd.SPECIAL_KEYS["Shift"] + wd.SPECIAL_KEYS["Semicolon"] + wd.SPECIAL_KEYS["Shift"]);
      await envUrlElem.sendKeys(envUrlSplited[1]);
      return this.app.sleep(1000);
    // await this.app.waitFor(isEnabled(await this.getContinueToConnect()),1000).should.eventually.be.ok;
}

  async loginToEnv(loginMode, userName, userPwd) {
    await this.moveToAndClick(await this.getLoginMode(loginMode));
    await this.moveToAndClick(await this.getContinueToConnect());
    await this.moveToAndSendKey(await this.getInputUserName(), userName);
    await this.moveToAndSendKey(await this.getInputUserPwd(), userPwd);
    await this.moveToAndClick(await this.getLoginToConnect());
    return this.app.sleep(2000);
  }

  async chooseProject(projectName) {
    // select application
    await this.moveToAndClick(await this.getProjectByName(projectName));
    // Ok to connect
    await this.moveToAndClick(await this.getOKToConnect());
    return this.app.sleep(5000);
  }

  async removeEnv(name) {
    let existingEnv = await this.getExistingEnv(name);
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getEnvContextOption('Remove'));
    return this.app.sleep(8000);
  }
}


