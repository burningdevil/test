@TC78845 @Regression
Feature: 08_LH_Sidebar_Mobile
    1. add environment
    2. add new application
    3. switch to component tab
    4. collaps the Sidebar
    5. disable the add library
    6. disable the mobile account


    Background: Add Environment
        Given configure workstation engine test environment

    Scenario:  08_LH_Sidebar_Mobile
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I open the sidebar collapse
        Then I hide toolbar icon "Add Library (Mobile only)"
        Then I hide toolbar icon "Account (Mobile only)"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
