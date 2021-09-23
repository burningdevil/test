@TC78810
Feature: CreateDuplicateDelete applications
    1. add environment
    2. create application
    3. duplicate application
    4. delete application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: CreateDuplicateDelete applications
        When I select tab "Applications"
        When I click the application create entry
        Then check the screenshot by comparing "01-01"
        Then I click "Save" button
        When I click the application create entry
        Then check the screenshot by comparing "02-02"
        Then I click "Save" button
        Then I duplicate the application "New Application"
        Then I click "Save" button
        Then I delete the application "New Application"
        Then I delete the application "New Application 1"
        Then I delete the application "Copy of New Application"

