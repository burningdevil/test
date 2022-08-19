@DE236952_2 @Regression
Feature: 63_Custom_app_modify_acl_and_color_palette
    1. add Environment
    2. add new application
    3. open custom app get info
    4. modify acl by remove user group
    5. edit custom app color palette
    6. review acl user groups


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_application_info_window2
    Scenario: 63_Custom_app_modify_acl_and_color_palette
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I click getinfo of the application "New Application"
        When I select "Security Access" tab in application info window
        Then I verify usergroup "System Monitors" should display
        Then I select "System Monitors" in ACL configuration tab
        Then I remove user or user group of "System Monitors" in ACL configuration tab
        Then I save changes in application info window
        When I select tab "Applications"
        When I edit the application "New Application"
        Then I switch to menu "Dossier Settings"
        When I enable the custom palette mode "Specify color palettes for this application"
        When I enter the palette pick panel
        Then I pick palette "Agave"
        Then I pick palette "Arctic"
        Then I comfirm the palette selection
        When I choose the "Arctic" as the default palette
        Then I click "Save" button in the tab "dossierSettings"
        Then I click getinfo of the application "New Application"
        When I select "Security Access" tab in application info window
        Then I verify usergroup "System Monitors" should not display








