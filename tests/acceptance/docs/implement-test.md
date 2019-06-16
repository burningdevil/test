#IMPLEMENTING New Tests

This document will guide you through steps to automate a new test case.

## Before Start
- You know what to be automated and it is ready/stable to be automated.
- You have the repository in your local and have setup and run examples/any test scenario successfully.

## Design Test Cases

### Cucumber Feature
Think about what will be newly automated, is it a new feature or enhancement to an exiting feature? Create a new feature file or working on an existing feature file for it. Feature files are under `/features` folder and they are composed of Test Scenarios.

### Cucumber Test Scenario
Design Cucumber Test Scenarios for what to be tested, using [Gherkin](https://cucumber.io/docs/gherkin/reference/) lanuage. A Test Scenario usually contains a sequence of test steps. Example: 

```
Feature: example for feature
  As a example description here
  You should put some description for this feature test

Scenario: 
  Given some conditions
  When I perform some actions
  Then expected behavior
```

### Cucumber Test Steps
With the Test Scenario you have designed, implment the test steps. You can check if there is any Test Steps already implmeented by others and reusable, by [generating the step disctionry html file and search](./step-dictionary.md). Test Steps are organized by features and put under `/features/step_definitions` folder.

A Test Step is actually a function, implemented in the programming lanugae. Example

```
// ** Navigations in Main Window ** //
When('I select tab {tabName}', async function (tabName) {
  return smartTab.selectTab(tabName);
});
```

To implement the Test Steps, we need to implement the Page Objects that helps to identify the elements, perform actions and then validate if expected behaviors. 

## Implement Page Objects
We typically add any of the web or native pages under "pages" folder. All the page objects are categorized in 2 folder
    - Native Page Objects
    - Web Pages Objects

Each of them have their respective builder.js file, from which all the page objects are exported.

Each page object file has 3 sections
    - Elements Locators (getter functions)
        getters are mainly used to locate the element by using appropriate element locating strategies.
    - Action Methods
        this includes all the action we want to perform by using the element locator methods
    - Assertion Methods
        here we write the assertions methods

### Native Page Objects

All pages related to the native workstation app are added here. For Ex: SmartTab, Toolabr, MainWindow, etc.

RootApp:
    All the native pages extends RootApp.
    RootApp.js contains all the common methods used by other page objects.

    You can refer to the workstation app using this.app, which is defined in the RootApp.js

WindowBuilder:
    WindowBuilder returns instances for all the page objects except for the RootApp.

### Web Page Objects
All pages built purely using the web components are added here.
For Ex: QuickSearch, etc.

BasePage:
    All the web pages extends BasePage.
    BasePage.js contains all the common methods used for by other pages.
    And in it's constructor we define these variables for easier usage throught out all the web pages
        constructor(browserInstance) {
            this.brwsr = browserInstance || browser;
            this.$ = this.brwsr.$;
            this.$$ = this.brwsr.$$;
            this.element = this.brwsr.element;
            this.EC = this.brwsr.ExpectedConditions;
        }

PageBuilder:
    PageBuilder returns instances for all the page objects except for the BasePage.

### Driver Libraries
Protractor has wrapped the WebDriverJS APIs and also its extra APIs. We use these APIs to talk to the Chrome Driver. Please check the Protractor APIs [here](https://www.protractortest.org/#/api).

WD library is used as the Client for the Native drivers. Please check WD APIs [here](https://github.com/admc/wd/blob/master/doc/api.md).

### Locate Elements

WD support multiple locator strategies to find the elements. We want to avoid using xpath as much as we can, since xpath locators are unreadable, hard to debug and very easily subject to change. However, the Appium Mac Driver can only support AXPath, while the WAD can support more WD methods such as locate elements by name, classname, AccessibilityId and xpath.

Inorder to resolve the issue of using different locator strategies for both mac and windows, we defined a method getNativeElement(obj) that can compose the elements based on it's platform operating system. This method is place in the RootApp.js file, meaning it is available in all the page js files. Any getter functions in the pages should use this method to locate elements.

All the elements locator values uses json structure.

Example for using getNativeElement(obj):

```
getExampleElement(parameter) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: `${parameter}` },
          { method: 'ClassName', value: 'Button' },
        ]},
      mac: { xpath: pageObjectName.methodName.replace('ReplaceMe', parameter) }
    });
  }
```

Regarding how to figure out the locator values for specific elements, please refer to [how-to-locate-element](./how-to-locate-elements.md)

## Test & Debug

### Run Your Test Only
One simple way to only run your test scenario is to put a special tag for it: `@debug`. Then you can pass in the tag when running the test command:  

```
yarn test -- --cucumberOpts.tags '@debug'
```

### Node Debugger
[ndb](https://github.com/GoogleChromeLabs/ndb) is highly recommended for debugging your test script.

1.  Install ndb globally

```sh
yarn install -g ndb
```

2.  Write `debugger;` in the line where you want to place the breakpoint.

Example: 
```javascript
...

async removeEnv(name) {
    let existingEnv = await this.getExistingEnv(name);
    debugger;
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getRemoveEnvOption());
    return this.app.sleep(8000);
  }

...
```

3. Launch automation with Node debugger command 'ndb'.

```sh
ndb {npm-run-script}
```

Example:

```sh
ndb npm run test -- --cucumberOpts.tags '@debug'

```

## Add Descriptions and POC
After one Test Scenario has been successfully implemented, add description and POC information for it. 