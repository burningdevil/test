@TC79962 @Regression
Feature: 41_MobileSetting
    1. add environment
    2. add new application
    3. switch to mobile tab and capture the default option status
    4. customize the user preference
    5. customize the cache mode
    6. customize the connectivity time
    7. customize the logging type and maximize size

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 41_MobileSetting
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "More Settings"
        Then check the screenshot by comparing "41_mobile_default"
        When I choose the user access "Allow users to access preferences"
        When I choose the user access "Allow users to access advanced settings"
        Then check the screenshot by comparing "41_mobile_disable_useraccess"
        When I input the params by number in the more setting '180' '200'
        When I input the params by number in the more setting '500' '600'
        When I change the logging level 'All'
        When I check the cache setting
        Then check the screenshot by comparing "41_mobile_change_setting"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"

