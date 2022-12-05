@customemail1 @TC84106 @Sanity @Regression
Feature: 80_Custom_email_enable
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. take screenshot
    5. save

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 80_Custom_email_enable
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Subject & Body Text" section
        Then check the screenshot by comparing "80_Custom_email_enable_01"
        When I expand "Email Sender" section
        When I expand "Branding Image" section
        When I expand "Action Button" section
        Then check the screenshot by comparing "80_Custom_email_enable_02"
        When I expand "Notification Reminder" section
        #Then check the screenshot by comparing "80_Custom_email_enable_03"
        Then check the screenshot on element "customEmail" by comparing "80_Custom_email_enable_03"
        Then I check default mobile link
        When I expand "Sent By" section
        When I expand "Social Media" section
        When I send preview email
        Then check the screenshot by comparing "80_Custom_email_enable_04"
        When I click "Save" button in the tab "customEmailSettings"