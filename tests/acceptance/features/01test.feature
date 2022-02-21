@01test
Feature: Create applications
    1. add environment
    2. create application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: create application with custom name, libray as home
        When I select tab "Applications"
        Then check the screenshot on element "detailGrid" by comparing "00-app_detail_grid"
        When I click the application create entry
        When I input application name "Auto_DossierAsHome"
        When I input application description "1234"
        Then I switch to menu "Home Screen"
        #Then I choose "Use a dossier or document in the current server as the home screen" as home
        #Then I choose "Documents" menu and pick document "BubbleMarker_Si"
        Then I switch to menu "Components"
        Then I hide toolbar icon "Filter"
        Then I hide toolbar icon "Share"
        Then I click "Save" button in the tab "Components"
        Then check the screenshot by comparing "01-add_new_custom_app"
        Then I delete the application "Auto_DossierAsHome"
        #Then I sort the application list by "Name"
        #Then I deselect column "Home" display
        #When I copy link of the application "Auto_LibraryAsHome"
