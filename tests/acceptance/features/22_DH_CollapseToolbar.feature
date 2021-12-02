@TC78812 @Regression
Feature: 22_DH_CollapseToolbar
    1. add environment
    2. add new application
    3. choose document as home
    4. switch to component tab and collapse toolbar
    5. check the preview of tablet, phone, web and desktop

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 22_DH_CollapseToolbar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Documents" menu and pick document "Colorful"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Collapse toolbar by default"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "22_dh_collapse_toolbar_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "22_dh_collapse_toolbar_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "22_dh_collapse_toolbar_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "22_dh_collapse_toolbar_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
