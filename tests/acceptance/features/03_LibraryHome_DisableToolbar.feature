@TC78811
Feature: Create applications WSAuto_LibraryHome_DisableToolbar
    1. add environment
    2. create application: WSAuto_LibraryHome_DisableToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_LibraryHome_DisableToolbar
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_LibraryHome_DisableToolbar"
        When I input application description "This application is set as libary home and disable toolbar"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Disable toolbar"
        Then I click "Save" button
         Then I delete the application "WSAuto_LibraryHome_DisableToolbar"