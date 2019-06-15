
# Workstation E2E Testing Framework 

Workstation Framework team automated this E2E Testing Framework for both Workstation Windows and Workstation Mac. The framework is based on [Protractor](https://github.com/angular/protractor), [Cucumber](https://github.com/cucumber/cucumber) and [Appium](http://appium.io/). 

## Requirements
General:
- Install [Node.JS](https://nodejs.org) 
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

## Quick Start
This test framework includes example E2E test workflows for both Workstation Windows and Workstation Mac. Before you run the example test, please:
- Start Appium Server in the machine you are going to run the test
- Modify the AQDT LDAP login information, the Workstation App Path in file ./protractorArgs.json (yourname and yourpwd, appPath.)

You can run the tests from command line with the pre-defined npm scripts.

For Mac:
```
npm run test -- --cucumberOpts.tags '@mac_example'
```
For Windows
```
npm run test -- --cucumberOpts.tags '@windows_example'
```

Note:
- Ideally the test scenario should be same for both Workstation Windows and Mac. However current Workstation Mac with CEF only has Quick Search (local search) implemented which is not there at all in Workstation Windows. In the future please expect only one same scenario for both Workstation Windows and Mac.
- The test may fail for Workstation Mac if in the future the returned Dossier results from Quick Search differs in AQDT environment.


## User Guide
This template includes Protractor-Cucumber-Framework setup, configurations, examples of test scenarios and Page Object classes for you to quickly learn and start E2E test automation for Workstation Windows and Mac. You can always find the reusable scripts for each team in this [Reusable Pattern List](docs/reusable-pattern-list.md). You are also welcomed to contribute to this template with any reusable patterns you have, please check the [How To Contribute](docs/how-to-contribute.md) for details.

Here are some topics that may help you better understand how to use this template.
* [Framework Architecture](docs/framework-architecture.md)
* [Setup the Environment](docs/setup-and-run.md)
* [Implement Test](docs/implement-test.md)
    * [Design Features and Scenarios](docs/implement-test.md#design-features-and-scenarios)
    * [Implement Steps](docs/implement-test.md#implement-steps)
    * [Implement Page Objects](docs/implement-test.md#implement-page-objects)
* [Performance Test](docs/performance-test.md)
* [Analyze Test Results](docs/test_results.md)
* [CI Pipeline](docs/ci-pipeline.md)

