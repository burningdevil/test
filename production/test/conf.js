// Enable ES6 for Protractor
require('@babel/register');
require('@babel/polyfill');

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
  params: {
    
  },

  beforeLaunch: async () => {
    // get constants based on the runtime environment
    global.workstationPath = require('yargs').argv.path;

    const constants = require('./utils/envUtils/constants');
    global.XPATH = constants.APP_XPATH;
    global.OSType = constants.APP_OS;

    const startWorkstation = require('./utils/wsUtils/startWorkstation');
    const initializeWebView = require('./utils/wsUtils/initializeWebView');
    // global workstationApp will be used later
    global.workstationApp  = await startWorkstation();
    await initializeWebView();
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false);
    
    // build web view page objects
    const PageBuilder = require('./pages/webPages/PageBuilder');
    ({ quickSearchPage } = PageBuilder());

    // build windows for Workstation
    const WindowBuilder = require('./pages/nativePages/WindowBuilder'); //change here
    ({ addEnv, mainWindow, dossierEditor, toolbar, smartTab } = WindowBuilder());

    // Set Cucumber Step Timeout
    let { setDefaultTimeout } = require('cucumber');
    setDefaultTimeout(60 * 1000);// 60 seconds 
  },

  onComplete: () => {
    const quitWorkstation = require('./utils/wsUtils/quitWorkstation');
    return quitWorkstation();
  }
}
