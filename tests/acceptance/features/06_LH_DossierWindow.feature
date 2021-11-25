@TC78845 @Regression
Feature: 06_LH_DossierWindow
    1. add environment
    2. add new application
    3. switch to component tab and capture the default option status
    4. check the preview of tablet, phone, web and desktop when off TOC
    5. check the preview of tablet, phone, web and desktop when off Bookmark
    6. check the preview of tablet, phone, web and desktop when off Reset
    7. check the preview of tablet, phone, web and desktop when off Filter
    8. check the preview of tablet, phone, web and desktop when off Comments
    9. check the preview of tablet, phone, web and desktop when off Share
    10. check the preview of tablet, phone, web and desktop when off Edit Dossier

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 06_LH_DossierWindow
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"

        Then I hide toolbar icon "Table of Contents"
        Then I hide toolbar icon "Bookmark"
        Then I hide toolbar icon "Reset Dossier"
        When I choose the "Tablet" client preview
        Then check the screenshot by comparing "06_lh_off_toc_bookmark_reset_tablet"
        When I choose the "Phone" client preview
        Then check the screenshot by comparing "06_lh_off_toc_bookmark_reset_phone"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "06_lh_off_toc_bookmark_reset_web"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "06_lh_off_toc_bookmark_reset_desktop"


        Then I hide toolbar icon "Filter"
        Then I hide toolbar icon "Comments"
        Then I hide toolbar icon "Share"
        When I choose the "Tablet" client preview
        Then check the screenshot by comparing "06_lh_off_filter_comment_share_tablet"
        When I choose the "Phone" client preview
        Then check the screenshot by comparing "06_lh_off_filter_comment_share_phone"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "06_lh_off_filter_comment_share_web"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "06_lh_off_filter_comment_share_desktop"

        Then I hide toolbar icon "Undo (Web and Desktop)"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "06_lh_off_undo_web"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "06_lh_off_undo_desktop"

        Then I hide toolbar icon "Edit Dossier (Web and Desktop)"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "06_lh_off_edit_web"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "06_lh_off_edit_desktop"

        Then I click "Save" button
        Then I delete the application "New Application"
