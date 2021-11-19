@TC78838 @Regression
Feature: Duplicate applications
    1. add environment
    3. duplicate application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: Duplicate applications
        When I select tab "Applications"
        When I click the application create entry
        Then I click "Save" button
        Then I duplicate the application "New Application"
        Then check the screenshot by comparing "09_copy_application"
        Then I click "Save" button
        Then I delete the application "New Application"
        Then I delete the application "Copy of New Application"

