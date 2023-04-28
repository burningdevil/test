@TC89007 @FolderBrowsing @Regression
Feature: 43_Folder_Browsing_with_content_groups
    1. add environment
    2. create application
    3. set Content Discovery = on
    3. add the content
    4. set to limit all contents = off
    5. check preview
    6. check tooltip when content discovery is disabled

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 43_Folder_Browsing_with_content_groups
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_folder_browsing_with_content_groups43"
        Then I switch to menu "Components"
        When I open the sidebar collapse
        Then I show toolbar icon "Content Discovery"
        Then check the screenshot by comparing "43_Folder_Browsing_on01"
        
        Then I switch to menu "Content"
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        When I hover on allow content setting tooltip
        Then check the screenshot by comparing "43_limit_content_tooltip_02"
        Then I switch to menu "Components"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_limit_content_tablet03"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_limit_content_phone04"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_limit_content_web05"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_limit_content_desktop06"
        When I hover over "Content Discovery" to display tooltip on components tab
        Then check the screenshot by comparing "43_Folder_Browsing_with_limit_content_tooltip07"

        
        Then I switch to menu "Content"
        When I open all content setting dropdown
        When I choose "allow" all content setting under content tab
        Then I switch to menu "Components"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_allow_content_tablet08"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_allow_content_phone09"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_allow_content_web10"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_with_allow_content_desktop11"

        Then I click "Save" button in the tab "components"

