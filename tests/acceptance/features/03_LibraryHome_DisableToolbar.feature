@TC78811 @Regression
Feature: Create applications WSAuto_LibraryHome_DisableToolbar
    1. add environment
    2. create application: WSAuto_LibraryHome_DisableToolbar

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application WSAuto_LibraryHome_DisableToolbar
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WSAuto_LibraryHome_DisableToolbar"
        When I input application description "This application is set as library home and disable toolbar"
        Then check the screenshot by comparing "03_libraryhome_1"
        Then I switch to menu "Components"
        Then I choose the toolbar mode "Disable toolbar"
        Then check the screenshot by comparing "03_libraryhome_disable"
        Then I click "Save" button
        Then I delete the application "WSAuto_LibraryHome_DisableToolbar"