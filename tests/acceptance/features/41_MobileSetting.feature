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
        Given configure workstation engine test environment

    Scenario: 41_MobileSetting
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "More Settings"
        Then check the screenshot by comparing "41_mobile_default"
        When I choose the user access "Allow users to access preferences"
        When I choose the user access "Allow users to access advanced settings"
        Then check the screenshot by comparing "41_mobile_disable_useraccess"
        Then I click "Save" button
        Then I delete the application "New Application"

