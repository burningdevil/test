@authmode @Regression @TC85734
Feature: 73_Set_default_custom_app_auth_mode
    1. add Environment
    2. add new application
    3. set to use app level auth modes
    4. select custom app auth modes
    5. set one as default
    6. reopen to check default auth mode

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 73_Set_default_custom_app_auth_mode
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "OIDC" for auth mode
        Then I verify custom auth mode option "OIDC" is default mode
        Then check the screenshot by comparing "73_oidc_as_default_01"
        When I select custom auth modes "Standard" for auth mode
        When I set custom auth mode option "Standard" as default mode
        Then I verify custom auth mode option "Standard" is default mode
        Then check the screenshot by comparing "73_standard_as_default_02"
        Then I click "Save" button in the tab "general"
        When I edit the application "New Application"
        Then I verify auth mode option "Choose specific authentication modes for the app" is selected
        Then check the screenshot by comparing "73_standard_as_default_03"
        When I select custom auth modes "LDAP" for auth mode
        When I set custom auth mode option "LDAP" as default mode
        Then I verify custom auth mode option "LDAP" is default mode
        Then check the screenshot by comparing "73_ldap_as_default_04"
        Then I click "Save" button in the tab "general"



   
