@TC82189 @Regression
Feature: 51_DossierSetting_PickPalette
    1. add Environment
    2. add new application
    3. switch to dossier setting tab
    4. enable custom palette mode
    5. click the add new button
    6. pick palette
    

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 51_DossierSetting_PickPalette
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Dossier Settings"
        When I enable the custom palette mode "Specify color palettes for this application"
        When I enter the palette pick panel
        Then I pick palette "Agave"
        Then I pick palette "Anemone"
        Then I pick palette "Arctic"
        Then check the screenshot by comparing "51_DossierSetting_PickPalette_1"
        Then I comfirm the palette selection
        Then check the screenshot by comparing "51_DossierSetting_PickPalette_2"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"


      

