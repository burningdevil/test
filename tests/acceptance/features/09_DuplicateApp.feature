@TC78838 @Regression
Feature: 09_DuplicateApp
    1. add environment
    3. duplicate application

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 09_DuplicateApp
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I duplicate the application "New Application"
        Then check the screenshot by comparing "09_copy_application"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
        Then I delete the application "Copy of New Application"

