@DE263672 @DossierAsHome @Regression
Feature: 28_DH_dossier_picker
    1. add environment
    2. add new application
    3. choose dossier as home
    4. search for dossier in home dossier picker
    5. check grid UI


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 28_DH_dossier_picker
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        When I choose tab "Dossiers" and search for "Rustic" in home dossier picker
        Then check the screenshot by comparing "28_dh_dossier_picker01"
        When I pick dossier "Rustic" in home screen picker
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
       

