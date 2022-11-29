@authmode @Regression @TC85734
Feature: 75_Deselect_default_auto_mode
    1. add Environment
    2. add new application
    3. set to use app level auth modes
    4. select custom app auth modes
    5. deselect default auth mode
    6. check the first available will be default

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 75_Deselect_default_auto_mode
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "Standard,SAML,LDAP" for auth mode
        Then I verify auth modes "Standard,SAML,LDAP" are selected
        Then I verify custom auth mode option "Standard" is default mode
        When I deselect custom auth modes "Standard" for auth mode
        Then I verify auth modes "SAML,LDAP" are selected
        Then I verify custom auth mode option "SAML" is default mode
        Then check the screenshot by comparing "75_auto_select_first_available_mode_01"
        Then I click "Save" button in the tab "general"



   
