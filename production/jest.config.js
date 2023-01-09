module.exports = {
  verbose: true,
  testRegex: '__tests__/.*.test.tsx?$|\\.spec.tsx',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: { 
    '\\.(scss|css|less|png|jpg|gif|svg)$': '<rootDir>/node_modules/jest-css-modules',
    '^antd/es': 'identity-obj-proxy',
    'node_modules/@mstr/react-ws-grid/lib/locale/locale.js': '<rootDir>/src/modules/components/__tests__/__mocks__/i18next'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
  unmockedModulePathPatterns: [
    "node_modules"
  ],
  globals: {
    __MOCK__: true,
    __IS_WS__: false,
    __DEV__: true,
    __TEST__: true,
    'ts-jest': {
      diagnostics: false
    },
    workstation: {
    }
  },
  collectCoverageFrom: [
    'src/modules/components/**/*.{js,jsx,ts,tsx}',
    'src/store/**/*.{js,jsx,ts,tsx}',
    '!**/__mock__/**/*.*',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/__mock__/**/*.*',
    '!**/mocks/**/*.*',
    '!**/*.eslintrc.js',
  ],
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Unit Test Report"
    }]
  ]
}
