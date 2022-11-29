@TC85342 @Regression
Feature: 15_LH_Insight_entry_save_and_reopen
    1. add environment
    2. add new application
    3. hide insight
    4. save new application
    5. edit custom app and check the preview of tablet, phone, web and desktop when disable/enable insight

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        Given close application dialog if necessary

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 15_LH_Insight_entry_save_and_reopen
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I open the sidebar collapse

        Then I hide toolbar icon "Insights(Web only)"
        Then I click "Save" button in the tab "components"
        When I edit the application "New Application"
        Then I switch to menu "Components"
        Then I open the sidebar collapse

        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "15_lh_off_insight_tablet01"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "15_lh_off_insight_phone02"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "15_lh_off_insight_web03"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "15_lh_off_insight_desktop04"

        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
