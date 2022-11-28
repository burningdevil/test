@authmode @Regression @TC85733
Feature: 77_Duplicate_custom_app_with_auth_modes
    1. add Environment
    2. add new application
    3. duplicate application
    4. check auth mode settings
    5. save changes
    6. duplicate application 
    7. check auth mode settings

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 77_Duplicate_custom_app_with_auth_modes
        When I select tab "Applications"
        When I click the application create entry
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "New Application" in detail grid is "Library Server Default"
        Then I duplicate the application "New Application"
        Then I verify auth mode option "Use existing server level authentication modes" is selected
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "LDAP,OIDC,Standard" for auth mode
        Then I verify auth modes "LDAP,OIDC,Standard" are selected
        Then I verify custom auth mode option "LDAP" is default mode
        When I input application name "copy1"
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "copy1" in detail grid is "LDAP, Standard, OIDC"
        Then I duplicate the application "copy1"
        Then I verify auth mode option "Choose specific authentication modes for the app" is selected
        Then I verify auth modes "LDAP,OIDC,Standard" are selected
        When I input application name "copy2"
        Then I verify custom auth mode option "LDAP" is default mode
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "copy2" in detail grid is "LDAP, Standard, OIDC"



   
