@TC87870 @Regression
Feature: 34_Show_All_Contents_default_Status
    1. add environment
    2. create application
    3. switch to content tab and check all content setting default status
    4. add the content
    5. check all content setting status

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 34_Show_All_Contents_default_Status
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_All_contents_settings34"
        Then I switch to menu "Content"
        Then check the screenshot by comparing "34_All_contents_disable01"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        Then check the screenshot by comparing "34_All_contents_enabled02"
        Then I click "Save" button in the tab "contentBundles"

