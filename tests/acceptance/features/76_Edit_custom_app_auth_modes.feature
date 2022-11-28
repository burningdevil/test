@authmode @Regression @TC85733 @Sanity
Feature: 76_Edit_custom_app_auth_modes
    1. add Environment
    2. add new application
    3. edit auth mode to use app level auth modes
    4. save changes
    5. edit auht modes to use server level
    6. save changes

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 76_Edit_custom_app_auth_modes
        When I select tab "Applications"
        When I click the application create entry
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "Standard" for auth mode
        Then I verify auth modes "Standard" are selected
        Then I verify custom auth mode option "Standard" is default mode
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "New Application" in detail grid is "Standard"
        When I edit the application "New Application"
        When I select option "Use existing server level authentication modes" for auth mode
        Then I verify auth mode option "Use existing server level authentication modes" is selected
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "New Application" in detail grid is "Library Server Default"
        When I edit the application "New Application"
        Then I verify auth mode option "Use existing server level authentication modes" is selected
        When I select option "Choose specific authentication modes for the app" for auth mode
        When I select custom auth modes "LDAP" for auth mode
        Then I verify auth modes "LDAP" are selected
        Then I verify custom auth mode option "LDAP" is default mode
        Then I click "Save" button in the tab "general"
        Then I verify auth mode of custom app "New Application" in detail grid is "LDAP"



   
