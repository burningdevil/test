@TC78839 @Regression @Sanity
Feature: 10_DeleteApp
    1. add environment
    2. delete application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 10_DeleteApp
        When I select tab "Applications"
        
        When I click the application create entry
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        Then check the screenshot on element "detailGrid" by comparing "10_add_application"
        Then I delete the application "New Application"
        Then check the screenshot on element "detailGrid" by comparing "10_delete_application"




