@TC78812
Feature: Create applications WSAuto_DossierHome_DisableToolbar
    1. add environment
    2. create application: WSAuto_DossierHome_DisableToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_DossierHome_DisableToolbar
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_DossierHome_DisableToolbar"
        When I input application description "This application is set as dossier home and disable toolbar"
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "BaseNetviz"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Disable toolbar"
        Then check the screenshot by comparing "06_dossierhome_disable"
        Then I click "Save" button
        Then I delete the application "WSAuto_DossierHome_DisableToolbar"
