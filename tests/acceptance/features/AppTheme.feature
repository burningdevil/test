@AppTheme
Feature: App Theme cases
    1. add environment
    2. create new application
    3. input invalid url and take screenshots
    4. apply, then save
    5. delete "New Application" app
    6. edit existing "Dark Theme" app
    7. switch to select color themem and take screenshots
    8. apply, then save
    9. edit existing "Light Color" app
    10. change custom color via color picker
    11. change custom color via input valid hex color code
    12. change custom color via input invalid hex color code
    13. apply, then save
    14. edit existing "Light Color" app
    15. change custom color via input hex color code for toolbar, sidebar, panel and misc
    16. apply, then save

    Background: Add Environment
        Given configure workstation engine test environment

    Scenario: AppTheme cases
        When I select tab "Applications"

        When I click the application create entry
        When I switch to menu "Appearance"
        When I click enter appearance editor
        When I input WebLogo url "https://uk.fff.fr" in appearance editor
        When I input WebFavicon url "https://uk.fff.fr/favicon" in appearance editor
        When I input MobileLogo url "htt" in appearance editor
        When I select color theme 'light' in appearance editor
        Then check the screenshot by comparing "lightThemeWithLogoErrors"
        When I click apply button in appearance editor
        Then I click "Save" button in the tab "appearance"
        Then I delete the application "New Application"

        When I edit the application "Dark Theme"
        When I switch to menu "Appearance"
        When I click edit appearance button
        When I select color theme 'red' in appearance editor
        Then check the screenshot by comparing "redTheme"
        When I select color theme 'yellow' in appearance editor
        Then check the screenshot by comparing "yellowTheme"
        When I select color theme 'darkBlue' in appearance editor
        Then check the screenshot by comparing "darkBlueTheme"
        When I select color theme 'green' in appearance editor
        Then check the screenshot by comparing "greenTheme"
        When I select color theme 'blue' in appearance editor
        Then check the screenshot by comparing "blueTheme"
        When I select color theme 'dark' in appearance editor
        Then check the screenshot by comparing "darkTheme"
        When I click apply button in appearance editor
        Then I click "Save" button in the tab "appearance"

        When I edit the application "Light Color"
        When I switch to menu "Appearance"
        When I click edit appearance button
        Then I set custom theme property "toolbarFill" via color picker in appearance editor
        Then I select color picker color "Buttermilk #FFF3B3"
        Then I set custom theme property "toolbarColor" via input "FBDAD9" in appearance editor
        Then I set custom theme property "toolbarColor" via input "345aa" in appearance editor
        Then check the screenshot by comparing "customTheme"
        When I click apply button in appearance editor
        Then I click "Save" button in the tab "appearance"

        When I edit the application "Light Color"
        When I switch to menu "Appearance"
        When I click edit appearance button
        Then I set custom theme property "toolbarFill" via input "C90E24" in appearance editor
        Then I set custom theme property "toolbarColor" via input "83C962" in appearance editor
        Then I set custom theme property "sidebarFill" via input "B496DD" in appearance editor
        Then I set custom theme property "sidebarColor" via input "DEDEDE" in appearance editor
        Then I set custom theme property "sidebarActiveFill" via input "E14B59" in appearance editor
        Then I set custom theme property "sidebarActiveColor" via input "C1292F" in appearance editor
        Then I set custom theme property "panelFill" via input "1C8DD4" in appearance editor
        Then I set custom theme property "panelColor" via input "3A2471" in appearance editor
        Then I set custom theme property "canvasFill" via input "F3F1F1" in appearance editor
        Then I set custom theme property "accentColor" via input "7B5B31" in appearance editor
        Then I set custom theme property "buttonColor" via input "35383A" in appearance editor
        Then I set custom theme property "notificationBadgeFill" via input "FFDA18" in appearance editor
        Then check the screenshot by comparing "customTheme_all"
        When I click apply button in appearance editor
        Then I click "Save" button in the tab "appearance"