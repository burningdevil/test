@TC78839 @Regression
Feature: Delete applications
    1. add environment
    2. delete application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: Delete applications
        When I select tab "Applications"
        When I click the application create entry
        Then I click "Save" button
        Then check the screenshot on element "detailGrid" by comparing "10_add_application"
        Then I delete the application "New Application"
        Then check the screenshot on element "detailGrid" by comparing "10_delete_application"


      

