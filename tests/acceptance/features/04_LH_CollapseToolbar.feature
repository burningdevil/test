@TC78811 @Regression
Feature: 04_LH_CollapseToolbar
    1. add environment
    2. add new application
    3. switch to component tab and collapse toolbar
    4. check the preview of tablet, phone, web and desktop


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 04_LH_CollapseToolbar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Collapse toolbar by default"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "04_lh_collapse_toolbar_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "04_lh_collapse_toolbar_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "04_lh_collapse_toolbar_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "04_lh_collapse_toolbar_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
