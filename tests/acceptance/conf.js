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
    // require: './features/step_definitions/**/*.js',  // require step definition files before executing features
    require: './steps/**/*.js',  // require step definition files before executing features
    format: ["pretty", "json:Cucumber.json"],            // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    // tags: ['@settings'],
    profile: false,
    'no-source': true
  },

  // parameters with default values
  params: customArgObj.params,

  // Launch workstation and initialize a CEF webview for Protractor to connect to.
  // params are not available in beforeLaunch() method.
  beforeLaunch: async () => {

    //customArgObj will also be used in World.js for UB tests
    global.customArgObj = customArgObj

    // setting global variables
    global.expect = chai.expect;

    // if launch Workstation needed
    if(customArgObj.args.launchWS) {
      global.workstationPath = (process.platform === 'win32') ? customArgObj.args.appPath['windows'] : customArgObj.args.appPath['mac'];
      global.windowsMap = new Map();

      // setting global variables
      const variables = require('./utils/envUtils/constants');
      ({
        MAC_XPATH: global.MAC_XPATH,
        MAC_XPATH_GENERAL: global.MAC_XPATH_GENERAL,
        OSType: global.OSType,
      } = variables);
      global.MAC_VIEWMODE = 'iconView'

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

    // build page objects for native and webviews
    const PageBuilder = require('./pages/PageBuilder');
    ({ dialogs,
      editor,
      hyperCard,
      mainWindow,
      rsdWindow,
      settingsPluginWindow,

      hyperPage,
      ldapPage,
      metricEditorPage,
      quickSearchPage,
      rsdPage,
      allSettingsPage,
      governingSettingsPage } = PageBuilder());

    if(customArgObj.args.connectEnv) {
      // TODO: remove exiting environment
      // connect to environment
      for(let envIndex=0; envIndex<browser.params.envInfo.length; envIndex++) {
        ({envName, envUrl, loginMode, userName, userPwd, projects} = browser.params.envInfo[envIndex]);
        await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl);
        await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd);
        for(let projectIndex=0;projectIndex<projects.length;projectIndex++){
          await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex]);
        }
        await mainWindow.mainCanvas.envSection.clickOkToConnect();
      }
    }


    //get PID list of workstation and workstation helpers
    if (customArgObj.args.ubConf.enableUB) {
      const psList = require('ps-list');
      let mylist = await psList(); 	//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
      let workstationPidList = [];
      let workstationHelperPidList = [];
      mylist.forEach(function (process) {
        //Mac
        if (process.name === "MicroStrategy Workstation") {
          workstationPidList.push(process.pid);
        }
        if (process.name === "MicroStrategy Workstation Helper") {
          workstationHelperPidList.push(process.pid);
        }
        //Windows
        if (process.name === "Workstation.exe") {
          workstationPidList.push(process.pid);
        }
        if (process.name === "CefSharp.BrowserSubprocess.exe") {
          workstationHelperPidList.push(process.pid);
        }
      });
      global.workstationPidLists = {
        workstationPidList,
        workstationHelperPidList
      };
      console.log("global: the pid of workstation is: " + workstationPidList);

      //init ubData
      global.ubData = [];

    }
  },

  onComplete: async () => {
    if (customArgObj.args.removeEnv) {
      // remove environment
      await mainWindow.smartTab.selectTab('Environments')
      for(let envIndex=0; envIndex<browser.params.envInfo.length; envIndex++) {
        await mainWindow.mainCanvas.envSection.removeEnv(browser.params.envInfo[envIndex].envName)
      }
    }
  },

  afterLaunch: async (exitCode) => {

    //generate single run UB report. However, if cucumber encountered error, don't generate report
    if (customArgObj.args.ubConf.enableUB && exitCode === 0) {
      //clear data in raw ub report
      let fs = require('fs');

      try{
        fs.unlinkSync(`${customArgObj.args.ubConf.ubReportPath}`);
      } catch(err) {
        console.info(`Failed to remove the raw ub report ${customArgObj.args.ubConf.ubReportPath}, maybe it's already removed`);
      }

      //generate the ub report
      console.info(`generating ${customArgObj.args.ubConf.ubReportPath}`);
      fs.appendFileSync(`${customArgObj.args.ubConf.ubReportPath}`, JSON.stringify(ubData, null, 2), 'UTF-8');
    }

    // quit Workstation
    if (customArgObj.args.quitWS) {
      const quitWorkstation = require('./utils/wsUtils/quitWorkstation');
      await quitWorkstation();
    }

  }

}
