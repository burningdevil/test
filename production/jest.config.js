module.exports = {
  verbose: true,
  testRegex: '__tests__/.*.test.tsx?$|\\.spec.tsx',
  setupFilesAfterEnv: ['<rootDir>/enzymeSetup.js'],
  moduleNameMapper: { 
    '\\.(scss|css|less|png|jpg|gif|svg)$': '<rootDir>/node_modules/jest-css-modules',
    'node_modules/@mstr/react-ws-grid/lib/locale/locale.js': '<rootDir>/src/modules/components/__tests__/__mocks__/i18next'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*(antd/es)/)'
  ],
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
}
