@customemail3 @TC84106 @Sanity
Feature: 82_Custom_email_use_blank
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. clear all default strings
    5. save
    6. edit app

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_new_application_dialog_if_necessary
    Scenario: 82_Custom_email_use_blank
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Subject & Body Text" section
        When I input " " in section "1" of "SHARE_BOOKMARK"
        When I input " " in section "2" of "SHARE_BOOKMARK"
        Then check the screenshot by comparing "82_Custom_email_use_blank_01"
        When I expand "Email Sender" section
        When I input " " in "Display Name"
        When I expand "Notification Reminder" section
        When I input " " in reminder
        When I input " " in "Link Text"
        Then check the screenshot by comparing "82_Custom_email_use_blank_02"
        When I expand "Sent By" section
        When I input " " in "Sent By"
        When I expand "Social Media" section
        When I input " " URL in "Facebook"
        When I send preview email
        Then check the screenshot by comparing "82_Custom_email_use_blank_03"
        When I click "Save" button in the tab "customEmailSettings"
        When I edit the application "New Application"
        When I switch to menu "Email Communication"
        When I expand "Subject & Body Text" section
        Then check the screenshot by comparing "82_Custom_email_use_blank_04"
        When I expand "Email Sender" section
        When I expand "Notification Reminder" section
        When I expand "Sent By" section
        Then check the screenshot by comparing "82_Custom_email_use_blank_05"
        When I expand "Social Media" section
        Then check the screenshot by comparing "82_Custom_email_use_blank_06"
        When I click "Save" button in the tab "customEmailSettings"