# Create Cucumber Features and Scenarios

## Before Start
- You know what to be automated and it is ready/stable to be automated.
- You have the repository in your local and have setup and run examples/any test scenario successfully.

## Design Features and Scenarios

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

## Implement Cucumber Steps
With the Test Scenario you have designed, implment the test steps. You can check if there is any Test Steps already implmeented by others and reusable, by [generating the step disctionry html file and search](./step-dictionary.md). Test Steps are organized by features and put under `/features/step_definitions` folder.

A Test Step is actually a function, implemented in the programming lanugae. Example

```
// ** Navigations in Main Window ** //
When('I select tab {tabName}', async function (tabName) {
  return mainWindow.smartTab.selectTab(tabName);
});
```

To implement the Test Steps, we need to implement the Page Objects that helps to identify the elements, perform actions and then validate if expected behaviors.

## Add Descriptions and POC
After one Test Scenario has been successfully implemented, add description and POC information for it.
