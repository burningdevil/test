@TC78845 @Regression
Feature: 05_LH_LibraryWindow
    1. add environment
    2. add new application
    3. switch to component tab and capture the default option status
    4. check the preview of tablet, phone, web and desktop when off Library Sort and Filter
    5. check the preview of tablet, phone, web and desktop when off Search
    6. check the preview of tablet, phone, web and desktop when off Notifications
    7. check the preview of tablet, phone, web and desktop when off Multi-Select
    8. check the preview of tablet, phone, web and desktop when off New Dossier
    9. check the preview of tablet, phone, web and desktop when off Account



    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 05_LH_LibraryWindow
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"

        Then I hide toolbar icon "Library Sort and Filter"
        Then I hide toolbar icon "Search"
        Then I hide toolbar icon "Notifications"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_sort_search_notification_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_sort_search_notification_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_sort_search_notification_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_sort_search_notification_desktop"

        Then I hide toolbar icon "Multi-Select (Web and Desktop)"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_multiselect_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_multiselect_desktop"

        Then I hide toolbar icon "New Dossier (Web and Desktop)"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_newdossier_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_newdossier_desktop"

        Then I hide toolbar icon "Account (Web and Desktop)"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_account_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "05_lh_off_account_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"

