@customemail2 @TC84106 @Regression
Feature: 81_Custom_email_disable_button
    1. add Environment
    2. add new application
    4. enable custom email mode
    5. disable all buttons
    6. save changes

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 81_Custom_email_enable
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Branding Image" section
        When I disable section "showBrandingImage"
        When I expand "Action Button" section
        When I disable section "showBrowserButton"
        When I disable section "showMobileButton"
        When I expand "Social Media" section
        When I disable media "Facebook"
        When I send preview email
        Then check the screenshot by comparing "81_Custom_email_disable_button_01"
        When I click "Save" button in the tab "customEmailSettings"