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
        When I click the application create entry
        When I input application name "WS_sort_applications_11"
        When I input application description "WS name and description"
        Then I switch to menu "Components"
        Then I click "Save" button in the tab "components"
        # When I toggle column "Date Modified,Date Created" in application grid to "hide"
        When I sort the application list by "Name"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_name_asc_01"
        When I sort the application list by "Name"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_name_desc_02"
        When I sort the application list by "Description"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_description_asc_03"
        When I sort the application list by "Description"
        Then check the screenshot on element "detailGrid" by comparing "11_sort_description_desc_04"

