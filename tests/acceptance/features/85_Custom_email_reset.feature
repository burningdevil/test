@customemail6 @TC84106 @Regression
Feature: 85_Custom_email_reset
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. modify then reset
    5. save changes
    6. edit app

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_new_application_dialog_if_necessary
    Scenario: 85_Custom_email_reset
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Subject & Body Text" section
        When I input "i" in section "2" of "MEMBER_ADDED"
        When I click reset of "Subject & Body Text"
        When I confirm reset "Yes"
        When I send preview email
        When I click "Save" button in the tab "customEmailSettings"
        When I edit the application "New Application"
        When I switch to menu "Email Communication"
        When I expand "Subject & Body Text" section
        Then check the screenshot by comparing "85_Custom_email_reset_01"