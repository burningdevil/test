@authmode @Regression @TC85734
Feature: 72_Auth_mode_disable_oidc_saml_when_one_selected
    1. add Environment
    2. add new application
    3. set to use app level auth modes
    4. select OIDC or SAML
    5. check disablement of the other

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 72_Auth_mode_disable_oidc_saml_when_one_selected
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "OIDC" for auth mode
        Then check the screenshot by comparing "72_disable_saml_when_select_oidc_01"
        Then I click "Save" button in the tab "general"
        When I edit the application "New Application"
        Then I verify auth mode option "Choose specific authentication modes for the app" is selected
        Then check the screenshot by comparing "72_disable_saml_when_select_oidc_02"
        When I deselect custom auth modes "OIDC" for auth mode
        Then check the screenshot by comparing "72_when_deselect_both_03"
        When I select custom auth modes "SAML" for auth mode
        Then check the screenshot by comparing "72_diable_oidc_when_saml_selected_04"
        Then I click "Save" button in the tab "general"



   
