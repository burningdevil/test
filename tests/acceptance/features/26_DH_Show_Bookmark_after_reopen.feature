@TC88584 @DossierAsHome @Regression
Feature: 26_DH_Show_Bookmark_after_reopen
    1. add environment
    2. add new application
    3. choose dossier as home
    4. switch to component tab
    5. hide bookmark icon and save it
    6. re-open the custom app and show bookmark icon



    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 26_DH_Show_Bookmark_after_reopen
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"
        Then I hide toolbar icon "Bookmark"
        Then check the screenshot by comparing "26_dh_off_bookmark01"
        Then I click "Save" button in the tab "components"
        When I edit the application "New Application"
        Then I switch to menu "Components"
        Then check the screenshot by comparing "26_dh_off_bookmark02"
        Then I show toolbar icon "Bookmark"
        Then check the screenshot by comparing "26_dh_on_bookmark03"
        Then I click "Save" button in the tab "components"
        When I edit the application "New Application"
        Then I switch to menu "Components"
        Then check the screenshot by comparing "26_dh_on_bookmark04"
        Then I click "Save" button in the tab "components"

