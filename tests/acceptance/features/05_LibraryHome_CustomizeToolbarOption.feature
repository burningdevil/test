@TC78811
Feature: Create applications WSAuto_LibraryHome_CustomizeToolbarOption
    1. add environment
    2. create application: WSAuto_LibraryHome_CustomizeToolbarOption

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_LibraryHome_CustomizeToolbarOption
        When I select tab "ANALYSIS"
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_LibraryHome_CustomizeToolbarOption"
        When I input application description "This application is set as libary home and customize toolbar"
        Then I switch to menu "Components"
        Then I hide toolbar icon "Sidebar"
        Then I hide toolbar icon "Search"
        Then I hide toolbar icon "Filter"
        Then I hide toolbar icon "Share"
        Then I click "Save" button