@TC78813
Feature: Sort applications
    1. add environment
    2. sort application

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: sort application
        When I select tab "Applications"
        Then I sort the application list by "Name"
        Then I sort the application list by "Description"
