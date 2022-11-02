@authmode @Regression @TC85734
Feature: 70_Create_custom_app_use_app_auth_mode
    1. add Environment
    2. add new application
    3. change custom app auth mode 
    4. save changes
    5. re-open the custom app and check auth mode selections


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 70_Create_custom_app_use_app_auth_mode
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "Standard,OIDC" for auth mode
        Then I verify auth modes "Standard,OIDC" are selected
        Then check the screenshot by comparing "70_Custom_app_auth_mode_default_standard_and_oidc_1_create"
        Then I click "Save" button in the tab "general"
        When I edit the application "New Application"
        Then I verify auth mode option "Choose specific authentication modes for the app" is selected
        Then I verify auth modes "Standard,OIDC" are selected
        Then check the screenshot by comparing "70_Custom_app_auth_mode_default_standard_and_oidc_2_reopen"
        Then I click "Save" button in the tab "general"



   
