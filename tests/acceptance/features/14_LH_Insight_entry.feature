@TC85342 @Regression
Feature: 14_LH_DisableInsight_entry
    1. add environment
    2. add new application
    3. switch to component tab and capture the default option status
    4. check the preview of tablet, phone, web and desktop when disable/enable insight

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        Given close application dialog if necessary

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 14_LH_Insight_entry
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I open the sidebar collapse

        Then I hide toolbar icon "Insights"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_off_insight_tablet01"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_off_insight_phone02"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_off_insight_web03"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_off_insight_desktop04"

        When I show toolbar icon "Insights"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_on_insight_tablet05"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_on_insight_phone06"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_on_insight_web07"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "14_lh_on_insight_desktop08"

        Then I click "Save" button in the tab "components"
        Then I delete the application "New Application"
