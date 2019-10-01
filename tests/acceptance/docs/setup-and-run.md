# Test Framework Setup And Run

## Requirements
General:
- Install [Node.JS](https://nodejs.org)
- (optional but recommended) Install [Yarn](https://github.com/yarnpkg/yarn)
- Install Appium: [Installing Appium](http://appium.io/docs/en/about-appium/getting-started/)

### For Windows:
- Enable Developer Mode on Windows for starting WAD
- Install Workstation Windows
- [Enable application Developer Mode for Workstation Windows](https://microstrategy.atlassian.net/wiki/spaces/TECTOOLSWORKSTATION/pages/447709932/How+to+configure+the+developer+mode)
- Appium claims WAD(WinAppDriver) is bundled and no need to install WAD separately. However, if you meet 'Could not verify WinAppDriver install' error when starting, please check the required WAD version in file installer.js under \AppData\Local\Programs\appium-desktop\resources\app\node_modules\appium\node_modules\appium-windows-driver\lib and install WAD separately.

### For Mac:
- Install the native OS X binary [AppiumForMac](https://github.com/appium/appium-for-mac/releases/tag/v0.3.0)
- Follow the [installation instruction](https://github.com/appium/appium-for-mac#109-1010-1011-1012) to enable AppiumForMac to use the Accessibility API of Mac OS X
- Enable Workstation Mac Developer Mode and make sure it's using the CEF Plugin mode following the [instructions] (https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/798299500/How+to+prepare+Workstation+Mac+for+CEF+Plugin+Test)

## Install
Clone this repository. Then go to
```
cd tests/acceptance
```
### Install Packages
Install all necessary node modules specified in the file [package.json](./package.json)
```
yarn install
```

## Configuration Before Start

### Modify Configuration File
You can modify the configuration file ./protractorArgs.json to provide default parameter values.

### CLI Parameters
You can also specify the parameter value(s) in the command line to run the test. The value(s) provided in command line will overwrite the values in the configuration file.

#### Protractor CLI
You can always use Protractor CLI options, please check the options [here](https://github.com/angular/protractor/blob/master/lib/cli.ts).

#### Cucumber CLI

Protractor-Cucumber-Framework supports [Cucumber CLI](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md), just add the paramters as the key of the object cucumberOpts. For example, instead of `--tags <tagName>`, use `--cucumberOpts.tags <tagName>`.

## Run Test
Before start running any test, please start Appium Server in the machine you are going to run the test.
You can run the tests from command line with the pre-defined npm scripts. For example,

```
yarn test --cucumberOpts.tags '@windows_example' --params.envInfo[0].userName '<yourname>' --params.envInfo[0].userPwd '<yourPwd>'
```

