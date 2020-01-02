require('@babel/register')
require('core-js/stable')
require('regenerator-runtime')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const parseArguments = require('./utils/envUtils/parseArguments')
const customArgObj = parseArguments()

exports.config = {
  directConnect: true,
  // use custom chrome driver
  chromeDriver: process.platform === 'win32' ? '3rdParty/windows/chromedriver.exe' : '3rdParty/mac/chromedriver',
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // the hardcoded remote debug devtool
      debuggerAddress: '127.0.0.1:54213'
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
    require: ['./steps/env.js', './steps/**/*.js'], // require step definition files before executing features
    format: ['json:reports/rallyReport/execReport.json', 'rerun:./reports/reruns/@rerun.txt'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    // tags: ['@debug'],
    profile: false,
    'fail-fast': true,
    'no-source': true
  },

  // parameters with default values
  params: customArgObj.params,

  // Launch workstation and initialize a CEF webview for Protractor to connect to.
  // params are not available in beforeLaunch() method.
  beforeLaunch: async () => {
    // customArgObj will also be used in World.js for UB tests
    global.customArgObj = customArgObj

    // setting global variables
    global.expect = chai.expect

    // if launch Workstation needed
    if (customArgObj.args.launchWS) {
      global.workstationPath = process.platform === 'win32' ? customArgObj.args.appPath.windows : customArgObj.args.appPath.mac
      global.windowsMap = new Map()

      // setting global variables
      const variables = require('./utils/envUtils/constants')
      let RESET_ENV
      ({ MAC_XPATH: global.MAC_XPATH, MAC_XPATH_GENERAL: global.MAC_XPATH_GENERAL, OSType: global.OSType, RESET_ENV } = variables)

      global.MAC_VIEWMODE = 'iconView'

      // //Reset Environment
      if (customArgObj.args.removeEnv) {
        RESET_ENV()
      }

      // Start Workstation.
      // This workstation driver is stored globally to be used anywhere else.
      // For windows, the Main Workstation Window handle is registered globally
      const startWorkstation = require('./utils/wsUtils/startWorkstation')
      global.workstationApp = await startWorkstation()
      if (OSType === 'windows') {
        const { registerWindow } = require('./utils/wsUtils/windowHelper')
        await registerWindow('Workstation Main Window')
        // Initialize a CEF webview for Windows
        // For Mac, as long as the Main Window is launched, there will be Quick Search WebView
        const initializeWebView = require('./utils/wsUtils/initializeWebView')
        await initializeWebView()
      }
    }
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)

    // build page objects for native and webviews
    const PageBuilder = require('./pages/PageBuilder')
    workstationApp.pageObj = PageBuilder()
    const { mainWindow } = workstationApp.pageObj
    /* eslint-disable no-unused-vars */
    const {
      dialogs,
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
      governingSettingsPage
    } = PageBuilder()
    /*  eslint-disable no-unused-vars */

    if (customArgObj.args.connectEnv) {
      // TODO: remove exiting environment
      // connect to environment
      for (let envIndex = 0; envIndex < browser.params.envInfo.length; envIndex++) {
        const { envName, envUrl, loginMode, userName, userPwd, projects } = browser.params.envInfo[envIndex]
        // this check should timeout quick
        const envNotExist = await mainWindow.mainCanvas.envSection.isEnvRemoved(envName, 1000)
        if (!envNotExist) {
          await mainWindow.mainCanvas.envSection.removeEnv(envName)
          // this one should have bigger timeout as the actual remove may take some time
          await mainWindow.mainCanvas.envSection.isEnvRemoved(envName, 4000)
        }
        await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
        await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
        for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
          await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
        }
        await mainWindow.mainCanvas.envSection.clickOkToConnect()
      }
    }

    // get PID list of workstation and workstation helpers
    if (customArgObj.args.ubConf.enableUB) {
      const { getWorkstationPID, getWorkstationHelpersPID } = require('./utils/wsUtils/getPIDs')
      const workstationPidList = await getWorkstationPID()
      const workstationHelperPidList = await getWorkstationHelpersPID()
      global.workstationPidLists = {
        workstationPidList,
        workstationHelperPidList
      }
      console.log('global: the pid of workstation is: ' + workstationPidList)
      // init ubData
      global.ubData = []
    }
  },

  onComplete: async () => {
    if (customArgObj.args.removeEnv) {
      try {
        // remove environment
        await mainWindow.smartTab.selectTab('Environments')
        for (let envIndex = 0; envIndex < browser.params.envInfo.length; envIndex++) {
          await mainWindow.mainCanvas.envSection.removeEnv(browser.params.envInfo[envIndex].envName)
          await mainWindow.mainCanvas.envSection.isEnvRemoved(browser.params.envInfo[envIndex].envName, 4000)
        }
      } catch (e) {
        console.info('Failed to manually remove environment, moving to afterLaunch')
      }
    }

    // quit Workstation
    if (customArgObj.args.quitWS) {
      try {
        const quitWorkstation = require('./utils/wsUtils/quitWorkstation')
        await quitWorkstation()
      } catch (e) {
        console.info('Failed to manually quit Workstation, moving to afterLaunch')
      }
    }
  },

  afterLaunch: async exitCode => {
    // generate single run UB report. However, if cucumber encountered error, don't generate report
    if (customArgObj.args.ubConf.enableUB && exitCode === 0) {
      // clear data in raw ub report
      const fs = require('fs')

      try {
        fs.unlinkSync(`${customArgObj.args.ubConf.ubReportPath}`)
      } catch (err) {
        console.info(`Failed to remove the raw ub report ${customArgObj.args.ubConf.ubReportPath}, maybe it's already removed`)
      }

      // generate the ub report
      console.info(`generating ${customArgObj.args.ubConf.ubReportPath}`)
      fs.appendFileSync(`${customArgObj.args.ubConf.ubReportPath}`, JSON.stringify(ubData, null, 2), 'UTF-8')
    }

    // force quite the Workstation process
    if (customArgObj.args.quitWS) {
      const { getWorkstationPID } = require('./utils/wsUtils/getPIDs')
      const quitWorkstationPidList = await getWorkstationPID()
      if (quitWorkstationPidList.length !== 0) {
        console.log(`after launch, force quiting workstation, the workstation pid is: ${quitWorkstationPidList}`)
        console.log('force quiting workstation')
        // kill workstation
        const execSync = require('child_process').execSync
        if (OSType === 'windows') {
          execSync(`taskkill /F /PID ${quitWorkstationPidList}`, { encoding: 'utf-8' })
        } else {
          execSync(`kill -9 ${quitWorkstationPidList}`, { encoding: 'utf-8' })
        }
      }
    }
  }
}
