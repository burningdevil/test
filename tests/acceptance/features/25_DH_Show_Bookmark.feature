@TC88584 @DossierAsHome @Regression
Feature: 25_DH_Show_Bookmark
    1. add environment
    2. add new application
    3. choose dossier as home
    4. switch to component tab
    5. check the preview of tablet, phone, web and desktop when bookmark icon is off
    6. check the preview of tablet, phone, web and desktop when bookmark icon is on



    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 25_DH_Show_Bookmark
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"

        Then I hide toolbar icon "Bookmark"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_off_bookmark_desktop01"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_off_bookmark_web02"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_off_bookmark_tablet03"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_off_bookmark_phone04"

        Then I show toolbar icon "Bookmark"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_on_bookmark_desktop05"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_on_bookmark_web06"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_on_bookmark_tablet07"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "25_dh_on_bookmark_phone08"
        
        Then I click "Save" button in the tab "components"
