@TC87177 @EnvSwitch @Regression
Feature: 96_Env_Switch_Err_Handling
    1. test case where targeted application is deleted after saving 

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment for environment connection testing

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 96_Env_Switch_Err_Handling
        When I select tab "Applications"
        When I switch application environment to "z-env-connection"
        When I click the application create entry
        When I input application name "MSTR_Target_App"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then I verify custom app "MSTR_Target_App" is displayed in application detailed grid
        When I switch application environment to "shared"
        When I click the application create entry
        When I input application name "WS_SwitchEnv_Err_Handling"
        Then I switch to menu "Environment Connection"
        When I add env "z-env-connection" to linked envs
        When I open the application selector dropdown for environment "z-env-connection"
        Then I select the "MSTR_Target_App" application list item
        Then check the screenshot by comparing "96_env_switch_err_handling_01"
        Then I click "Save" button in the tab "environmentConnectionSettings"
        When I switch application environment to "z-env-connection"
        Then I delete the application "MSTR_Target_App"
        When I switch application environment to "shared"
        When I edit the application "WS_SwitchEnv_Err_Handling"
        Then I switch to menu "Environment Connection"
        Then check the screenshot by comparing "96_env_switch_err_handling_02"
        Then I click "Save" button in the tab "environmentConnectionSettings"
        Then I scroll "up" to click tab "Environments"
        Then I remove all connected environments