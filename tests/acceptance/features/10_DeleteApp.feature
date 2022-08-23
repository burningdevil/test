@TC78839 @Regression @Sanity
Feature: 10_DeleteApp
    1. add environment
    2. delete application

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 10_DeleteApp
        When I select tab "Applications"
        
        When I click the application create entry
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"




