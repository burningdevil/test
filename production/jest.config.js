module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: "<rootDir>/enzymeSetup.js",
  moduleNameMapper: {
    "\\.(scss)$": "<rootDir>/node_modules/jest-css-modules"
  }
};
