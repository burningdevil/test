@TC78845 @Regression
Feature: 08_LH_Sidebar
    1. add environment
    2. add new application
    3. switch to component tab
    4. check the preview of tablet, phone, web and desktop when off Data Search
    5. check the preview of tablet, phone, web and desktop when off HyperIntelligence
    6. check the preview of tablet, phone, web and desktop when off Font Size in Grid
    7. turn off the Sidebar and check the i info


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario:  08_LH_Sidebar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I hide toolbar icon "Sidebar"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
