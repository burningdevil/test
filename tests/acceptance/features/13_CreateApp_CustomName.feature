@TC78810 @Regression
Feature: 13_CreateApp_CustomName
    1. add environment
    2. create application
    3. input name and description

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 13_CreateApp_CustomName
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_NameAndDescription"
        When I input application description "WS_NameAndDescription"
        Then check the screenshot by comparing "13_newapplication_customizedname"
        Then I click "Save" button
        Then I delete the application "WS_NameAndDescription"

