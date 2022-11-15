@customemail9 @TC85988 @TC84131 @Regression
Feature: 88_Custom_email_error_handling
    1. add Environment
    2. add new application
    3. enable custom email mode
    4. input illeagal string
    5. verify error message

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given I remove all custom color palettes by api
        Given configure workstation engine test environment

    @hook_close_new_application_dialog_if_necessary
    Scenario: 88_Custom_email_error_handling
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Email Sender" section
        When I input "<" in "Display Name"
        Then I verify "Invalid Email Name" error appears
        When I input "library;@microstrategy.com" in "Email Address"
        Then I verify "Invalid Email Address" error appears
        When I expand "Branding Image" section
        When I input "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb.zol-img.com.cn%2Fsoft%2F6%2F612%2FcexabothzEZHY.jpg&refer=http%3A%2F%2Fb.zol-img.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671006255&t=7a9716b523fe53a3a815d0fe3b80ee5f" in "Image URL"
        Then I verify "Please ensure that the URL points to a valid image file" error appears
        When I expand "Action Button" section
        When I change mobile link from "Default" to "URL Scheme"
        When I change dossier to "-" in url scheme
        When I expand "Notification Reminder" section
        Then I verify "Only letters and numbers are supported" error appears