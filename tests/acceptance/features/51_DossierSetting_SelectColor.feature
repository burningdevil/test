@TC82189 @Regression
Feature: 51_DossierSetting_SelectColor
    1. add Environment
    2. add new application
    3. switch to dossier setting tab
    4. enable custom palette mode
    5. click the add new button
    6. enter create palette panel
    7. pick color
    

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 51_DossierSetting_SelectColor
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Dossier Settings"
        When I enable the custom palette mode "Specify color palettes for this application"
        When I enter the palette pick panel
        When I enter the palette create panel
        Then check the screenshot by comparing "51_DossierSetting_PickColor_1"
        Then I pick color "Rose #FBDAD9"
        Then I pick color "Buttermilk #FFF3B3"
        Then check the screenshot by comparing "51_DossierSetting_PickColor_2"


        
        

      

