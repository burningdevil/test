@TC78810 @Regression
Feature: 12_CreateApp
    1. add environment
    2. create application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 12_CreateApp
        When I select tab "Applications"
        When I click the application create entry
        Then check the screenshot by comparing "12_newapplication_default"
        Then I click "Save" button in the tab "general"
        When I click the application create entry
        Then check the screenshot by comparing "12_newapplication_default1"
        Then I click "Save" button in the tab "general"
        When I click the application create entry
        Then check the screenshot by comparing "02_newapplication_default2"
        Then I click "Save" button in the tab "general"
        Then I delete the application "New Application"
        Then I delete the application "New Application 1"
        Then I delete the application "New Application 2"

