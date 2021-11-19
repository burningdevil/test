@TC78812
Feature: Create applications WSAuto_DocumentHome_CollapseToolbar
    1. add environment
    2. create application: WSAuto_DocumentHome_CollapseToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_DocumentHome_CollapseToolbar
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_DocumentHome_CollapseToolbar"
        When I input application description "This application is set as document home and collapse toolbar"
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Documents" menu and pick document "BubbleMarker_Si"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Collapse toolbar by default"
        Then check the screenshot by comparing "07_documenthome_collapse"
        Then I click "Save" button
        Then I delete the application "WSAuto_DocumentHome_CollapseToolbar"
