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
        Given configure workstation engine test environment

    Scenario:  08_LH_Sidebar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I hide toolbar icon "Sidebar"
        Then I click "Save" button
        Then I delete the application "New Application"
