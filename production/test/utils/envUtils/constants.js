import mac_xpath from './mac_xpath'
import win_xpath from './win_xpath'

// Windows Specific
const WIN_CAPABILITIES = {
  platformName: 'Windows',
  deviceName: 'WindowsPC',
  app: workstationPath,
  appArguments: '-p 54213',
  newCommandTimeout: 30000,
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
    {'name':'implicit_timeout', 'value': 10 },
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

// export
export const APPIUM_SERVER_URL = 'http://localhost:4723/wd/hub';
export const UB_INTERVAL = 200;
export const APP_OS = setValuePerPlatform('windows', 'mac');
export const Chrome_Type = setValuePerPlatform('3rdParty/windows/chromedriver.exe', '3rdParty/mac/chromedriver');
export const APP_CAPABILITIES = setValuePerPlatform(WIN_CAPABILITIES, MAC_CAPABILITIES);
export const APP_XPATH = setValuePerPlatform(win_xpath, mac_xpath);


