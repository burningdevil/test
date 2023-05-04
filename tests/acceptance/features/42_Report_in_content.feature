@TC88658_2 @ReportInContent @Regression
Feature: 42_Report_in_content
    1. add environment
    2. create application
    3. add the content
    4. edit content

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all content groups except "Automation-Used-Not-Delete" by api
        Given I create content groups with reports by rest api
        Given configure workstation engine test environment
        
    @hook_close_application_editor_dialog_if_necessary @hook_clean_content_groups
    Scenario: 42_Report_in_content
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_report_in_content_groups_42"       
        Then I switch to menu "Content"
        Then I add the content
        When I choose "Automation-Used-Not-Delete" in content group picker
        Then I finished select content bundle
        Then I add the content
        Then I select the all checkbox
        Then I expand the content bundle "G1"
        Then check the screenshot by comparing "42_report_in_content_group_expanded01"
        Then I finished select content bundle
        Then I remove the content bundle "Automation-Used-Not-Delete"
        Then I expand the content bundle "G1"
        Then check the screenshot by comparing "42_report_in_content_group_expanded02"
        Then I click "Save" button in the tab "contentBundles"
        