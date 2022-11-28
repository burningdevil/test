@customemail13 @TC84106 @Sanity @Regression
Feature: 92_Custom_email_duplicate_app
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. modify strings then restore
    5. save 

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        When I modify embedding settings to "Specific" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 92_Custom_email_duplicate_app
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Action Button" section
        When I input "ReceipientName" on button "View in Browser"
        When I expand "Notification Reminder" section
        When I input "{&NewNotificationCount}" in reminder
        When I click "Save" button in the tab "customEmailSettings"
        Then I duplicate the application "New Application"
        When I switch to menu "Email Communication"
        When I expand "Action Button" section
        When I expand "Notification Reminder" section
        Then check the screenshot by comparing "92_Custom_email_duplicate_app_01"
        When I click "Save" button in the tab "customEmailSettings"
