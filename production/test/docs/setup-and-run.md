# Test Framework Setup And Run

## Requirements
General:
- Install [Node.JS](https://nodejs.org) 
- Install [Yarn](https://github.com/yarnpkg/yarn)
- Install Appium: [Installing Appium](http://appium.io/docs/en/about-appium/getting-started/)

### For Windows:
- Appium claims WAD(WinAppDriver) is bundled and no need to install WAD separately. However, if you meet 'Could not verify WinAppDriver install' error when starting, please check the required WAD version in file installer.js under \AppData\Local\Programs\appium-desktop\resources\app\node_modules\appium\node_modules\appium-windows-driver\lib and install WAD separately.
- Enable Developer Mode on Windows for starting WAD
- Install Workstation Windows
- [Enable application Developer Mode for Workstation Windows](https://microstrategy.atlassian.net/wiki/spaces/TECTOOLSWORKSTATION/pages/447709932/How+to+configure+the+developer+mode)

### For Mac:
- Install the native OS X binary [AppiumForMac](https://github.com/appium/appium-for-mac/releases/tag/v0.3.0)
- Follow the [installation instruction](https://github.com/appium/appium-for-mac#109-1010-1011-1012) to enable AppiumForMac to use the Accessibility API of Mac OS X
- Install Workstation Mac with CEF (Currently the CEF version has not been merged yet, please download the dev build from [oneDrive](https://microstrategy-my.sharepoint.com/:f:/p/qfan/EpRHKbKMVqBMi0rr8fIJwb8Bb1zsIMsRcrXvIdKNA0owQw) )

## Install
Clone this repository. Then go to
```
cd production/test
```
### Install Packages
Install all necessary node modules specified in the file [package.json](./package.json)
```
yarn install
```

## Configuration Before Start

### App Path

Provide the Workstation application path in file ./protractorArgs.json.

### Environment Parameters
Provide the environemnt(s) to be connected in 'envInfo' Array in file ./protractorArgs.json. The environment(s) will be connected before any test starts. If you want to connect lively when running tests, use environment steps instead.

### Start Workstation with different setting values
Please check the ./Utils/envUtils/constatns.js, where you can specify the session Capability settings for Windows and Mac.

## CLI parameters

### Protractor CLI
You can always use Protractor CLI options, please check the options [here](https://github.com/angular/protractor/blob/master/lib/cli.ts).

### Cucumber CLI

Protractor-Cucumber-Framework supports [Cucumber CLI](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md), just add the paramters as the key of the object cucumberOpts. For example, instead of `--tags <tagName>`, use `--cucumberOpts.tags <tagName>`.

## Run Test
Before start running any test, please start Appium Server in the machine you are going to run the test.
You can run the tests from command line with the pre-defined npm scripts. For example,

```
yarn test -- --cucumberOpts.tags '@quick_search_e2e'
```

