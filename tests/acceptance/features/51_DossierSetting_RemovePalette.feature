@TC82189 @Regression 
Feature: 51_DossierSetting_RemovePalette
    1. add Environment
    2. add new application
    3. switch to dossier setting tab
    4. enable custom palette mode
    5. click the add new button
    6. pick palette and Save
    7. remove
    

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 51_DossierSetting_RemovePalette
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Dossier Settings"
        When I enable the custom palette mode "Specify color palettes for this application"
        When I enter the palette pick panel
        Then I pick palette "Agave"
        Then I pick palette "Arctic"
        Then I comfirm the palette selection
        Then check the screenshot by comparing "51_DossierSetting_RemovePalette_1"
        When I remove the "Arctic" from the list
        Then check the screenshot by comparing "51_DossierSetting_RemovePalette_2"
        





        
        

      

