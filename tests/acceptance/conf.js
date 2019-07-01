// Enable ES6 for Protractor
require('@babel/register');
require('core-js/stable');
require('regenerator-runtime');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const parseArguments = require('./utils/envUtils/parseArguments');
const customArgObj = parseArguments();

exports.config = {
  directConnect: true,
  // use custom chrome driver
  chromeDriver: (process.platform === 'win32') ? "3rdParty/windows/chromedriver.exe" : "3rdParty/mac/chromedriver",
  capabilities:
  {
    'browserName': 'chrome',
    'chromeOptions': {
      // the hardcoded remote debug devtool
      'debuggerAddress': '127.0.0.1:54213'
    }
  },

  resultJsonOutputFile: 'report.json',

  SELENIUM_PROMISE_MANAGER: false,

  getPageTimeout: 60000,
  allScriptsTimeout: 500000,

  // for protractor-cucumber
  framework: 'custom', // set to "custom" instead of cucumber.
  frameworkPath: require.resolve('protractor-cucumber-framework'), // path relative to the current config file

  specs: [
    'features/*.feature' // Specs here are the cucumber feature files
  ],

  // cucumber command line options
  cucumberOpts: {
    require: './features/step_definitions/**/*.js',  // require step definition files before executing features
    format: ["pretty", "json:Cucumber.json"],            // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    // tags: ['@workstation'],
    profile: false,
    'no-source': true
  },

  // parameters with default values
  params: customArgObj.params,

  // Launch workstation and initialize a CEF webview for Protractor to connect to.
  // params are not available in beforeLaunch() method.
  beforeLaunch: async () => {
    // setting global variables
    global.expect = chai.expect;

    // if launch Workstation needed
    if(customArgObj.args.launchWS) {
      global.workstationPath = (process.platform === 'win32') ? customArgObj.args.appPath['windows'] : customArgObj.args.appPath['mac'];
      global.windowsMap = new Map();

      // setting globale variables
      const constants = require('./utils/envUtils/constants');
      ({
        MAC_XPATH: global.MAC_XPATH,
        OSType: global.OSType,
      } = constants);

      // Start Workstation. 
      // This workstation driver is stored globally to be used anywhere else.
      // For windows, the Main Workstation Window handle is registered globally
      const startWorkstation = require('./utils/wsUtils/startWorkstation');
      global.workstationApp  = await startWorkstation();
      if (OSType === 'windows') {
        const {registerWindow} = require('./utils/wsUtils/windowHelper');
        await registerWindow('Workstation Main Window');
      }
      // Initialize a CEF webview
      const initializeWebView = require('./utils/wsUtils/initializeWebView');
      await initializeWebView();
    }
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false);

    // set Cucumber Step Timeout
    let { setDefaultTimeout } = require('cucumber');
    setDefaultTimeout(60 * 1000);// 60 seconds 
    
    // build web view page objects
    const PageBuilder = require('./pages/webPages/PageBuilder');
    ({ quickSearchPage, hyperPage } = PageBuilder());

    // build windows for Workstation
    const WindowBuilder = require('./pages/nativePages/WindowBuilder'); //change here
    ({ envConnection, mainWindow, dossierEditor, toolbar, smartTab, menuBar, hyperCard } = WindowBuilder());

    if(customArgObj.args.connectEnv) {
      // TODO: remove exiting environment
      // connect to environment
      for(let envIndex=0; envIndex<browser.params.envInfo.length; envIndex++) {
        ({envName, envUrl, loginMode, userName, userPwd, projects} = browser.params.envInfo[envIndex]);
        await envConnection.connectEnv(envName, envUrl);
        await envConnection.loginToEnv(loginMode, userName, userPwd);
        for(let projectIndex=0;projectIndex<projects.length;projectIndex++){
          await envConnection.chooseProject(projects[projectIndex]);
        }
        await envConnection.clickOkToConnect();
      }

      // first-time cache generation for mac (temporary)
      if (OSType === 'mac') {
        await smartTab.selectTab('Dossiers');
        await smartTab.app.sleep(30000);
      }
    }
  },

  onComplete: async () => {
    if (customArgObj.args.removeEnv) {
      // remove environment
      await smartTab.selectTab('Environments')
      for(let envIndex=0; envIndex<browser.params.envInfo.length; envIndex++) {
        await envConnection.removeEnv(browser.params.envInfo[envIndex].envName)
      }
    }
  },

  afterLaunch: () => {
    // quit Workstation
    const quitWorkstation = require('./utils/wsUtils/quitWorkstation');
    return quitWorkstation();
  }

}
