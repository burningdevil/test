@TC78811
Feature: Create applications WSAuto_LibraryHome_CollapseToolbar
    1. add environment
    2. create application: WSAuto_LibraryHome_CollapseToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_LibraryHome_CollapseToolbar
        When I select tab "ANALYSIS"
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_LibraryHome_CollapseToolbar"
        When I input application description "This application is set as libary home and collapse toolbar"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Collapse toolbar by default"
        Then I click "Save" button