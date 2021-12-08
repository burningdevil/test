@TC78810 @xhc
Feature: 30_Content_Bundle
    1. add environment
    2. create application
    3. input name and description

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 30_Content_Bundle
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_Auto_ContentBundle"
        Then I switch to menu "Content"
        When I input default group name "Automation Groups"
        Then I add the content "Automation-Used-Not-Delete"
        Then I pick the dossier "Automation-Used-Not-Delete" in the add content dialog
        Then I switch to menu "Components"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "WS_Auto_ContentBundle"

