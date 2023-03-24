@TC87174 @EnvSwitch @Regression
Feature: 94_Env_Switch_General_Usage
    1. modify env connections for brand new env application
    2. check for validity of available envs
    3. add new connected env and change its target application

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment for environment connection testing

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 94_Env_Switch_General_Usage
        When I select tab "Applications"
        When I switch application environment to "shared"
        When I click the application create entry
        When I input application name "WS_SwitchEnv"
        Then I switch to menu "Environment Connection"
        Then check the screenshot on element "envConnectionCurrentUrl" by comparing "94_env_switch_general_usage_01"
        When I add env "z-env-connection" to linked envs
        Then check the screenshot on element "envConnectionCurrentUrl" by comparing "94_env_switch_general_usage_02"
        Then I click "Save" button in the tab "environmentConnectionSettings"
        Then I delete the application "WS_SwitchEnv"
        Then I scroll "up" to click tab "Environments"
        Then I remove environment "z-env-connection"