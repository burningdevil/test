@TC88785 @ContentGroupEditor @Regression
Feature: 39_Edit_Content_Groups_name_in_app_editor
    1. add environment
    2. create application
    3. add the content
    4. edit content group name

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all content groups except "Automation-Used-Not-Delete" by api
        Given I create content groups by rest api
        Given configure workstation engine test environment
        
    @hook_close_application_editor_dialog_if_necessary @hook_clean_content_groups
    Scenario: 39_Edit_Content_Groups_name_in_app_editor
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_edit_content_groups_39"       
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        When I select content groups by name "G1" in application editor
        When I right click on "G1" to open context menu
        When I edit content group "G1"
        When I modify content group name by "G1_updated"
        When I switch to tab "Content" in content group editor
        When I click "Save" button in content group editor
        When I right click on "G1" to open context menu
        When I edit content group "G1"
        Then check content group name is "G1_updated"
        When I click "Cancel" button in content group editor
        When I right click on "G2" to open context menu
        When I edit content group "G2"
        Then check content group name is "G2"
        When I click "Cancel" button in content group editor
        Then I click "Save" button in the tab "contentBundles"

