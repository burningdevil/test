@TC87870 @Regression @Sanity
Feature: 37_New_dossier_in_appears
    1. add environment
    2. create application
    3. add the content
    4. set to allow/limit all contents
    5. check in appearance

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 37_New_dossier_in_appears
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_All_contents_settings37"
        Then I switch to menu "Appearance"
        When I click enter appearance editor
        Then check the screenshot by comparing "37_add_dossier_on_appearance01"
        When I click apply button in appearance editor
        
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        Then I switch to menu "Components"
        Then check the screenshot by comparing "37_add_dossier_off_components02"
        
        Then I switch to menu "Appearance"
        When I click edit appearance button
        Then check the screenshot by comparing "37_add_dossier_off_appearance03"
        When I click apply button in appearance editor

        Then I switch to menu "Content"
        When I open all content setting dropdown
        When I choose "allow" all content setting under content tab

        Then I switch to menu "Appearance"
        When I click edit appearance button
        Then check the screenshot by comparing "37_add_dossier_on_appearance04"
        When I click apply button in appearance editor

        Then I switch to menu "Content"
        Then I click "Save" button in the tab "contentBundles"

