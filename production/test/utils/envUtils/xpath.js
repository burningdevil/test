import mac_xpath from './mac_xpath'
import win_xpath from './win_xpath'

let path = () => {
  switch (process.platform) {
    case 'win32':
      return win_xpath;
    case 'darwin':
      return mac_xpath;
    default:
      return {};
  }
};

module.exports = path();