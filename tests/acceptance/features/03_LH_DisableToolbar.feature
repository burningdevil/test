@TC78811 @Regression
Feature: 03_LH_DisableToolbar
    1. add environment
    2. add new application
    3. switch to component tab and disable toolbar
    4. check the preview of tablet, phone, web amd desktop

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 03_LH_DisableToolbar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Disable toolbar"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "03_lh_disable_toolbar_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "03_lh_disable_toolbar_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "03_lh_disable_toolbar_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "03_lh_disable_toolbar_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
