import mac_xpath from './mac_xpath'
const execSync = require("child_process").execSync;
const fs = require('fs')

// Windows Specific
const WIN_CAPABILITIES = {
  platformName: 'Windows',
  deviceName: 'WindowsPC',
  app: workstationPath,
  appArguments: '-p 54213'
};


// Mac Specific
const MAC_CAPABILITIES = {
  platformName: 'Mac',
  deviceName: 'Mac',
  app: workstationPath,
  cookies : [
    // for debug purpose
    {'name':'command_delay', 'value': 0 },
    // try to locate element every 'loop_delay' within 'implicit_timeout'
    // this value will be set when starting workstation
    // {'name':'implicit_timeout', 'value': 0 },
    {'name':'loop_delay', 'value': 1 },
    // mouse speed
    {'name':'mouse_speed', 'value':400},
    // take screenshots on errors locating elements
    // {'name':'global_diagnostics_directory', 'value':'/Users/qfan/ws-app-automation/screenshots'},
    // {'name':'screen_shot_on_error', 'value': true }
  ]
};

// check platform OS and get the specific values for the platform

//    this function helps to set different values based on the platform
const setValuePerPlatform = (winValue, macValue) => {
  switch (process.platform) {
    case 'win32':
      return winValue;
    case 'darwin':
      return macValue;
    default:
      throw Error('Test is running in an unexpected environment!');
  }
};

const resetMacEnv = function resetMacEnv() {
  let removeEnv = ""
  try {
    removeEnv = execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation 4c158b61ebc73998d366d08f49c1bed507a0264f`);
    console.log(`Resetting Environments: ${removeEnv}`);
    removeEnv = execSync(`defaults delete ~/Library/Preferences/com.microstrategy.Workstation acca64b83535b9a1dff37a13cd176f393be7c195`);
    console.log(`Resetting Environments: ${removeEnv}`);
    execSync(`defaults read ~/Library/Preferences/com.microstrategy.Workstation`);
  } catch (error) {
    console.log("No environments present to remove");
    console.log(`${error}\n`);
  }
}

const resetWinEnv = function resetWinEnv() {
  try {
    fs.unlinkSync(`${process.env.HOME}\\AppData\\Local\\Microstrategy_Inc\\Workstation.db`);
  } catch (error) {
    console.log(error)
  } 
}

const resetEnv = function() {
  if (setValuePerPlatform("windows","mac") === "windows") {
    resetWinEnv()
  } else if (setValuePerPlatform("windows","mac") === "mac"){
    resetMacEnv()
  } else {
    throw Error('Test is running in an unexpected environment!');
  }
}

// export
export const APPIUM_SERVER_URL = 'http://localhost:4723/wd/hub';
export const MAC_XPATH = mac_xpath;
export const MAC_XPATH_GENERAL = mac_xpath['general'];
export const OSType = setValuePerPlatform('windows', 'mac');
export const APP_CAPABILITIES = setValuePerPlatform(WIN_CAPABILITIES, MAC_CAPABILITIES);
export const RESET_ENV = resetEnv;
