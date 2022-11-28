@customemail4 @TC84106 @Sanity @Regression
Feature: 83_Custom_email_long_text
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. use long strings with special chars and dynamic text
    5. save
    6. edit app

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary
    @hook_close_application_editor_dialog_if_necessary
    Scenario: 83_Custom_email_long_text
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Subject & Body Text" section
        When I input "'<>& \"<h1> <br> \/i helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous." in section "1" of "SHARE_BOOKMARK"
        When I input "'<>& \"<h1> <br> \/ite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous.The world's most elite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous.The world's most elite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous.The world's most elite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous.The world's most elite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more danger12345678dkfkkkk1000" in section "2" of "SHARE_BOOKMARK"
        When I select "DossierName" from dropdown list in section "1" of "SHARE_DOSSIER"
        Then check the screenshot by comparing "83_Custom_email_long_text_01"
        When I expand "Email Sender" section
        When I input "MicroStrategy Library MicroStrategy Library MicroStrategy Library" in "Display Name"
        When I input "library@microstrategymicrostrategymicrostrategymicrostrategy.com" in "Email Address"
        When I expand "Branding Image" section
        When I input "https://www.nicepng.com/png/full/610-6106039_image-result-for-online-transparent-all-online-services.png" in "Image URL"
        Then check the screenshot by comparing "83_Custom_email_long_text_02"
        When I expand "Action Button" section
        When I input "'<>& \"<h1> <br> \/ReceipientName" on button "View in Browser"
        When I input "'<>& \"<h1> <br> \/ReceipientName" on button "View in Mobile App"
        Then check the screenshot by comparing "83_Custom_email_long_text_03"
        When I expand "Notification Reminder" section
        When I input "'<>& \"<h1> <br> \/ite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous." in reminder
        When I input "'<>& \"<h1> <br> \/ite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous." in "Link Text"
        When I expand "Sent By" section
        When I input "'<>& \"<h1> <br> \/ite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous." in "Sent By"
        When I expand "Social Media" section
        When I input "'<>& \"<h1> <br> \/ite helicopter rescue team is more important than ever, as skiers and snowboarders venture further in the backcountry and climate change makes mountain conditions more dangerous." URL in "Facebook"
        Then check the screenshot by comparing "83_Custom_email_long_text_04"
        When I click "Save" button in the tab "customEmailSettings"
        When I edit the application "New Application"
        When I switch to menu "Email Communication"
        When I expand "Preview" section
        When I expand "Subject & Body Text" section
        Then check the screenshot by comparing "83_Custom_email_long_text_05"
        When I expand "Notification Reminder" section
        When I expand "Sent By" section
        When I expand "Social Media" section
        When I disable media "Twitter"
        Then check the screenshot by comparing "83_Custom_email_long_text_06"
        When I click "Save" button in the tab "customEmailSettings"
