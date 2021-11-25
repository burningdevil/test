@TC78877_1 @Regression
Feature: 24_DH_PlatformSpecific
    1. add environment
    2. add new application
    3. choose dossier as home
    4. switch to component tab
    5. check the preview of tablet, phone, web and desktop when off Data Search
    6. check the preview of tablet, phone, web and desktop when off HyperIntelligence
    7. check the preview of tablet, phone, web and desktop when off Font Size in Grid



    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: 24_DH_PlatformSpecific
        When I select tab "Applications"
        When I click the application create entry
        Then I switch to menu "Home Screen"
        Then I choose "Use a dossier or document in the current server as the home screen" as home
        Then I choose "Dossiers" menu and pick document "Rustic"
        Then I switch to menu "Components"
        Then I hide toolbar icon "Data Search (Desktop Only)"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "24_dh_off_datasearch_desktop"

        Then I hide toolbar icon "HyperIntelligence (Desktop Only)"
        When I choose the "Desktop" client preview
        Then check the screenshot by comparing "24_dh_off_hyperintelligence_desktop"

        Then I hide toolbar icon "Font Size in Grid (iOS Only)"
        When I choose the "Tablet" client preview
        Then check the screenshot by comparing "24_dh_off_aa_tablet"
        When I choose the "Phone" client preview
        Then check the screenshot by comparing "24_dh_off_aa_phone"
        Then I click "Save" button
        Then I delete the application "New Application"
