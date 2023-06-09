require('@babel/register')
require('core-js/stable')
require('regenerator-runtime')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { join } = require('path');

const parseArguments = require('./utils/envUtils/parseArguments')
const { sleep } = require('./utils/generalUtils')
const customArgObj = parseArguments()
const fs = require('fs-extra')
const path = require('path')

exports.config = {
  plugins: [
    // {
    //   package: 'protractor-image-comparison',
    //   options: {
    //     baselineFolder: join(process.cwd(), './results/baseline/'),
    //     formatImageName: `{tag}`,
    //     screenshotPath: join(process.cwd(), './results/'),
    //     savePerInstance: true,
    //     autoSaveBaseline: true,
    //   },
    // },
  ],

  directConnect: true,
  // use custom chrome driver
  chromeDriver: process.platform === 'win32' ? '3rdParty/windows/chromedriver.exe' : '3rdParty/mac/chromedriver',
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // the hardcoded remote debug devtool
      debuggerAddress: `127.0.0.1:${customArgObj.args.cefPort}`
    }
  },

  resultJsonOutputFile: 'report.json',

  SELENIUM_PROMISE_MANAGER: false,

  getPageTimeout: 6000000,
  allScriptsTimeout: 50000000,

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
    // tags: ['@sanity'],
    profile: false,
    'fail-fast': false,
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
      (
        {
          MAC_XPATH: global.MAC_XPATH,
          MAC_XPATH_GENERAL: global.MAC_XPATH_GENERAL,
          OSType: global.OSType,
          RESET_ENV
        } = variables)

      global.MAC_VIEWMODE = 'iconView'

      global.enableUplodaVideo = false
      const { isVideoRecorderAvailable } = require('./utils/ciUtils/video-helper')
      global.videoRecord = customArgObj.videoRecord && isVideoRecorderAvailable()

      // init video recorder
      const { initVideoRecorder, recordVideo } = require('./utils/ciUtils/video-helper')
      if (global.videoRecord) {
        await initVideoRecorder()
        global.uploadVideoPath = customArgObj.uploadVideoPath
        if (global.uploadVideoPath !== undefined) global.enableUplodaVideo = true
        global.videoRecorderProcess = await recordVideo('video/before_launch', 'prepareEnv')
      }

      // //Reset Environment
      if (customArgObj.args.removeEnv) {
        RESET_ENV()
      }

      try {
        // Start Workstation.
        // This workstation driver is stored globally to be used anywhere else.
        // For windows, the Main Workstation Window handle is registered globally
        const startWorkstation = require('./utils/wsUtils/startWorkstation')
        global.workstationApp = await startWorkstation()
        // if (OSType === 'windows') {
        const { registerWindow, maximizeWindowByWindowName } = require('./utils/wsUtils/windowHelper')
        await registerWindow('Workstation Main Window')
        // if (OSType === 'windows') await maximizeWindowByWindowName('Workstation Main Window')
        // Initialize a CEF webview for Windows
        // For Mac, as long as the Main Window is launched, there will be Quick Search WebView
        const killMstrService = require('./utils/wsUtils/quitBackgroundService')
        await killMstrService()
        const initializeWebView = require('./utils/wsUtils/initializeWebView')
        await initializeWebView()
      } catch (e) {
        if (global.videoRecord) {
          const { uploadVideo, stopRecord } = require('./utils/ciUtils/video-helper')
          await stopRecord(global.videoRecorderProcess)
          if (global.enableUplodaVideo) {
            // upload prepareEnv video
            try {
              await sleep(1000)
              const videoMetadata = await uploadVideo(`video/before_launch/prepareEnv.mkv`, global.uploadVideoPath)
              console.log('upload video info: ', videoMetadata)
              const { url } = JSON.parse(videoMetadata)
              if (global.videoUploadURL === undefined) {
                global.videoUploadURL = url.substring(0, url.lastIndexOf('/'))
              }
            } catch (e) {
              console.log('upload video failed: ', e)
            }
          }
        }
        throw e
      }

    }
  },

  onPrepare: async () => {
    browser.waitForAngularEnabled(false)

    const newPwd = 'newman123'
    const changeUserPwdAPI = require('./api/changeUserPasswordAPI')
    await changeUserPwdAPI({
      baseUrl: browser.params.envInfo[0].envUrl,
      credentials: { username: browser.params.envInfo[0].userName, password: browser.params.envInfo[0].userPwd },
      pwd: newPwd
    })
    fs.outputFileSync(path.resolve('.', 'password.txt'), newPwd, 'utf8')
    browser.params.envInfo[0].userPwd = newPwd

    // build global page objects for native and webviews
    const PageBuilder = require('./pages/PageBuilder')
    global.pageObj = PageBuilder()
    const { mainWindow } = pageObj
    try {
      if (customArgObj.args.connectEnv) {
        // TODO: remove exiting environment
        // connect to environment
        for (let envIndex = 0; envIndex < browser.params.envInfo.length; envIndex++) {
          const { envName, envUrl, loginMode, userName, userPwd, projects } = browser.params.envInfo[envIndex]
          // this check should timeout quick
          const envNotExist = await mainWindow.mainCanvas.envSection.isEnvRemoved(envName, 1000)
          if (!envNotExist) {
            console.log(`remove exsiting env ${envName}`)
            await mainWindow.mainCanvas.envSection.removeEnv(envName)
            // this one should have bigger timeout as the actual remove may take some time
            await mainWindow.mainCanvas.envSection.isEnvRemoved(envName, 4000)
          }
          console.log(`connect to env ${envName} with url ${envUrl}`)
          await mainWindow.mainCanvas.envSection.connectEnv(envName, envUrl)
          await sleep(10000) // wait for login mode
          console.log('set login, password and login mode')
          await mainWindow.mainCanvas.envSection.loginToEnv(loginMode, userName, userPwd)
          await sleep(30000) // wait for project list
          console.log('choose projects')
          for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
            await mainWindow.mainCanvas.envSection.chooseProject(projects[projectIndex])
          }
          console.log('confirm connection')
          await mainWindow.mainCanvas.envSection.clickOkToConnect()

          if (OSType === 'mac') {
            mainWindow.mainCanvas.envSection.closeExtraEnvWindow()
          }
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
      const { stopRecord } = require('./utils/ciUtils/video-helper')
      await stopRecord(global.videoRecorderProcess)

    } catch (e) {
      console.log(`=========${e}===========`)
      if (global.videoRecord) {
        const { uploadVideo, stopRecord } = require('./utils/ciUtils/video-helper')
        await stopRecord(global.videoRecorderProcess)
        if (global.enableUplodaVideo) {
          // upload prepareEnv video
          try {
            await sleep(1000)
            const videoMetadata = await uploadVideo(`video/before_launch/prepareEnv.mkv`, global.uploadVideoPath)
            console.log('upload video info: ', videoMetadata)
            const { url } = JSON.parse(videoMetadata)
            if (global.videoUploadURL === undefined) {
              global.videoUploadURL = url.substring(0, url.lastIndexOf('/'))
            }
          } catch (e) {
            console.log('upload video failed: ', e)
          }
        }
      }
    }

  },

  onComplete: async () => {
    const { mainWindow } = pageObj
    if (customArgObj.args.removeEnv) {
      try {
        // remove environment
        const { switchToWindow } = require('./utils/wsUtils/windowHelper')
        await switchToWindow('Workstation Main Window')
        await mainWindow.smartTab.scrollOnSmartTab('up')
        await mainWindow.smartTab.selectTab('Environments')
        if (OSType === 'mac') {
          for (let envIndex = 0; envIndex < browser.params.envInfo.length; envIndex++) {
            await mainWindow.mainCanvas.envSection.disconnectEnv(browser.params.envInfo[envIndex].envName)
            await mainWindow.mainCanvas.envSection.removeEnv(browser.params.envInfo[envIndex].envName)
            await mainWindow.mainCanvas.envSection.isEnvRemoved(browser.params.envInfo[envIndex].envName, 4000)
          }
        } else {
          await mainWindow.mainCanvas.envSection.removeAllEnv()
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
