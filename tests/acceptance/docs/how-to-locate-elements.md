# How To Locate Elements
To interact with Workstation, we need drivers supporting the automation of Windows PC Desktop applications / OS X desktop applications. Appium is selected since it has the ability to automate both Windows and Mac Desktop apps. For Windows, Appium relies on a project from Microsoft called WinAppDriver(WAD). For Mac, Appium has its own appium-mac-driver and relies on a native OS X binary called AppiumForMac, however, the AppiumForMac binary is needed for talking to the system Accessibility APIs. 

## API Library
Protractor has wrapped the WebDriverJS APIs and also its extra APIs. We use these APIs to talk to the Chrome Driver. Please check the Protractor APIs [here](https://www.protractortest.org/#/api).

WD library is used as the Client for the Native drivers. Please check WD APIs [here](https://github.com/admc/wd/blob/master/doc/api.md).

## Unified Element Locator Method for Mac and Windows
WD supports multiple locator strategies to find the elements. We want to avoid using XPath as much as we can since xpath locators are unreadable, hard to debug and very easily subject to change. However, the Appium Mac Driver can only support AXPath, while the WAD can support more WD methods such as locate elements by name, classname, AccessibilityId and xpath.

In order to resolve the issue of using different locator strategies for both mac and windows, we defined a method getNativeElement(obj) that can compose the elements based on it's platform operating system. This method is placed in the RootApp.js file, meaning it is available in all the page js files. Any getter functions in the pages should use this method to locate elements.

All the element locator values use the JSON structure. 

```
getExampleElement(parameter) {
    return this.getNativeElement({
      windows:{
        locators: [
          { method: 'Name', value: `${parameter}` },
          { method: 'ClassName', value: 'Button' },
        ]},
      mac: { xpath: pageObjectName.methodName.replace('ReplaceMe', parameter) }
    });
  }
```

## MAC Native Element Selectors
AppiumForMac binary uses the system Accessibility API in order to automate mac apps.  All elements can only be found using a special kind of XPath selector called "absolute AXPath". All the AXPath selectors use Accessibility API identifiers and properties.

A classic AXPath starts with 'AXApplication' and looks like the path below. We have two tools that can help us to find AXPath selectors.
```
"/AXApplication[@AXTitle='Calculator']/AXMenuBarItems/AXMenuBarItem[@AXTitle='View']/AXMenu/AXMenuItem[@AXTitle='Scientific']"
```

### Tools To Use
1. Getting AXPath with Appium:
- make sure appium is started
- fn key + mouse over to the element
- paste in your file to see the axpath.

2. Inspect AXPath with Accessiblity Inspector
- open Mac Desktop Application Accessibility Inspector
- select Workstation as target, inspect the elements
- On writing axpath using the accessibility inspector, remember that AXLabel element locator doesn't work. To check all the supported element attributes see this [list](https://github.com/appium/appium-for-mac/blob/master/Frameworks/PFAssistive.framework/Versions/L/Headers/PFUIElement.h)


### Basic Rules For A Valid AXPath Selector
- Must begin with /AXApplication.
- Must contain at least one other node following /AXApplication.
- Does not contain "//", or use a wildcard, or specify multiple paths using |.
- May use boolean operators and or or in between multiple comparisons, but may not include both and and or in a single - statement. and and or must be surrounded by spaces.
- Uses single quotes, not double quotes for attribute strings.
- Does not contain spaces except inside quotes and surrounding the and and or operators.
- Does not use predicate strings containing braces [] or parentheses ().
Please check this [list](https://github.com/appium/appium-for-mac/blob/master/Frameworks/PFAssistive.framework/Versions/L/Resources/English.lproj/PFAttributeDescriptions.strings) of all valid accessibility attributes can be used when writing AXpath


### Writing Reusable AXPath Selectors
As AXPath selectors are using the absolute XPaths, they are often quite long. In our test framework, we try to reuse these AXPaths strings by:
* A centralized place to store all the created AXPaths and categorize them according to the Page Objects - File /utils/envUtils/mac_xpath.js
* Some AXPaths should be reused for other AXPaths by concatenating paths
* When referring to the AXPath, replace the parameter text in the AXPath.


## Windows Native Element Locators
Windows support multiple element locator strategies. Currently in use are:
 - elementByName()
 - elementByClassName()
 - elementByAccessibilityId()
To add more locating strategies you can modify the getNativeElement(). We should always try to avoid using XPaths for Windows.

### Tools To Use
1. Inspect Element with [Appium Desktop](https://github.com/appium/appium-desktop):
Appium provides a client called Appium Desktop, which bundles the Appium Server and also an inspect tool.  You can start Appium Server and then start the inspect session from Appium Desktop, and inspect the elements from the inspect session. 

Note: Please use the fixed version 1.15.1 (same as the version installed by the test framework) if you would like to try this out to avoid any WinAppDriver version mismatch problem.

2. Inspect Element with inspect.exe
- install windows-10-sdk
- launch inspect.exe under the `{installPath}\Windows kits\{version}\bin\{osType}` folder
- inspect elements from the inspect.exe window

### Writing Chained Element Selectors
To locate the elements in windows, use the getNativeElement(). The element locators can be chained. For example, the locators below will find an element with className 'Button' under element with Name 'Tab' under the app root.

```
windows:{
        locators: [
          { method: 'Name', value: `Tab` },
          { method: 'ClassName', value: 'Button' },
        ]}
```

## Web Element Locators
To interact with the CEF WebView embedded in Workstation application, it requires the Chrome driver of the matched version of the CEF WebView. That is why custom Chrome drivers are specified in Protractor.

By visiting the CEF Remote Debugging Url in Chrome( by default it is localhost:54213),  Protractor can directly connect to the URL to manipulate these DOM elements. Click on the corresponding link on the CEF Remote Debugging to access the CEF WebView page.  Use the Chrome Developer Tools to inspect the Web Element. 

We suggest always use CSS selectors instead of XPath selectors.
- Xpath locator is much slower than CSS one.
- HTML markup is very easily subject to change.
- Xpath expressions are unreadable and very hard to debug
Whenever you need to filter multiple Web Elements based on specific conditions, use [`filter()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.filter), [`map()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.map), [`reduce()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.reduce) with css locator.

## Read More
[Locate Elements for Page Objects](https://microstrategy.atlassian.net/wiki/spaces/AB/pages/841949832/4+-+Locate+Elements+for+Page+Objects)