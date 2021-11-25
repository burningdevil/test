@TC78845 @Regression
Feature: 07_LH_PlatformSpecific
    1. add environment
    2. add new application
    3. switch to component tab and capture the default option status
    4. check the preview of tablet, phone, web and desktop when off Data Search
    5. check the preview of tablet, phone, web and desktop when off HyperIntelligence
    6. check the preview of tablet, phone, web and desktop when off Font Size in Grid

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 07_LH_PlatformSpecific
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Components"
        Then I hide toolbar icon "Data Search (Desktop Only)"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "07_lh_off_datasearch_desktop"

        Then I hide toolbar icon "HyperIntelligence (Desktop Only)"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "07_lh_off_hyperintelligence_desktop"

        Then I hide toolbar icon "Font Size in Grid (iOS Only)"
        When I choose the "Web" client preview
        Then check the screenshot by comparing "07_lh_off_aa_tablet"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "07_lh_off_aa_phone"
        Then I click "Save" button
        Then I delete the application "New Application"

