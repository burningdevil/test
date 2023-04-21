@TC88785 @ContentGroupEditor @Regression
Feature: 40_Content_Groups_properties
    1. add environment
    2. create application
    3. add the content
    4. open content group properties dialog

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all content groups except "Automation-Used-Not-Delete" by api
        Given I create content groups by rest api
        Given configure workstation engine test environment
        
    @hook_close_application_editor_dialog_if_necessary @hook_clean_content_groups
    Scenario: 40_Content_Groups_properties
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_content_groups_properties_40"       
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        When I select content groups by name "G1" in application editor
        When I right click on "G1" to open context menu
        When I open properties dialog of content group "G1"
        Then check group name is "G1" in content group info window
        When I close content group info dialog of "G1"
        When I right click on "G2" to open context menu
        When I open properties dialog of content group "G2"
        Then check group name is "G2" in content group info window
        When I close content group info dialog of "G2"
        Then I click "Save" button in the tab "contentBundles"
        