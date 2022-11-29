@customemail8 @TC84106 @Sanity @Regression
Feature: 87_Custom_email_reset_info
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. enable reset and tooltip

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 87_Custom_email_reset_info
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I click reset of "Subject & Body Text"
        Then check the screenshot by comparing "87_Custom_email_reset_info_01"
        Then I view Subject & Body Text Info
        Then check the screenshot by comparing "87_Custom_email_reset_info_02"
        When I expand "Action Button" section
        When I view Host Web Portal Info
        Then check the screenshot by comparing "87_Custom_email_reset_info_03"
        When I expand "Notification Reminder" section
        When I view Notification Reminder Info
        Then check the screenshot by comparing "87_Custom_email_reset_info_04"
        When I view Link Text Info
        Then check the screenshot by comparing "87_Custom_email_reset_info_05"
        When I click "Save" button in the tab "customEmailSettings"