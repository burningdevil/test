@customemail14 @TC84106 @Sanity @Regression
Feature: 93_Custom_email_default_app
    1. add Environment
    2. edit default app
    3. check custom email default settings

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 92_Custom_email_duplicate_app
        When I select tab "Applications"
        When I edit the application "MicroStrategy"
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Action Button" section
        Then I verify switch button of "showBrowserButton" is "on"
        Then I verify switch button of "showMobileButton" is "on"
        Then I verify switch button of "showButtonDescription" is "on"
        When I expand "Notification Reminder" section
        Then check the screenshot by comparing "93_Custom_email_default_app_01"
