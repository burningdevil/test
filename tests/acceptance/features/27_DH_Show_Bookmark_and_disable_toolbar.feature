@TC88584 @DossierAsHome @Regression
Feature: 27_DH_Show_Bookmark_and_disable_toolbar
    1. add environment
    2. add new application
    3. choose dossier as home
    4. switch to component tab
    5. disable toolbar
    6. enable toolbar and hide bookmark icon
    7. disable toolbar again



    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 27_DH_Show_Bookmark_and_disable_toolbar
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"
        Then check the screenshot by comparing "27_dh_show_bookmark01"
        Then I choose the toolbar mode "Disable toolbar"
        Then check the screenshot by comparing "27_dh_disable_bookmark02"
        Then I click "Save" button in the tab "components"
       

