@TC78812 
Feature: 21_DH_DisableToolbar
    1. add environment
    2. add new application
    3. choose dossier as home
    4. switch to component tab and disable toolbar
    5. check the preview of tablet, phone, web and desktop

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 21_DH_DisableToolbar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Disable toolbar"
        When I choose the "Tablet" client preview
        Then check the screenshot by comparing "21_dh_disable_toolbar_tablet"
        When I choose the "Phone" client preview
        Then check the screenshot by comparing "21_dh_disable_toolbar_phone"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "21_dh_disable_toolbar_web"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "21_dh_disable_toolbar_desktop"
        Then I click "Save" button
        Then I delete the application "New Application"
