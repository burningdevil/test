@TC82189 @Regression
Feature: 51_DossierSetting_EnablePalette
    1. add Environment
    2. add new application
    3. switch to dossier setting tab
    4. enable custom palette mode
    

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 51_DossierSetting_EnablePalette
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Dossier Settings"
        Then check the screenshot by comparing "51_DossierSetting_EnablePalette_1"
        When I enable the custom palette mode "Specify color palettes for this application"
        Then check the screenshot by comparing "51_DossierSetting_EnablePalette_2"
        Then I switch to menu "Components"
        Then I click "Cancel" button in the tab "components"



