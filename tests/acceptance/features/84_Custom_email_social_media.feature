@customemail5 @TC84096 @Sanity
Feature: 84_Custom_email_social_media
    1. add Environment
    2. add new application
    4. enable custom email mode
    5. use different media url
    6. save changes

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_new_application_dialog_if_necessary
    Scenario: 84_Custom_email_social_media
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Social Media" section
        When I input " " URL in "Facebook"
        When I input "~@#" URL in "Twitter"
        When I input "https://www.linkedin.com/company/microstrategy?elq=0fd858f3e23f4360bd0d96d12eb26cea&elqCampaignId=" URL in "LinkedIn"
        When I input "google" URL in "YouTube"
        When I click "Save" button in the tab "customEmailSettings"
        When I edit the application "New Application"
        When I switch to menu "Email Communication"
        When I expand "Social Media" section
        Then check the screenshot by comparing "84_Custom_email_social_media_01"
        When I click "Save" button in the tab "customEmailSettings"