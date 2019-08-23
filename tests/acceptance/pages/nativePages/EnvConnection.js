import RootApp from './RootApp';
const env = MAC_XPATH_GENERAL['env'];
const wd = require('wd');

export default class EnvConnection extends RootApp {

  // ** Locators ** //
  async getAddNewEnv() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Add New Environment Connection' },
          { method: 'ClassName', value: 'Button' }
        ]
      },
      mac: { xpath: MAC_XPATH_VIEWMODE['env'].addNewEnv }
    });
  }

  async getConnectDialog() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connection' }
        ]
      },
      mac: { xpath: env.connectDialog }
    });
  }

  async getInputEnvName() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connection' },
          { method: 'Name', value: 'Environment Name Field' }
        ]
      },
      mac: { xpath: env.inputEnvName }
    });
  }

  async getInputEnvUrl() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connection' },
          { method: 'Name', value: 'Dossier Web Url Field' }
        ]
      },
      mac: { xpath: env.inputEnvUrl }
    });
  }

  async getLoginMode(mode) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connection' },
          { method: 'Name', value: mode },
        ]
      },
      mac: { xpath: env.loginMode.replace(/ReplaceMe/g, mode) }
    });
  }

  // continue to connect after providing environment information and selecting login mode
  async getContinueToConnect() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connection' },
          { method: 'Name', value: 'Continue' }
        ]
      },
      mac: { xpath: env.continueToConnect }
    });
  }

  async getInputUserName() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Username Field' }
        ]
      },
      mac: { xpath: env.userName }
    });
  }

  async getInputUserPwd() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'ClassName', value: 'PasswordBox' }
        ]
      },
      mac: { xpath: env.userPwd }
    });
  }

  // connect after providing login information
  async getLoginToConnect() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connect to Environment' },
          { method: 'Name', value: 'Connect' }
        ]
      },
      mac: { xpath: env.connect }
    });
  }

  async getProjectList() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Select Applications' },
          { method: 'ClassName', value: 'ListBox' }
        ]
      },
      mac: { xpath: env.projectList }
    });
  }

  async getProjectByName(applicationName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Select Applications' },
          { method: 'Name', value: applicationName }
        ]
      },
      mac: { xpath: env.selectProject.replace(/ReplaceMe/g, applicationName) }
    });
  }

  // connect after selecting Project(s)
  async getOKToConnect() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Select Applications' },
          { method: 'Name', value: 'OK' }
        ]
      },
      mac: { xpath: env.OKToConnect }
    });
  }

  async getExistingEnv(environmentName) {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Available Environments' },
          { method: 'Name', value: `${environmentName}\nRestEnvironment` }
        ]
      },
      mac: { xpath: MAC_XPATH_VIEWMODE['env'].existingEnv.replace(/ReplaceMe/g, environmentName) }
    });
  }

  async getRemoveEnvOption() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Remove Environment' }
        ]
      },
      mac: { xpath: MAC_XPATH_VIEWMODE['env'].envContextOption.replace(/ReplaceMe/g, 'Remove') }
    });
  }

  async getDisconnectEnvOption() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Disconnect Environment' }
        ]
      },
      mac: { xpath: MAC_XPATH_VIEWMODE['env'].envContextOption.replace(/ReplaceMe/g, 'Disconnect') }
    });
  }

  async getConnectEnvOption() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Connect to Environment' }
        ]
      },
      mac: { xpath: MAC_XPATH_VIEWMODE['env'].envContextOption.replace(/ReplaceMe/g, 'Connect') }
    });
  }

  async getRememberMe() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Remember Me' }
        ]
      },
      mac: { xpath: env.rememberMe }
    });
  }

  async getRememberProjectSelections() {
    return this.getNativeElement({
      windows: {
        locators: [
          { method: 'Name', value: 'Remember Selected Applications' }
        ]
      },
      mac: { xpath: env.rememberSelectedApplications }
    });
  }

  // ** Actions ** //
  // connect to environment with the name and url provided
  async connectEnv(envName, envUrl) {
    // bring up 'add new environment' dialog
    await this.moveToAndClick(await this.getAddNewEnv());

    // input environment name
    await this.moveToAndSendKey(await this.getInputEnvName(), envName);

    // input environment Url
    let envUrlElem = await this.getInputEnvUrl();

    // mac version will automatically dismiss the colon, 
    // that's why you see the wired implementation here to use Shift + Semicolon to type colon
    if (OSType === 'windows') {
      await this.moveToAndSendKey(envUrlElem, envUrl);
    } else {
      await envUrlElem.moveTo();
      await this.app.sleep(100);
      let envUrlSplitedList = envUrl.split(':');
      for (let i = 0; i < envUrlSplitedList.length; i++) {
        if (i < envUrlSplitedList.length - 1) {
          await envUrlElem.type(envUrlSplitedList[i]);
          await envUrlElem.type(wd.SPECIAL_KEYS["Shift"] + wd.SPECIAL_KEYS["Semicolon"] + wd.SPECIAL_KEYS["Shift"]);
        } else {
          await envUrlElem.type(envUrlSplitedList[i]);
        }
      }
      return this.app.sleep(1000);
    }
    // await this.app.waitFor(isEnabled(await this.getContinueToConnect()),1000).should.eventually.be.ok;
  }

  async loginToEnv(loginMode, userName, userPwd) {
    await this.moveToAndClick(await this.getLoginMode(loginMode));
    await this.moveToAndClick(await this.getContinueToConnect());
    await this.moveToAndSendKey(await this.getInputUserName(), userName);
    await this.moveToAndSendKey(await this.getInputUserPwd(), userPwd);
    await this.moveToAndClickAtPosition(await this.getRememberMe());
    return this.moveToAndClick(await this.getLoginToConnect());
  }

  async chooseProject(projectName) {
    // select application
    await this.moveToAndClick(await this.getProjectByName(projectName));
    await this.moveToAndClickAtPosition(await this.getRememberProjectSelections());
    return this.app.sleep(100);
  }

  async clickOkToConnect() {
    // Ok to connect after choosing projects
    await this.moveToAndClick(await this.getOKToConnect());
    return this.app.sleep(1000);
  }

  async removeEnv(name) {
    let existingEnv = await this.getExistingEnv(name);
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getRemoveEnvOption());
  }

  async disconnectEnv(name) {
    let existingEnv = await this.getExistingEnv(name);
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getDisconnectEnvOption());
    return this.app.sleep(8000);
  }

  async connectEnvFromContextMenu(name) {
    let existingEnv = await this.getExistingEnv(name);
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getConnectEnvOption());
    await this.moveToAndClick(await this.getLoginToConnect());
    return this.app.sleep(8000);
  }

  async cacheAllTabs() {
    // first-time cache generation for mac (if needed)
    if (OSType === 'mac') {
      await smartTab.selectTab('My Library');
      await smartTab.app.sleep(4000);
      await smartTab.selectTab('Dossiers');
      await smartTab.app.sleep(4000);
      await smartTab.selectTab('Documents');
      await smartTab.app.sleep(4000);
      await smartTab.selectTab('Cards');
      await smartTab.app.sleep(4000);
      await smartTab.selectTab('Reports');
      await smartTab.app.sleep(4000);
      await smartTab.selectTab('Datasets');
      return smartTab.app.sleep(4000);
    }

  }

  async isEnvAdded(envName) {
    try {
      let env = await this.getExistingEnv(envName);
      return env.isDisplayed();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  //Commenting below code because there is no way to tell which environment connect info it is grabbing, 
  //as while writting xpath we can not pass in the both env name and connection status at the same time becuase they both are children of a single parent.
  //to be able to grab connect status of a specific environment, connection status should be child of env name.

  // async isEnvDisconnected(envName) {
  //   try {
  //     let env = await this.getExistingEnv(envName);
  //     let connectionInfo = await this.getExistingEnv('Disconnected')
  //     if (env.isDisplayed() && connectionInfo.isDisplayed()) {
  //       return true;
  //     } else {
  //       console.error('Enviroment is not disconnected.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   }
  // }

  // async isEnvConnected(envName) {
  //   try {
  //     let env = await this.getExistingEnv(envName);
  //     let connectionInfo = await this.getExistingEnv('Connected')
  //     if (env.isDisplayed() && connectionInfo.isDisplayed()) {
  //       return true;
  //     } else {
  //       console.error('Enviroment is not connected.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   }
  // }
}


