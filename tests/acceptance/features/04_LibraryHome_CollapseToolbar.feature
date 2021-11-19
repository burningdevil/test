@TC78811 @Regression
Feature: Create applications WSAuto_LibraryHome_CollapseToolbar
    1. add environment
    2. create application: WSAuto_LibraryHome_CollapseToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_LibraryHome_CollapseToolbar
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_LibraryHome_CollapseToolbar"
        When I input application description "This application is set as libary home and collapse toolbar"
        Then check the screenshot by comparing "04_libraryhome1"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Collapse toolbar by default"
        Then check the screenshot by comparing "04_libraryhome_collapse"
        Then I click "Save" button
        Then I delete the application "WSAuto_LibraryHome_CollapseToolbar"