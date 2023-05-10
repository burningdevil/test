@TC88658_1 @ReportInContent @Regression
Feature: 42_Edit_Report_in_Content_Groups
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
    Scenario: 42_Edit_Report_in_Content_Groups
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_edit_report_in_content_groups_42"       
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        When I select content groups by name "G1" in application editor
        When I right click on "G1" to open context menu
        When I edit content group "G1"
        When I switch to tab "Content" in content group editor
        Then check total objects in content group editor should be 2
        When I add "Report" by name "Customer List" in content editor
        Then check content group has content object "Customer List"
        When I click "Save" button in content group editor
        When I right click on "G1" to open context menu
        When I edit content group "G1"
        When I switch to tab "Content" in content group editor
        Then check content group has content object "Customer List"
        Then check total objects in content group editor should be 3
        When I click "Cancel" button in content group editor
        Then I click "Save" button in the tab "contentBundles"
        