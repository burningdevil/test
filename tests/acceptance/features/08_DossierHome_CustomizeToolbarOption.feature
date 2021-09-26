@TC78812
Feature: Create applications WSAuto_DossierHome_CustomizeToolbarOption
    1. add environment
    2. create application: WSAuto_DossierHome_CustomizeToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_DossierHome_CustomizeToolbarOption
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_DossierHome_CustomizeToolbarOption"
        When I input application description "This application is set as dossier home and customize toolbar"
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "BaseNetviz"
        Then I switch to menu "Components"
        Then I hide toolbar icon "Table of Contents"
        Then I hide toolbar icon "Filter"
        Then I hide toolbar icon "Share"
        Then check the screenshot by comparing "08_hide_dossierwindow_option"
        Then I click "Save" button
        Then I delete the application "WSAuto_DossierHome_CustomizeToolbarOption"
