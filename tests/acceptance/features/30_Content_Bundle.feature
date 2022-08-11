@TC80105 @Feature
Feature: 30_Content_Bundle
    1. add environment
    2. create application
    3. input name
    4. add the content

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 30_Content_Bundle
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_Auto_ContentBundle"
        Then I switch to menu "Content"
        When I input default group name ""
        Then I click the section title tip icon to show preview
        Then check the screenshot by comparing "30_content_bundle_title_empty_tip"
        When I input default group name "Automation Groups"
        Then I click the section title tip icon to show preview
        Then check the screenshot by comparing "30_content_bundle_title_tip"
        Then I add the content "Automation-Used-Not-Delete"
        Then I pick the dossier "Automation-Used-Not-Delete" in the add content dialog
        Then I select the all checkbox
        Then I expand the content bundle "Automation-Used-Not-Delete"
         Then check the screenshot by comparing "30_content_bundle_collapse"
        Then I remove the content bundle "Automation-Used-Not-Delete"
        Then check the screenshot by comparing "30_content_bundle_remove"
        Then I switch to menu "Components"
        Then I open the sidebar collapse
        When I choose the "Tablet" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_tablet"
        When I choose the "Phone" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_phone"
        When I choose the "Web" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_web"
        When I choose the "Desktop" client preview in the tab "components"
        Then check the screenshot by comparing "30_content_bundle_desktop"
        Then I click "Save" button in the tab "components"
        Then I delete the application "WS_Auto_ContentBundle"

