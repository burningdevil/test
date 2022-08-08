@TC85142 @Regression
Feature: 32_Content_Bundle_No_Certify
    1. add environment
    2. create application
    3. input name
    4. add the content

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 32_Content_Bundle_No_Certify
        When I decertify dossier is "11EA496611E751FB1E9A0080EF25C29E" by project is "B7CA92F04B9FAE8D941C3E9B7E0CD754" by api
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "WS_Auto_CustomApp_ContentBundle_no_certify"
        Then I switch to menu "Content"
        Then check the screenshot by comparing "32_Content_Bundle_No_Certify01_content_home_preview"
        When I input default group name ""
        Then I add the content
        Then I select the all checkbox
        Then I expand the content bundle "Automation-Used-Not-Delete"
        Then check the screenshot by comparing "32_Content_Bundle_No_Certify02_add_content"
        Then I finished select content bundle
        Then check the screenshot by comparing "32_Content_Bundle_No_Certify03_content_collapsed"
        Then I expand the content bundle "Automation-Used-Not-Delete"
         Then check the screenshot by comparing "32_Content_Bundle_No_Certify04_content_expanded"
        Then I click "Save" button in the tab "contentBundles"
        Then I delete the application "WS_Auto_CustomApp_ContentBundle_no_certify"

