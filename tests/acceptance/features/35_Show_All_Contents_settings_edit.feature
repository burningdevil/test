@TC87870 @Regression
Feature: 35_Show_All_Contents_settings_edit
    1. add environment
    2. create application
    3. add the content
    4. set to allow all contents and save
    5. re-open and set to limit contents, save Applications
    6. re-open and check setting persists

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 35_Show_All_Contents_settings_edit
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_All_contents_settings35"
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        Then check the screenshot by comparing "35_All_contents_enabled01"
        When I open all content setting dropdown
        When I choose "allow" all content setting under content tab
        Then check the screenshot by comparing "35_allow_all_contents02"
        Then I click "Save" button in the tab "contentBundles"
        When I edit the application "WS_All_contents_settings35"
        Then I switch to menu "Content"
        Then check the screenshot by comparing "35_allow_all_contents_kept03"
        When I open all content setting dropdown
        When I choose "limit" all content setting under content tab
        Then check the screenshot by comparing "35_limit_all_contents04"
        Then I click "Save" button in the tab "contentBundles"
        When I edit the application "WS_All_contents_settings35"
        Then I switch to menu "Content"
        Then check the screenshot by comparing "35_limit_all_contents_kept05"
        Then I click "Save" button in the tab "contentBundles"

