module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/enzymeSetup.js'],
  moduleNameMapper: { 
    '\\.(scss|css|less|png|gif)$': '<rootDir>/node_modules/jest-css-modules',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^dnd-core$': 'dnd-core/dist/cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*(antd/es)/)'
  ],
  testRegex: '(__snapshot__/.*|\\.(test))\\.tsx?$',
  unmockedModulePathPatterns: [
    "node_modules"
  ],
  globals: {
    __MOCK__: true,
    __IS_WS__: false,
    __DEV__: true,
    __TEST__: true
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/httpProxy/MockedHttpProxy.ts',
    '!**/__mock__/**/*.*',
    '!src/httpProxy/MockProxy.tsx',
    '!src/main.tsx',
    '!src/@types/**/*.*',
    '!src/httpProxy/mock/**/*.*',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/__mock__/**/*.*',
    '!**/mocks/**/*.*',
    '!src/store/**/*.*',
    '!**/*.eslintrc.js',
  ],
}
