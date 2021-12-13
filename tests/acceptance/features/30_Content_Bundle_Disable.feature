@TC80105 @Feature
Feature: 30_Content_Bundle_Disable
    1. add environment
    2. chose dossier as home
    3. check the content tab is disabled

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 30_Content_Bundle_Disable
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_Auto_ContentBundle_Disable"
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then check the screenshot by comparing "30_content_bundle_disable_when_dossier_home"
        Then I switch to menu "Components"
        Then I click "Cancel" button in the tab "components"

