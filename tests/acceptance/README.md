
# Workstation E2E Testing Framework

Workstation Framework team automated this E2E Testing Framework for both Workstation Windows and Workstation Mac. The framework is based on [Protractor](https://github.com/angular/protractor), [Cucumber](https://github.com/cucumber/cucumber) and [Appium](http://appium.io/).

## Requirements
General:
- Install [Node.JS](https://nodejs.org)
- (optional but recommmeded) Install [Yarn](https://github.com/yarnpkg/yarn)
- Install a Code Editor tool, [Visual Studio Code](https://code.visualstudio.com/) recommended.
- Use bash shell.
### For Windows:
- OS requirement: Only Windows 10 PCs are supported
- Enable Developer Mode on Windows
- Install Workstation Windows
- [Enable application Developer Mode for Workstation Windows](https://microstrategy.atlassian.net/wiki/spaces/TECTOOLSWORKSTATION/pages/447709932/How+to+configure+the+developer+mode)
### For Mac:
- OS requirement: Mac OS X 10.7 or later.
- Install the native OS X binary [AppiumForMac](https://github.com/appium/appium-for-mac/releases/tag/v0.3.0)
- Follow the [installation instruction](https://github.com/appium/appium-for-mac#109-1010-1011-1012) to enable AppiumForMac to use the Accessibility API of Mac OS X
- Enable the tool with which you will run the test script to use the Accessibility API of Mac OS X
- Enable Workstation Mac Developer Mode and make sure it's using the CEF Plugin mode following the [instructions] (https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/798299500/How+to+prepare+Workstation+Mac+for+CEF+Plugin+Test)

## Install
Clone this repository. Then navigate to this folder
```
cd tests/acceptance
```
### Install Packages
Install all necessary node modules specified in the file [package.json](./package.json)
```
yarn install
```
or
```
npm install
```

## Quick Start
This test framework includes example E2E test workflows for both Workstation Windows and Workstation Mac. There are two ways to run these tests.
### Two-steps Run: Start Appium and Run Test
As Appium has been installed locally as a node module, we need to start it before running the test.
#### Start Appium
In one bash shell, start Appium server. You will see Appium by default starts on 127.0.0.1:4723.
```
yarn startAppium
```
or
```
npm run startAppium
```
#### Run Test
Open another bash shell to run the test.
Before you run the example test, please provide the correct information about test environment and Workstation application path. You can do this by either
- Modify the infomations in file ./protractorArgs.json
- Directly pass in the parameter values in command line.

You can run the tests from command line with the pre-defined npm scripts. Please modify the '--args.appPath.mac' to '--args.appPath.windows' for Windows test.

```
yarn test --args.appPath.mac '<Workstation_Path>' --cucumberOpts.tags '<Tag_Name>'
```
or
```
npm run test -- --args.appPath.mac '<Workstation_Path>' --cucumberOpts.tags '<Tag_Name>'
```

### One-step Run: For CI purpose mainly
This is mainly for CI test purpose. It does start Appium, run test, and stop Appium in one script. The Appium Server logs cannot be seen in this case.
```
yarn test --args.appPath.mac '/myPath/MicroStrategy Workstation.app' --cucumberOpts.tags '@ldap'
```
or
```
npm run test -- --args.appPath.mac '/myPath/MicroStrategy Workstation.app' --cucumberOpts.tags '@ldap'
```

Note:
- The test may fail if as the features are changing. We may maintain some of the feature specs but as long as you see the Workstation Application is launched and the environment can be connected successfully, you environment setup is good.


## User Guide
This template includes Protractor-Cucumber-Framework setup, configurations, examples of test scenarios and Page Object classes for you to quickly learn and start E2E test automation for Workstation Windows and Mac. You can always find the reusable scripts for each team in this [Reusable Pattern List](docs/reusable-pattern-list.md). You are also welcomed to contribute to this template with any reusable patterns you have, please check the [How To Contribute](docs/how-to-contribute.md) for details.

Here are some topics that may help you better understand how to use this template.
* [Framework Architecture](docs/framework-architecture.md)
* [Setup the Environment](docs/setup-and-run.md)
* [Implement Test](docs/implement-test.md)
    * [Design Features and Scenarios](docs/implement-test.md#design-features-and-scenarios)
    * [Implement Steps](docs/implement-test.md#implement-steps)
    * [Implement Page Objects](docs/implement-test.md#implement-page-objects)
    * [Locate Elements](docs/implement-test.md#how-to-locate-elements)
* [Performance Test](docs/performance-test.md)
* [Analyze Test Results](docs/test_results.md)
* [CI Pipeline](docs/ci-pipeline.md)
* [Common Errors](docs/common-errors.md)
