@TC89007 @FolderBrowsing @Regression
Feature: 43_Folder_Browsing_config
    1. add environment
    2. create application
    3. switch components tab and expand sidebar
    4. set Content Discovery
    5. check preview
    6. save and re-open

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 43_Folder_Browsing_config
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_folder_browsing_settings43"
        Then I switch to menu "Components"
        When I open the sidebar collapse
        
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_off_tablet01"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_off_phone02"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_off_web03"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_off_desktop04"

        Then I show toolbar icon "Content Discovery"
        Then check the screenshot by comparing "43_Folder_Browsing_on_01"
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_on_tablet05"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_on_phone06"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_on_web07"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "43_Folder_Browsing_default_on_desktop08"

        Then I click "Save" button in the tab "components"
        When I edit the application "WS_folder_browsing_settings43"
        Then I switch to menu "Components"
        When I open the sidebar collapse
        Then check the screenshot by comparing "43_Folder_Browsing_on_reopen_09"
        Then I click "Save" button in the tab "components"

