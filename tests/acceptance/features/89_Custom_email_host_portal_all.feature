@customemail10 @TC84106 @Regression
Feature: 89_Custom_email_host_portal_all
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. modify strings then restore
    5. save 

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        When I modify embedding settings to "All" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_new_application_dialog_if_necessary
    Scenario: 89_Custom_email_host_portal_all
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Action Button" section
        When I input "http://10.27.69.39:8080/MicroStrategyLibrary/app" in "Host Web Portal"
        When I click "Save" button in the tab "customEmailSettings"