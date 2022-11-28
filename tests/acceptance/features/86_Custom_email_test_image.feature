@customemail7 @TC84096 @Sanity @Regression
Feature: 86_Custom_email_test_image
    1. add Environment
    2. add new application
    4. enable custom email mode
    5. use wide and long image
    6. save changes
    7. send email

    Background: Add Environment
        Given I remove all custom apps except "MicroStrategy" by api
        Given configure workstation engine test environment
        #Given close application dialog if necessary

    @hook_close_application_editor_dialog_if_necessary
    Scenario: 86_Custom_email_test_image
        When I select tab "Applications"
        When I click the application create entry
        When I switch to menu "Email Communication"
        When I enable custom email mode
        When I expand "Preview" section
        When I expand "Branding Image" section
        When I input "https://img2.baidu.com/it/u=326526522,2864057896&fm=253&fmt=auto&app=138&f=JPEG?w=464&h=357%27" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_01"
        When I input "https://www.nicepng.com/png/full/610-6106039_image-result-for-online-transparent-all-online-services.png" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_02"
        When I input "http://10.27.69.39:8080/phone.webp" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_03"
        When I input "https://www.janome.com/inspire/Embroidery/penguin-bmp-design-from-digitizer-10000/penguin-bmp-design-from-digitizer-10000/dig10k_penguin.bmp" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_04"
        When I input "https://img1.baidu.com/it/u=2427796354,2823569173&fm=253&fmt=auto&app=138&f=JPG?w=500&h=329%27" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_05"
        When I input "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01c7565e5a7977a801216518113c7e.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671006085&t=6aef2788c7492b9373500987f3d25361" in "Image URL"
        Then check the screenshot by comparing "86_Custom_email_test_image_06"