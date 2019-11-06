# Test Framework Setup And Run

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
### Two-steps Run: Start Appium and Run Test
As Appium has been installed locally as a node module, we need to start it before running the test.
#### Step I: Start Appium
In one bash shell, start Appium server. You will see Appium by default starts on 127.0.0.1:4723.
```
yarn startAppium
```
or
```
npm run startAppium
```
#### Step II: Trigger Test
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
node trigger_test --args.appPath.mac '/myPath/MicroStrategy Workstation.app' --cucumberOpts.tags '@ldap'
```

Note:
- The test may fail if as the features are changing. We may maintain some of the feature specs but as long as you see the Workstation Application is launched and the environment can be connected successfully, you environment setup is good.


