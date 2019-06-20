module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: '<rootDir>/enzymeSetup.js',
  moduleNameMapper: {
    '\\.(scss)$': '<rootDir>/node_modules/jest-css-modules'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.js$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "(__snapshot__/.*|\\.(test))\\.tsx?$"
}