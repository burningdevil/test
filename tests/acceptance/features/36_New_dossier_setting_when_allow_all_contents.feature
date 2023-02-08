@TC87870 @Regression
Feature: 36_New_dossier_setting_when_allow_all_contents
    1. add environment
    2. create application
    3. add the content
    4. set to allow/limit all contents
    5. check preview

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 36_New_dossier_setting_when_allow_all_contents
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_All_contents_settings36"
        Then I switch to menu "Components"
        Then check the screenshot by comparing "36_new_dossier_on_and_enabled01"
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        Then I switch to menu "Components"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_off_desktop02"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_off_web03"
        
        Then I switch to menu "Content"
        When I open all content setting dropdown
        When I choose "allow" all content setting under content tab
        Then I switch to menu "Components"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_on_tablet04"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_on_phone05"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_on_web06"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "36_add_dossier_off_desktop07"

        Then I hide toolbar icon "New Dossier (Web and Desktop)"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "36_off_new_dossier_tablet08"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "36_off_new_dossier_phone09"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "36_off_new_dossier_web10"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "36_off_new_dossier_desktop11"

        Then I switch to menu "Content"
        Then I click "Save" button in the tab "contentBundles"

