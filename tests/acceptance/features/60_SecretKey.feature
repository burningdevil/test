@Regression
Feature: 60_SecretKey
    1. add Environment
    2. enter property panel
    3. check secret key property existence in library panel
    
    
    Background: Add Environment
        Given configure workstation engine test environment

    @hook_close_environment_info_window
    Scenario: 60_SecretKey
        When I enter the env "shared" property panel
        When I enter the library tab in property panel 
        When I collapse "Library Server" in the library property panel
        When I collapse "Intelligence Server" in the library property panel
        When I expand the collab security setting in the library property panel
        Then check the screenshot by comparing "60_SecretKeyEnable"



        
