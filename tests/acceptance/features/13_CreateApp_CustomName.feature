@TC78810 @Regression
Feature: 13_CreateApp_CustomName
    1. add environment
    2. create application
    3. input name and description

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 13_CreateApp_CustomName
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_NameAndDescription"
        When I input application description "WS_NameAndDescription"
        Then check the screenshot by comparing "13_newapplication_customizedname"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I delete the application "WS_NameAndDescription"

