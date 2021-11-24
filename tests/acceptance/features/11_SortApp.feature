@TC78813 @Regression
Feature: 11_SortApp
    1. add environment
    2. sort application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 11_SortApp
        When I select tab "Applications"
        Then I sort the application list by "Name"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_name"
        Then I sort the application list by "Description"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_description"

