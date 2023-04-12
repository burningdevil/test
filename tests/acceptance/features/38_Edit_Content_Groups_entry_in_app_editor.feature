@TC88785 @ContentGroupEditor @Regression
Feature: 38_Edit_Content_Groups_entry_in_app_editor
    1. add environment
    2. create application
    3. add the content
    4. edit contents

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all content groups except "Automation-Used-Not-Delete" by api
        Given I create content groups by rest api
        Given configure workstation engine test environment
        
    @hook_close_application_editor_dialog_if_necessary @hook_clean_content_groups
    Scenario: 38_Edit_Content_Groups_entry_in_app_editor
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_edit_content_groups_38"       
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        When I select content groups by name "G1,G2" in application editor
        When I right click on "G1" to open context menu
        Then check the screenshot on element "contextMenuOfContentTab" by comparing "38_LH_single_select_content_groups_01"
        When I select content groups by name "G1" in application editor
        When I right click on "G1" to open context menu
        Then check the screenshot on element "contextMenuOfContentTab" by comparing "38_LH_multi_select_content_groups_02"
        Then I click "Save" button in the tab "contentBundles"

