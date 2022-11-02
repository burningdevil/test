@authmode @Regression @TC85734
Feature: 71_Create_custom_app_use_server_auth_mode
    1. add Environment
    2. add new application
    3. set to use default server level auth modes
    4. save changes
    5. re-open the custom app and check auth mode selections

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 71_Create_custom_app_use_server_auth_mode
        When I select tab "Applications"
        When I click the application create entry
        Then I verify auth mode option "Use existing server level authentication modes" is selected
        Then check the screenshot by comparing "71_Create_custom_app_use_server_auth_mode_01_create"
        Then I click "Save" button in the tab "general"
        When I edit the application "New Application"
        Then I verify auth mode option "Use existing server level authentication modes" is selected
        Then check the screenshot by comparing "71_Create_custom_app_use_server_auth_mode_02_reopen"
        Then I click "Save" button in the tab "general"



   
