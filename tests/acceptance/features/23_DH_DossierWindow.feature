@TC78877 @Regression
Feature: 23_DH_DossierWindow
    1. add environment
    2. add new application
    3. switch to home screen tab and pick dossier
    4. check the preview of tablet, phone, web and desktop when off TOC
    5. check the preview of tablet, phone, web and desktop when off Filter/Comment/Share/Notification/Account
    6. check the preview of tablet, phone, web and desktop when off Undo/Edit


    10. check the preview of tablet, phone, web and desktop when off Edit Dossier

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 23_DH_DossierWindow
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"

        Then I hide toolbar icon "Table of Contents"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_toc_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_toc_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_toc_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_toc_desktop"


        Then I hide toolbar icon "Filter"
        Then I hide toolbar icon "Comments"
        Then I hide toolbar icon "Share"
        Then I hide toolbar icon "Notifications"
        Then I hide toolbar icon "Account"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_filter_comment_share_notification_account_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_filter_comment_share_notification_account_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_filter_comment_share_notification_account_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_filter_comment_share_notification_account_desktop"

        Then I hide toolbar icon "Undo"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_undo_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_undo_desktop"

        Then I hide toolbar icon "Edit Dossier (Web and Desktop)"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_edit_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "23_dh_off_edit_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
