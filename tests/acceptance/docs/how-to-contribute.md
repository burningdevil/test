# How To Contribute

## Identify Reusable Patterns
No matter if you already have some implmentation or you just want to improve the template, please help to identify any reusable patterns and make them into this template.

### General
Any enhancement against the test framework is welcomed. Please note we are already implementing UB support and Rally Test Case update.

### Steps
Generally Test Steps for Workstation natives will be reusable across teams.

### Page Objects
Generally Page Objects for Workstation native will be reusable across teams. 

## Submitting PR
Please create a new branch and submit a pull request for whatever you want to improve. Code review will be performed by the designated POC.
- TL-Workstation-Framework - Qingqing Fan
- TL-Workstation-Architect - Chenqian Wu
In the PR, please also modify the [Reusable Pattern List](./reusable-pattern-list) so others can easily check.

## Style Guide
### JavaScript

We follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as our best practice. It has very well defined to-do and not-to-do lists with clear examples based on ES6.

### Async/Await

Async/Await is required whenever we need to chain Promises for synchronous executions.

* WD/Protractor APIs
  * Actions (e.g. click(), sendKey(), etc.)
  * Data (e.g. isPresent(), getText(), etc.)
  * Browser utilities (e.g. wait(), sleep(), etc.)

### Inheritance

* Make sure you define class based on base classes.
* You can always make a new base class and/or modify existing base class if it is logical.



