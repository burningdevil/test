@authmode @Regression @TC85734
Feature: 74_Disable_save_button_when_no_custom_app_auth_mode_selected
    1. add Environment
    2. add new application
    3. set to use app level auth modes
    4. check save button status when no auth mode selected

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 74_Disable_save_button_when_no_custom_app_auth_mode_selected
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        Then I verify "Save" button is "disabled" in the tab "general"
        When I select custom auth modes "Standard,LDAP" for auth mode
        When I deselect custom auth modes "Standard,LDAP" for auth mode
        Then check the screenshot by comparing "74_disable_save_button_when_no_auth_mode_selected_01"
        Then I verify "Save" button is "disabled" in the tab "general"
        When I select custom auth modes "OIDC" for auth mode
        Then I click "Save" button in the tab "general"



   
