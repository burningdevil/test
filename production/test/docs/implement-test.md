#IMPLEMENTING NATIVE AND WEB PAGES

This document will guide you through how to automate a new test case.

## Before Start
- You have already designed a Test Case for one functionality and it is ready/stable to be automated.
- You have the repository in your local and have setup and run successfully.

## Design Cucumber Test Scenarios

## Design and Implement Test Steps

## Implement Page Objects
We typically add any of the web or native pages under "pages" folder.
All the page objects are categorized in 2 folder
    - Native pages
    - Web pages

Each of them have their respective builder.js file, from which all the page objects are exported.

Each page object file has 3 sections
    - Elements Locators (getter functions)
        getters are mainly used to locate the element by using appropriate element locating strategies.
    - Action Methods
        this includes all the action we want to perform by using the element locator methods
    - Assertion Methods
        here we write the assertions methods

Native Pages:
    All pages related to the native workstation app are added here.
    For Ex: SmartTab, Toolabr, MainWindow

    RootApp:
        All the native pages extends RootApp.
        RootApp.js contains all the common methods used by other page objects.

        You can refer to the workstation app using this.app, which is defined in the RootApp.js

    WindowBuilder:
        WindowBuilder returns instances for all the page objects except for the RootApp.

Web Pages:
    All pages built purely using the web components are added here.
    For Ex: QuickSearch

    BasePage:
        All the web pages extends BasePage.
        BasePage.js contains all the common methods used for by other pages.
        And in it's constructor we define these variables for easier usage throught out all the web pages
            constructor(browserInstance) {
                this.brwsr = browserInstance || browser;
                this.$ = this.brwsr.$;
                this.$$ = this.brwsr.$$;
                this.element = this.brwsr.element;
                this.EC = this.brwsr.ExpectedConditions;
            }
    
    PageBuilder:
        PageBuilder returns instances for all the page objects except for the BasePage.

## Test & Debug

## Add Descriptions and POC