@TC85142 @Regression
Feature: 33_Content_Bundle_DE241455_Right_click_when_no_selected
    1. add environment
    2. create application
    3. switch to content tab
    4. right click on content grid when nothing selected

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: Content_Bundle_DE241455_Right_click_when_no_selected
        When I select tab "Applications"
        When I click the application create entry
        When I input application name "DE241455"
        Then I switch to menu "Content"
        Then check the screenshot by comparing "33_DE241455_01Right_click_when_no_selected"
        Then I move mouse to content bundle grid and right click
        Then check the screenshot by comparing "33_DE241455_02Right_click_when_no_selected"
        When I input default group name ""
        Then I add the content
        Then I select the all checkbox
        Then I finished select content bundle
        Then I move mouse to content bundle grid and right click
        Then check the screenshot by comparing "33_DE241455_03Right_click_when_no_selected"
        Then I click "Save" button in the tab "contentBundles"
        Then I delete the application "DE241455"

