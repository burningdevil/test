@TC78810 @Regression
Feature: Create applications
    1. add environment
    2. create application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: Create applications
        When I select tab "Applications"
        When I click the application create entry
        Then check the screenshot by comparing "02_newapplication_default_name"
        Then I click "Save" button
        When I click the application create entry
        Then check the screenshot by comparing "02_newapplication_default_name2"
        Then I click "Save" button
        Then I delete the application "New Application"
        Then I delete the application "New Application 1"
