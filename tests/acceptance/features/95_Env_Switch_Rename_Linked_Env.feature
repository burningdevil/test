@TC87176 @EnvSwitch @Regression
Feature: 95_Env_Switch_Rename_Linked_Env
    1. modify env connections for brand new env application
    2. add new connected env and change its target application
    3. rename newly connected env and validate validity of renamed env
    4. hover on connected env name to display tooltip

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment for environment connection testing

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 95_Env_Switch_Rename_Linked_Env
        When I select tab "Applications"
        When I switch application environment to "shared"
        When I click the application create entry
        When I input application name "WS_SwitchEnv_Rename"
        Then I switch to menu "Environment Connection"
        When I add env "z-env-connection" to linked envs
        When I double click the "z-env-connection" name cell to focus on it
        Then check the screenshot by comparing "95_env_switch_rename_linked_env_01"
        When I rename linked env "z-env-connection" to "z-renamed-env-connection-with-ellipses"
        Then check the screenshot by comparing "95_env_switch_rename_linked_env_02"
        When I hover over "z-renamed-env-connection-with-ellipses" to display tooltip
        Then check the screenshot by comparing "95_env_switch_rename_linked_env_03"
        Then I click "Save" button in the tab "environmentConnectionSettings"
        Then I delete the application "WS_SwitchEnv_Rename"
        Then I scroll "up" to click tab "Environments"
        Then I remove environment "z-env-connection"