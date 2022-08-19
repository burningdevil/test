@DE236952 @Regression
Feature: 61_Custom_app_modify_acl_and_app_name
    1. add Environment
    2. add new application
    3. open custom app get info
    4. modify acl by remove user group
    5. edit custom app
    6. review acl user groups


    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_application_info_window1
    Scenario: 61_Custom_app_modify_acl_and_app_name
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
        When I input application name "New Application updated"
        Then I click "Save" button in the tab "general"
        Then I click getinfo of the application "New Application updated"
        When I select "Security Access" tab in application info window
        Then I verify usergroup "System Monitors" should not display








