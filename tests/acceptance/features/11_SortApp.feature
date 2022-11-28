@TC78813 @Regression
Feature: 11_SortApp
    1. add environment
    2. sort application

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 11_SortApp
        When I select tab "Applications"
        Then I sort the application list by "Name"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_name"
        Then I sort the application list by "Description"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_description"

